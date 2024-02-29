import Hls from "hls.js";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    MdPauseCircleFilled,
    MdPlayCircleFilled,
    MdRepeat,
    MdShuffle,
    MdSkipNext,
    MdSkipPrevious,
} from "react-icons/md";
import { RiHeartFill, RiHeartLine, RiInformationLine, RiMovieFill, RiShareBoxLine } from "react-icons/ri";
import { isLoginAtom, isPlayingAtom, playingDataAtom, volumeAtom } from "../../atoms";
import { getAccessRight, getWatchData, getWatchDataGuest, makeActionTrackId } from "../../nico/video";
import styled from "./Controller.module.scss";

export const Controller = () => {
    const isSupportedBrowser = useMemo(() => Hls.isSupported(), []);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [truePeak, setTruePeak] = useState(0);

    const isLogin = useAtomValue(isLoginAtom);
    const [playingData, setPlayingData] = useAtom(playingDataAtom);
    const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
    const [volume, setVolume] = useAtom(volumeAtom);

    const [audioDuration, setAudioDuration] = useState(0);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    useEffect(() => {
        const getVideo = async () => {
            if (!playingData.id) return;
            const actionTrackId = await makeActionTrackId();
            const data = isLogin
                ? await getWatchData(playingData.id, actionTrackId)
                : await getWatchDataGuest(playingData.id, actionTrackId);
            if (data.media.domand) {
                const outputs = data.media.domand.audios.filter((audio) => audio.isAvailable);
                if (outputs.length > 0) {
                    const output = outputs.reduce((prev, current) => {
                        return prev.qualityLevel > current.qualityLevel ? prev : current;
                    });
                    const right = await getAccessRight(
                        data.video.id,
                        [[output.id]],
                        data.media.domand.accessRightKey,
                        actionTrackId,
                    );
                    setPlayingData((prev) => ({ ...prev, watch: data }));
                    setTruePeak(output.truePeak);
                    setSourceUrl("/proxy?url=" + encodeURIComponent(right.contentUrl));
                }
            }
        };
        getVideo();
        return () => {};
    }, [playingData.id]);
    useEffect(() => {
        if (isSupportedBrowser && audioRef.current && sourceUrl) {
            const hls = new Hls({
                maxBufferLength: 30,
                maxBufferSize: 10 * 1024 * 1024,
                maxMaxBufferLength: 100,
            });
            hls.loadSource(sourceUrl);
            hls.attachMedia(audioRef.current);
            return () => {
                hls.destroy();
            };
        }
        return () => {};
    }, [isSupportedBrowser, sourceUrl]);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume * (1.0 - truePeak / 10);
        }
    }, [volume, truePeak]);
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);
    const onLoadedmetadata = () => {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
    };
    const onTimeupdate = () => {
        if (audioRef.current) {
            setAudioCurrentTime(audioRef.current.currentTime);
        }
    };
    const onEnded = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };
    const secondsToTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };
    const nowTime = useMemo(() => {
        return secondsToTime(audioCurrentTime);
    }, [audioCurrentTime]);
    const durationTime = useMemo(() => {
        return secondsToTime(audioDuration);
    }, [audioDuration]);
    const changeDurationRatioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
        }
    };
    const togglePlay = () => {
        if (playingData.watch) {
            setIsPlaying(!isPlaying);
        }
    };
    const movieBtnHandler = () => {
        if (playingData.watch) {
            window.electronAPI.openExternal(`https://www.nicovideo.jp/watch/${playingData.watch.video.id}`);
        }
    };
    return (
        <div className={styled.controller}>
            <audio
                ref={audioRef}
                controls
                className={styled.player}
                onTimeUpdate={onTimeupdate}
                onLoadedMetadata={onLoadedmetadata}
                onEnded={onEnded}
            ></audio>
            <div className={styled.songMeta}>
                {playingData.watch && (
                    <>
                        <img src={playingData.watch.video.thumbnail.url} alt="thumbnail" />
                        <div className={styled.songInfo}>
                            <span className={styled.title} title={playingData.watch.video.title}>
                                {playingData.watch.video.title}
                            </span>
                            {playingData.watch.owner && (
                                <span className={styled.artist} title={playingData.watch.owner.nickname}>
                                    {playingData.watch.owner.nickname}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className={styled.songControls}>
                <div className={styled.songCtrlButtons}>
                    <button>
                        <MdShuffle />
                    </button>
                    <button>
                        <MdSkipPrevious />
                    </button>
                    <button className={styled.playButton} onClick={togglePlay}>
                        {isPlaying ? <MdPauseCircleFilled /> : <MdPlayCircleFilled />}
                    </button>
                    <button>
                        <MdSkipNext />
                    </button>
                    <button>
                        <MdRepeat />
                    </button>
                </div>
                <div className={styled.songCtrlRange}>
                    <span>{nowTime}</span>
                    <input
                        type="range"
                        min={0}
                        max={audioDuration}
                        value={audioCurrentTime}
                        onChange={changeDurationRatioHandler}
                    />
                    <span>{durationTime}</span>
                </div>
            </div>
            <div className={styled.songExtButtons}>
                <button disabled={!playingData.watch}>{false ? <RiHeartFill /> : <RiHeartLine />}</button>
                <button disabled={!playingData.watch}>
                    <RiInformationLine />
                </button>
                <button disabled={!playingData.watch} onClick={movieBtnHandler}>
                    <RiMovieFill />
                </button>
                <button disabled={!playingData.watch}>
                    <RiShareBoxLine />
                </button>
            </div>
        </div>
    );
};
