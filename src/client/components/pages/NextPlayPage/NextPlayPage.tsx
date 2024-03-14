import { useAtom, useAtomValue } from "jotai";
import { playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import styled from "./NextPlayPage.module.scss";
import { useMemo } from "react";

export const NextPlayPage = () => {
    const [playingData, setPlayingData] = useAtom(playingDataAtom);
    const playingList = useAtomValue(playingListAtom);
    const playlistData = useAtomValue(playlistDataAtom);
    const [playlistIndex, setPlaylistIndex] = useAtom(playlistIndexAtom);
    const nextPlaylist = useMemo(() => {
        if (!playingList) return [];
        const nextPlaylist = playingList.slice(playlistIndex + 1, playlistIndex + 51);
        return nextPlaylist;
    }, [playlistData, playingList, playlistIndex]);
    const changePlayingIndex = (data: IPlaylistData) => {
        const video = playlistData[data.index];
        if (playingList && video) {
            setPlaylistIndex(data.index);
            setPlayingData((prev) => ({ ...prev, id: data.id }));
        }
    }
    return (
        <div className={styled.nextPlayPage}>
            {playingData.watch && (
                <div className={styled.nextPlayItem}>
                    <span className={styled.title}>再生中</span>
                    <div className={styled.miniVideoItem}>
                        <div className={styled.miniVideoItemThumbnail}>
                            <img src={playingData.watch.video.thumbnail.player} alt="thumbnail" />
                        </div>
                        <div className={styled.miniVideoItemInfo}>
                            <span className={styled.miniVideoTitle}>{playingData.watch.video.title}</span>
                            {playingData.watch.owner && (
                                <span className={styled.miniVideoOwner}>{playingData.watch.owner.nickname}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {nextPlaylist && (
                <div className={styled.nextPlayItem}>
                    <span className={styled.title}>次に再生</span>
                    {nextPlaylist.map((data, index) => {
                        const video = playlistData[data.index];
                        if (video) {
                            return (
                                <div className={styled.miniVideoItem} key={index} onClick={() => changePlayingIndex(data)}>
                                    <div className={styled.miniVideoItemInfo}>
                                        <span className={styled.miniVideoTitle}>{video.title}</span>
                                        <span className={styled.miniVideoOwner}>{video.owner.name}</span>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            )}
        </div>
    );
}
