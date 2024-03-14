import Hls from "hls.js";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    MdPauseCircleFilled,
    MdPlayCircleFilled,
    MdRepeat,
    MdRepeatOne,
    MdShuffle,
    MdSkipNext,
    MdSkipPrevious,
} from "react-icons/md";
import {
    RiHeartFill,
    RiHeartLine,
    RiInformationLine,
    RiMovieFill,
    RiPlayList2Fill,
    RiShareBoxLine,
    RiVolumeDownFill,
    RiVolumeMuteFill,
    RiVolumeUpFill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
    configAtom,
    isLoginAtom,
    isMuteAtom,
    isPlayingAtom,
    isShuffleAtom,
    playingDataAtom,
    playingListAtom,
    playlistDataAtom,
    playlistIndexAtom,
    repeatModeAtom,
    volumeAtom,
} from "../../atoms";
import {
    dislikeVideo,
    getAccessRight,
    getWatchData,
    getWatchDataGuest,
    likeVideo,
    makeActionTrackId,
} from "../../nico/video";
import { secondsToTime } from "../../utils/time";
import styled from "./Controller.module.scss";

const EQUALIZER_BANDS = {
    "60Hz": 60,
    "150Hz": 150,
    "400Hz": 400,
    "1kHz": 1000,
    "2.4kHz": 2400,
    "15kHz": 15000,
};

