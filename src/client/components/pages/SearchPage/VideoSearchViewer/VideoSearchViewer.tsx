import { useEffect, useState } from "react";
import { searchVideos } from "../../../../nico/search";
import { VideoItemList } from "../../../common/VideoItemList/VideoItemList";
import styled from "./VideoSearchViewer.module.scss";

interface VideoSearchViewerProps {
    searchQuery: string;
    queryType: SearchQueryType;
    sortKey: SearchVideoSortKey;
    sortOrder: SearchSortOrder;
}

export const VideoSearchViewer = ({ searchQuery, queryType, sortKey, sortOrder }: VideoSearchViewerProps) => {
    const [searchResultVideos, setSearchResultVideos] = useState<EssentialVideo[] | null>(null);
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
            {searchResultVideos && <VideoItemList videos={searchResultVideos} />}
        </div>
    );
};
