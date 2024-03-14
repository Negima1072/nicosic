import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { isShuffleAtom, playingDataAtom, playingListAtom, playlistDataAtom, playlistIndexAtom } from "../../../atoms";
import { getMylistItems } from "../../../nico/list";
import styled from "./MylistDetailPage.module.scss";
import { VideoItem } from "../../common/VideoItem/VideoItem";

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
    return (
        <div className={styled.mylistDetailPage}>
            {mylist && (
                <>
                    <div className={styled.mylistDetail}>
                        <div className={styled.mylistTitle}>{mylist.name}</div>
                        <NavLink className={styled.mylistOwner} to={`/user/${mylist.owner.id}`}>
                            <img src={mylist.owner.iconUrl} alt="icon" />
                            <span>{mylist.owner.name}</span>
                        </NavLink>
                        <div className={styled.mylistMeta}>
                            <span>全{mylist.totalItemCount}件</span>
                            <span>{mylist.isPublic ? "公開" : "非公開"}マイリスト</span>
                            {mylist.followerCount && <span>{mylist.followerCount}フォロワー</span>}
                        </div>
                    </div>
                    <div className={styled.mylistItems}>
                        {mylist.items.map((item, index) => (
                            <VideoItem
                                key={item.itemId}
                                video={item.video}
                                onClick={() => changePlayingId(index, item.video)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
