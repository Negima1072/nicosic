import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { getMylistItems } from "../../../nico/list";
import styled from "./MylistDetailPage.module.scss";

export const MylistDetailPage = () => {
    const { mylistId } = useParams();
    const [mylist, setMylist] = useState<MylistDetailData | null>(null);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    useEffect(() => {
        async function fetchMylistDetail() {
            if (mylistId) {
                const _mylist = await getMylistItems(mylistId);
                setMylist(_mylist);
            } else {
                setMylist(null);
            }
        }
        fetchMylistDetail();
        return () => {};
    }, [mylistId]);
    const changePlayingId = (index: number, video?: EssentialVideo) => {
        if (video && mylist) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom(mylist.items.map((item) => item.video));
            let list = mylist.items.map((item, index) => ({ index, id: item.video?.id }));
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
        <div className={styled.mylistDetailPage}>
            {mylist && (
                <>
                    <div className={styled.mylistDetail}>
                        <div className={styled.mylistTitle}>{mylist.name}</div>
                        <div className={styled.mylistOwner}>
                            <img src={mylist.owner.iconUrl} alt="icon" />
                            <span>{mylist.owner.name}</span>
                        </div>
                        <div className={styled.mylistMeta}>
                            <span>全{mylist.totalItemCount}件</span>
                            <span>{mylist.isPublic ? "公開" : "非公開"}マイリスト</span>
                            {mylist.followerCount && <span>{mylist.followerCount}フォロワー</span>}
                        </div>
                    </div>
                    <div className={styled.mylistItems}>
                        {mylist.items.map((item, index) => (
                            <div
                                key={item.itemId}
                                className={styled.mylistItem}
                                onClick={() => changePlayingId(index, item.video)}
                            >
                                <div className={styled.videoImage}>
                                    {item.video && <img src={item.video.thumbnail.listingUrl} alt="thumbnail" />}
                                </div>
                                <div className={styled.mylistItemInfo}>
                                    {item.video ? (
                                        <>
                                            <div className={styled.mylistItemTitle}>{item.video.title}</div>
                                            <div className={styled.mylistItemDetail}>
                                                <div className={styled.mylistItemMeta1}>
                                                    <span>{item.video.owner.name}</span>
                                                    <span>/</span>
                                                    <span>{secondsToTime(item.video.duration)}</span>
                                                </div>
                                                <div className={styled.mylistItemMeta2}>
                                                    <div className={styled.mylistItemMetaItem}>
                                                        <RiPlayFill />
                                                        <span>{item.video.count.view.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.mylistItemMetaItem}>
                                                        <RiHeartFill />
                                                        <span>{item.video.count.like.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.mylistItemMetaItem}>
                                                        <RiFolderFill />
                                                        <span>{item.video.count.mylist.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.mylistItemMetaItem}>
                                                        <span>
                                                            {new Date(item.video.registeredAt).toLocaleString()}
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
