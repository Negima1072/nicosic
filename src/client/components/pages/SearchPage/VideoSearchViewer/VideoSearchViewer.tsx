import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiFolderFill, RiHeartFill, RiPlayFill } from "react-icons/ri";
import {
    isShuffleAtom,
    playingDataAtom,
    playingListAtom,
    playlistDataAtom,
    playlistIndexAtom,
} from "../../../../atoms";
import styled from "./VideoSearchViewer.module.scss";
import { searchVideos } from "../../../../nico/saerch";

interface VideoSearchViewerProps {
    searchQuery: string;
    queryType: SearchQueryType;
    sortKey: SearchVideoSortKey;
    sortOrder: SearchSortOrder;
}

export const VideoSearchViewer = ({ searchQuery, queryType, sortKey, sortOrder }: VideoSearchViewerProps) => {
    const [searchResultVideos, setSearchResultVideos] = useState<EssentialVideo[] | null>(null);
    const isShuffle = useAtomValue(isShuffleAtom);
    const setPlayingData = useSetAtom(playingDataAtom);
    const setPlayingListAtom = useSetAtom(playingListAtom);
    const setPlaylistDataAtom = useSetAtom(playlistDataAtom);
    const setPlaylistIndexAtom = useSetAtom(playlistIndexAtom);
    const changePlayingId = (index: number, video?: EssentialVideo) => {
        if (video && searchResultVideos) {
            setPlayingData((prev) => ({ ...prev, id: video.id }));
            setPlaylistDataAtom(searchResultVideos);
            let list = searchResultVideos.map((item, index) => ({ index, id: item.id }));
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
    useEffect(() => {
        async function fetchSearch() {
            if (searchQuery === "") {
                setSearchResultVideos(null);
                return;
            }
            try {
                const search = await searchVideos(searchQuery, queryType, sortKey, sortOrder, 1, 100);
                setSearchResultVideos(search.items);
            } catch (e) {
                setSearchResultVideos(null);
            }
        }
        fetchSearch();
        return () => {};
    }, [searchQuery, queryType, sortKey, sortOrder]);
    return (
        <div className={styled.videoSearchViewer}>
            {searchResultVideos && (
                <>
                    <div className={styled.videoSearchItems}>
                        {searchResultVideos.map((item, index) => (
                            <div
                                key={index}
                                className={styled.videoSearchItem}
                                onClick={() => changePlayingId(index, item)}
                            >
                                <div className={styled.videoImage}>
                                    {item && <img src={item.thumbnail.listingUrl} alt="thumbnail" />}
                                </div>
                                <div className={styled.videoSearchItemInfo}>
                                    {item ? (
                                        <>
                                            <div className={styled.videoSearchItemTitle}>{item.title}</div>
                                            <div className={styled.videoSearchItemDetail}>
                                                <div className={styled.videoSearchItemMeta1}>
                                                    <span>{item.owner.name}</span>
                                                    <span>/</span>
                                                    <span>{secondsToTime(item.duration)}</span>
                                                </div>
                                                <div className={styled.videoSearchItemMeta2}>
                                                    <div className={styled.videoSearchItemMetaItem}>
                                                        <RiPlayFill />
                                                        <span>{item.count.view.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.videoSearchItemMetaItem}>
                                                        <RiHeartFill />
                                                        <span>{item.count.like.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.videoSearchItemMetaItem}>
                                                        <RiFolderFill />
                                                        <span>{item.count.mylist.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styled.videoSearchItemMetaItem}>
                                                        <span>{new Date(item.registeredAt).toLocaleString()}</span>
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
