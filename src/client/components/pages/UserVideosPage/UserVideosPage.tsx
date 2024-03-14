import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { getUserVideos } from "../../../nico/user";
import styled from "./UserVideosPage.module.scss";
import { VideoItem } from "../../common/VideoItem/VideoItem";

export const UserVideosPage = () => {
    const { userId } = useParams();
    const [userVideos, setUserVideos] = useState<UserVideosData | null>(null);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    useEffect(() => {
        async function fetchUserVideos() {
            if (userId) {
                const _userVideos = await getUserVideos(userId, undefined, undefined, 1, 100);
                setUserVideos(_userVideos);
            } else {
                setUserVideos(null);
            }
        }
        fetchUserVideos();
        return () => {};
    }, [userId]);
    const changePlayingId = (index: number, video?: EssentialVideo) => {
        if (video && userVideos) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom(userVideos.items.map((item) => item.essential));
            let list = userVideos.items.map((item, index) => ({ index, id: item.essential.id }));
            let newIndex = index;
            if (isShuffle) {
                list = list.sort(() => Math.random() - 0.5);
                newIndex = list.findIndex((item) => item.index === index);
            }
            setPlayingListAtom(list);
            setPlaylistIndexAtom(newIndex);
        }
    };
    return (
        <div className={styled.userVideosPage}>
            {userVideos && (
                <>
                    <div className={styled.userVideosDetail}>
                        <div className={styled.userVideosTitle}>投稿一覧</div>
                        <div className={styled.userVideosMeta}>
                            <span>全{userVideos.totalCount}件</span>
                        </div>
                    </div>
                    <div className={styled.userVideosItems}>
                        {userVideos.items.map((item, index) => (
                            <VideoItem
                                key={item.essential.id}
                                video={item.essential}
                                onClick={() => changePlayingId(index, item.essential)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
