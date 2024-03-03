import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { getUserVideos } from "../../../nico/user";
import styled from "./UserVideosPage.module.scss";

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
    const secondsToTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
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
                            <div
                                key={item.essential.id}
                                className={styled.userVideosItem}
                                onClick={() => changePlayingId(index, item.essential)}
                            >
                                <div className={styled.videoImage}>
                                    {item.essential && (
                                        <img src={item.essential.thumbnail.listingUrl} alt="thumbnail" />
                                    )}
                                </div>
                                <div className={styled.userVideosItemInfo}>
                                    {item.essential ? (
                                        <>
                                            <div className={styled.userVideosItemTitle}>{item.essential.title}</div>
                                            <div className={styled.userVideosItemDetail}>
                                                <div className={styled.userVideosItemMeta1}>
                                                    <span>{item.essential.owner.name}</span>
                                                    <span>/</span>
                                                    <span>{secondsToTime(item.essential.duration)}</span>
                                                </div>
                                                <div className={styled.userVideosItemMeta2}>
                                                    <div className={styled.userVideosItemMetaItem}>
                                                        <RiPlayFill />
                                                        <span>{item.essential.count.view.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.userVideosItemMetaItem}>
                                                        <RiHeartFill />
                                                        <span>{item.essential.count.like.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.userVideosItemMetaItem}>
                                                        <RiFolderFill />
                                                        <span>{item.essential.count.mylist.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.userVideosItemMetaItem}>
                                                        <span>
                                                            {new Date(item.essential.registeredAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <span>削除された動画</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