export const Controller = () => {
    const navigate = useNavigate();

    const isSupportedBrowser = useMemo(() => Hls.isSupported(), []);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [sourceUrl, setSourceUrl] = useState<string | null>(null);
    const [loudness, setLoudness] = useState<number | undefined>(undefined);

    const config = useAtomValue(configAtom);
    const [filters, setFilters] = useState<BiquadFilterNode[]>([]);

    const isLogin = useAtomValue(isLoginAtom);
    const [playingData, setPlayingData] = useAtom(playingDataAtom);
    const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
    const [isMute, setIsMute] = useAtom(isMuteAtom);
    const [volume, setVolume] = useAtom(volumeAtom);

    const [isShuffle, setIsShuffle] = useAtom(isShuffleAtom);
    const [repeatMode, setRepeatMode] = useAtom(repeatModeAtom);

    const [playingList, setPlayingList] = useAtom(playingListAtom);
    const [playlistData] = useAtom(playlistDataAtom);
    const [playlistIndex, setPlaylistIndex] = useAtom(playlistIndexAtom);

    const [audioDuration, setAudioDuration] = useState(0);
    const [audioCurrentTime, setAudioCurrentTime] = useState(0);
    useEffect(() => {
        if (audioRef.current) {
            const audioCtx = new window.AudioContext();
            const source = audioCtx.createMediaElementSource(audioRef.current);
            const _filters = Object.values(EQUALIZER_BANDS).map((value) => {
                const filter = audioCtx.createBiquadFilter();
                filter.type = "peaking";
                filter.frequency.value = value;
                filter.gain.value = 0;
                filter.Q.value = 1;
                return filter;
            });
            source.connect(_filters[0]);
            _filters.reduce((prev, current) => {
                prev.connect(current);
                return current;
            });
            _filters[_filters.length - 1].connect(audioCtx.destination);
            setFilters(_filters);
            return () => {
                audioCtx.close();
            };
        }
    }, []);
    useEffect(() => {
        const getVideo = async () => {
            if (!playingData.id) {
                setPlayingData({});
                setLoudness(undefined);
                setSourceUrl(null);
                return;
            }
            const actionTrackId = await makeActionTrackId();
            const data = isLogin
                ? await getWatchData(playingData.id, actionTrackId, config?.autoNormalize ? loudness : undefined)
                : await getWatchDataGuest(playingData.id, actionTrackId, config?.autoNormalize ? loudness : undefined);
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
                    setLoudness(output.loudnessCollection[0].value);
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
            if (loudness && config?.autoNormalize) {
                audioRef.current.volume = Math.max(Math.min(volume * loudness, 1), 0);
            } else {
                audioRef.current.volume = Math.max(Math.min(volume, 1), 0);
            }
        }
    }, [volume, loudness, config?.autoNormalize]);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMute;
        }
    }, [isMute]);
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);
    useEffect(() => {
        if (audioRef.current && config && filters.length > 0) {
            Object.keys(EQUALIZER_BANDS).forEach((key, i) => {
                if (key in config.equalizer) {
                    filters[i].gain.value = config.equalizer[key as keyof typeof EQUALIZER_BANDS];
                }
            });
        }
    }, [config?.equalizer, filters]);
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
            if (playingList === null) {
                if (repeatMode !== "none") {
                    audioRef.current.currentTime = 0;
                    setIsPlaying(true);
                }
            } else {
                if (repeatMode === "one") {
                    audioRef.current.currentTime = 0;
                    setIsPlaying(true);
                } else {
                    let newIndex = playlistIndex;
                    while (true) {
                        newIndex++;
                        if (newIndex < playingList.length) {
                            if (playingList[newIndex].id) {
                                break;
                            }
                        } else {
                            if (repeatMode === "all") {
                                newIndex = 0;
                            } else if (repeatMode === "none") {
                                newIndex = -1;
                            }
                            break;
                        }
                    }
                    if (newIndex === -1) {
                        setPlayingData({});
                        setPlayingList(null);
                        setIsPlaying(false);
                    } else {
                        setPlaylistIndex(newIndex);
                        setPlayingData((prev) => ({ ...prev, id: playingList[newIndex].id }));
                    }
                }
            }
        }
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
    const skipPrevious = () => {
        if (audioRef.current) {
            if (audioCurrentTime > 5) {
                audioRef.current.currentTime = 0;
            } else {
                if (repeatMode === "one" || playingList === null) {
                    audioRef.current.currentTime = 0;
                    setIsPlaying(false);
                } else {
                    let newIndex = playlistIndex;
                    while (true) {
                        newIndex--;
                        if (newIndex >= 0) {
                            if (playingList[newIndex].id) {
                                break;
                            }
                        } else {
                            if (repeatMode === "all") {
                                newIndex = playingList.length - 1;
                            } else if (repeatMode === "none") {
                                newIndex = -1;
                            }
                            break;
                        }
                    }
                    if (newIndex === -1) {
                        setPlayingData({});
                        setPlayingList(null);
                        setIsPlaying(false);
                    } else {
                        setPlaylistIndex(newIndex);
                        setPlayingData((prev) => ({ ...prev, id: playingList[newIndex].id }));
                    }
                }
            }
        }
    };
    const skipNext = () => {
        if (audioRef.current) {
            if (repeatMode === "one" || playingList === null) {
                audioRef.current.currentTime = 0;
                setIsPlaying(true);
            } else {
                let newIndex = playlistIndex;
                while (true) {
                    newIndex++;
                    if (newIndex < playingList.length) {
                        if (playingList[newIndex].id) {
                            break;
                        }
                    } else {
                        if (repeatMode === "all") {
                            newIndex = 0;
                        } else if (repeatMode === "none") {
                            newIndex = -1;
                        }
                        break;
                    }
                }
                if (newIndex === -1) {
                    setPlayingData({});
                    setPlayingList(null);
                    setIsPlaying(false);
                } else {
                    setPlaylistIndex(newIndex);
                    setPlayingData((prev) => ({ ...prev, id: playingList[newIndex].id }));
                }
            }
        }
    };
    const onLoadedData = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setIsPlaying(true);
        }
    };
    const toggleShuffle = () => {
        if (playingList && playingList.length > 0) {
            let list = playlistData.map((item, index) => ({ index, id: item?.id }));
            if (!isShuffle) {
                list = list.sort(() => Math.random() - 0.5);
            }
            setPlayingList(list);
            setPlaylistIndex(list.findIndex((item) => item.id === playingData.id));
        }
        setIsShuffle(!isShuffle);
    };
    const toggleRepeatMode = () => {
        if (repeatMode === "none") {
            setRepeatMode("all");
        } else if (repeatMode === "all") {
            setRepeatMode("one");
        } else if (repeatMode === "one") {
            setRepeatMode("none");
        }
    };
    const toggleMute = () => {
        setIsMute(!isMute);
    };
    const movieBtnHandler = () => {
        if (playingData.watch) {
            window.electronAPI.openExternal(`https://www.nicovideo.jp/watch/${playingData.watch.video.id}`);
        }
    };
    const shareBtnHandler = () => {
        if (playingData.watch) {
            window.electronAPI.openExternal(
                "https://twitter.com/intent/tweet?text=" +
                    encodeURIComponent(
                        `${playingData.watch.video.title}\nhttps://www.nicovideo.jp/watch/${playingData.watch.video.id}?ref=twitter\n#${playingData.watch.video.id} #nowplaying`,
                    ),
            );
        }
    };
    const changeVolumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isMute) {
            setIsMute(false);
        }
        setVolume(Number(e.target.value));
    };
    const likeButtonHandler = async (like: boolean) => {
        if (playingData.watch && playingData.watch && playingData.watch.video.viewer !== null) {
            if (like) {
                await likeVideo(playingData.watch.video.id);
            } else {
                await dislikeVideo(playingData.watch.video.id);
            }
            const newWatchData = { ...playingData.watch };
            if (newWatchData.video.viewer) {
                newWatchData.video.viewer.like.isLiked = like;
            }
            setPlayingData((prev) => ({ ...prev, watch: newWatchData }));
        }
    };
    const videoOwnerButtonHandler = () => {
        if (playingData.watch && playingData.watch.owner) {
            navigate(`/user/${playingData.watch.owner.id}`);
        }
    };
    const videoInfoButtonHandler = () => {
        if (playingData.watch) {
            navigate(`/video/${playingData.watch.video.id}`);
        }
    };
    const nextPlayButtonHandler = () => {
        if (playingData.watch) {
            navigate(`/nextplay`);
        }
    }
    return (
        <div className={styled.controller}>
            <audio
                ref={audioRef}
                autoPlay
                controls
                className={styled.player}
                muted={isMute}
                onTimeUpdate={onTimeupdate}
                onLoadedData={onLoadedData}
                onLoadedMetadata={onLoadedmetadata}
                onEnded={onEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            ></audio>
            <div className={styled.songMeta}>
                {playingData.watch && (
                    <>
                        <img
                            src={playingData.watch.video.thumbnail.url}
                            alt="thumbnail"
                            onClick={videoInfoButtonHandler}
                        />
                        <div className={styled.songInfo}>
                            <span
                                className={styled.title}
                                title={playingData.watch.video.title}
                                onClick={videoInfoButtonHandler}
                            >
                                {playingData.watch.video.title}
                            </span>
                            {playingData.watch.owner ? (
                                <span
                                    className={styled.artist}
                                    title={playingData.watch.owner.nickname}
                                    onClick={videoOwnerButtonHandler}
                                >
                                    {playingData.watch.owner.nickname}
                                </span>
                            ) : (
                                <>
                                    {playingData.watch.channel && (
                                        <span className={styled.artist} title={playingData.watch.channel.name}>
                                            {playingData.watch.channel.name}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className={styled.songControls}>
                <div className={styled.songCtrlButtons}>
                    <button onClick={toggleShuffle} className={isShuffle ? styled.active : ""} title="シャッフル">
                        <MdShuffle />
                    </button>
                    <button onClick={skipPrevious} title="前の曲">
                        <MdSkipPrevious />
                    </button>
                    <button className={styled.playButton} onClick={togglePlay} title={isPlaying ? "一時停止" : "再生"}>
                        {isPlaying ? <MdPauseCircleFilled /> : <MdPlayCircleFilled />}
                    </button>
                    <button onClick={skipNext} title="次の曲">
                        <MdSkipNext />
                    </button>
                    <button
                        onClick={toggleRepeatMode}
                        className={repeatMode !== "none" ? styled.active : ""}
                        title="リピート"
                    >
                        {repeatMode === "one" ? <MdRepeatOne /> : <MdRepeat />}
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
            <div className={styled.songButtons}>
                <div className={styled.volumeCtrl}>
                    <button onClick={toggleMute} title={isMute ? "ミュート解除" : "ミュート"}>
                        {isMute || volume === 0.0 ? (
                            <RiVolumeMuteFill />
                        ) : volume > 0.5 ? (
                            <RiVolumeUpFill />
                        ) : (
                            <RiVolumeDownFill />
                        )}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMute ? 0 : volume}
                        onChange={changeVolumeHandler}
                    />
                </div>
                <div className={styled.songExtButtons}>
                    {playingData.watch && isLogin && playingData.watch.video.viewer ? (
                        <>
                            {playingData.watch.video.viewer.like.isLiked ? (
                                <button className={styled.heart} onClick={() => likeButtonHandler(false)}>
                                    <RiHeartFill />
                                </button>
                            ) : (
                                <button onClick={() => likeButtonHandler(true)}>
                                    <RiHeartLine />
                                </button>
                            )}
                        </>
                    ) : (
                        <button disabled>
                            <RiHeartLine />
                        </button>
                    )}
                    <button disabled={!playingData.watch} onClick={videoInfoButtonHandler} title="曲の情報">
                        <RiInformationLine />
                    </button>
                    <button disabled={!playingData.watch} onClick={movieBtnHandler} title="動画ページ">
                        <RiMovieFill />
                    </button>
                    <button disabled={!playingData.watch} onClick={shareBtnHandler} title="共有">
                        <RiShareBoxLine />
                    </button>
                    <button disabled={!playingData.watch} onClick={nextPlayButtonHandler} title="次に再生">
                        <RiPlayList2Fill />
                    </button>
                </div>
            </div>
        </div>
    );
};
