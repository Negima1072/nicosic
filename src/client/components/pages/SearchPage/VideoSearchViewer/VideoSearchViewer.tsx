import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
    isShuffleAtom,
    playingDataAtom,
    playingListAtom,
    playlistDataAtom,
    playlistIndexAtom,
} from "../../../../atoms";
import { searchVideos } from "../../../../nico/search";
import styled from "./VideoSearchViewer.module.scss";
import { VideoItem } from "../../../common/VideoItem/VideoItem";

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
                            <VideoItem
                                key={index}
                                video={item}
                                onClick={() => changePlayingId(index, item)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
