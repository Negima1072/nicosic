import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "./SearchPage.module.scss";
import { PopularTagsViewer } from "./PopularTagsViewer/PopularTagsViewer";
import { MdClear, MdOutlineSearch } from "react-icons/md";
import { VideoSearchViewer } from "./VideoSearchViewer/VideoSearchViewer";

export const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, searchType, queryType, sortKey, sortOrder] = useMemo(() => {
        const searchQuery = searchParams.get("q") ?? "";
        const searchType = (searchParams.get("type") ?? "video") as SearchType;
        const queryType = (searchParams.get("queryType") ?? "keyword") as SearchQueryType;
        const sortKey = (searchParams.get("sortKey") ?? "hot") as SearchVideoSortKey;
        const sortOrder = (searchParams.get("sortOrder") ?? "none") as SearchSortOrder;
        // TODO: search type validation
        return [searchQuery, searchType, queryType, sortKey, sortOrder];
    }, [searchParams]);
    const [inputSearchQuery, setInputSearchQuery] = useState(searchQuery);
    useEffect(() => {
        setInputSearchQuery(searchQuery);
    }, [searchQuery]);
    const searchInputEntered = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearchParams({ q: inputSearchQuery, type: searchType, queryType, sortKey, sortOrder });
            e.currentTarget.blur();
        }
    }
    return (
        <div className={styled.searchPage}>
            <div className={styled.searchSettings}>
                <div className={styled.searchQueryContainer}>
                    <input type="text" placeholder="検索キーワード" value={inputSearchQuery} onChange={(e) => setInputSearchQuery(e.target.value)} onKeyDown={searchInputEntered} />
                    <MdOutlineSearch className={styled.searchIcon} />
                    {inputSearchQuery.length > 0 && (
                        <button onClick={() => setInputSearchQuery("")} className={styled.clearButton}>
                            <MdClear />
                        </button>
                    )}
                </div>
                {searchQuery !== "" && (
                    <div>searchConf</div>
                )}
            </div>
            {searchQuery === "" ? (
                <PopularTagsViewer />
            ) : (
                <>
                    {searchType === "video" && (
                        <VideoSearchViewer searchQuery={searchQuery} queryType={queryType} sortKey={sortKey} sortOrder={sortOrder} />
                    )}
                </>
            )}
        </div>
    );
};
