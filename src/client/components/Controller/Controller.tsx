import Hls from "hls.js";
import { MdPauseCircleFilled, MdPlayCircleFilled, MdRepeat, MdShuffle, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { RiHeartFill, RiHeartLine, RiInformationLine, RiMovieFill, RiShareBoxLine } from "react-icons/ri";
import styled from "./Controller.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAtom } from "jotai";
import { isPlayingAtom, playingDataAtom } from "../../atoms";
import { getAccessRight, getWatchData, makeActionTrackId } from "../../nico/video";

export const Controller = () => {
    const isSupportedBrowser = useMemo(() => Hls.isSupported(), []);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);

    const [playingData, setPlayingData] = useAtom(playingDataAtom);
    const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

    const [audioDuration, setAudioDuration] = useState(0);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    useEffect(() => {
        const getVideo = async () => {
            if (!playingData.id) return;
            const actionTrackId = await makeActionTrackId();
            const data = await getWatchData(playingData.id, actionTrackId);
            setPlayingData((prev) => ({ ...prev, watch: data }));
            if (data.media.domand) {
                const right = await getAccessRight(data.video.id, [["audio-aac-64kbps"]], data.media.domand.accessRightKey, actionTrackId);
                setSourceUrl("/proxy?url=" + encodeURIComponent(right.contentUrl));
            }
        }
        getVideo();
        return () => {}
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
            }
        }
    }, [isSupportedBrowser, sourceUrl]);
    const onLoadedmetadata = () => {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
    }
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
    }
    const secondsToTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    }
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
    }
    const togglePlay = () => {
        if (audioRef.current && playingData.watch) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }
    const movieBtnHandler = () => {
        if (playingData.watch) {
            window.electronAPI.openExternal(`https://www.nicovideo.jp/watch/${playingData.watch.video.id}`);
        }
    }
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
                            <span className={styled.title} title={playingData.watch.video.title}>{playingData.watch.video.title}</span>
                            {playingData.watch.owner && (
                                <span className={styled.artist} title={playingData.watch.owner.nickname}>{playingData.watch.owner.nickname}</span>
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
                <button disabled={!playingData.watch}>
                    {false ? <RiHeartFill /> : <RiHeartLine />}
                </button>
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
