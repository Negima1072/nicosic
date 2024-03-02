import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "./SearchPage.module.scss";
import { PopularTagsViewer } from "./PopularTagsViewer/PopularTagsViewer";
import { MdClear, MdOutlineSearch } from "react-icons/md";
import { VideoSearchViewer } from "./VideoSearchViewer/VideoSearchViewer";
import { ListSearchViewer } from "./ListSearchViewer/ListSearchViewer";
import { UserSearchViewer } from "./UserSearchViewer/UserSearchViewer";

const videoSortSettings: { key: SearchVideoSortKey; order: SearchSortOrder; label: string }[] = [
    { key: "hot", order: "none", label: "人気が高い順"},
    { key: "personalized", order: "none", label: "あなたへのおすすめ順"},
    { key: "registeredAt", order: "desc", label: "投稿日時が新しい順"},
    { key: "viewCount", order: "desc", label: "再生数が多い順"},
    { key: "mylistCount", order: "desc", label: "マイリスト数が多い順"},
    { key: "lastCommentTime", order: "desc", label: "コメントが新しい順"},
    { key: "lastCommentTime", order: "asc", label: "コメントが古い順"},
    { key: "viewCount", order: "asc", label: "再生数が少ない順"},
    { key: "commentCount", order: "desc", label: "コメント数が多い順"},
    { key: "commentCount", order: "asc", label: "コメント数が少ない順"},
    { key: "mylistCount", order: "asc", label: "マイリスト数が少ない順"},
    { key: "registeredAt", order: "asc", label: "投稿日時が古い順"},
    { key: "duration", order: "desc", label: "再生時間が長い順"},
    { key: "duration", order: "asc", label: "再生時間が短い順"},
    { key: "likeCount", order: "desc", label: "いいね！数が多い順"},
    { key: "likeCount", order: "asc", label: "いいね！数が少ない順"},
]

const userSortSetting: { key: SearchUserSortKey; label: string }[] = [
    { key: "_personalized", label: "おすすめ順"},
    { key: "followerCount", label: "フォロワーが多い順"},
    { key: "videoCount", label: "投稿動画が多い順"},
    { key: "liveCount", label: "生放送が多い順"},
]

const listSortSettings: { key: SearchListSortKey; order: SearchSortOrder; label: string }[] = [
    { key: "_hotTotalScore", order: "none", label: "人気が高い順"},
    { key: "videoCount", order: "desc", label: "登録動画が多い順"},
    { key: "videoCount", order: "asc", label: "登録動画が少ない順"},
    { key: "startTime", order: "desc", label: "作成日時が新しい順"},
    { key: "startTime", order: "asc", label: "作成日時が古い順"},
]

type SearchTypeSps = "keyword" | "tag" | "user" | "mylist" | "series";

export const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedSortSettingIndex, setSelectedSortSettingIndex] = useState(0);
    const [searchQuery, searchType, queryType, sortKey, sortOrder, listType] = useMemo(() => {
        const _searchQuery = searchParams.get("q") ?? "";
        let _searchType = (searchParams.get("type") ?? "video");
        let _queryType = (searchParams.get("queryType") ?? "keyword");
        let _sortKey = (searchParams.get("sortKey") ?? "hot");
        let _sortOrder = (searchParams.get("sortOrder") ?? "none");
        let _listType = (searchParams.get("listType") ?? "none");
        if (_searchType !== "video" && _searchType !== "user" && _searchType !== "list") _searchType = "video";
        if (_queryType !== "keyword" && _queryType !== "tag") _queryType = "keyword";
        if (_searchType === "video") {
            if (!videoSortSettings.some((item) => item.key === _sortKey && item.order === _sortOrder)) {
                _sortKey = "hot";
                _sortOrder = "none";
            }
            setSelectedSortSettingIndex(videoSortSettings.findIndex((item) => item.key === _sortKey && item.order === _sortOrder));
        } else if (_searchType === "user") {
            if (!userSortSetting.some((item) => item.key === _sortKey)) _sortKey = "_personalized";
            setSelectedSortSettingIndex(userSortSetting.findIndex((item) => item.key === _sortKey));
            if (_queryType === "tag") _queryType = "keyword";
        } else if (_searchType === "list") {
            if (!listSortSettings.some((item) => item.key === _sortKey && item.order === _sortOrder)) {
                _sortKey = "_hotTotalScore";
                _sortOrder = "none";
            }
            setSelectedSortSettingIndex(listSortSettings.findIndex((item) => item.key === _sortKey && item.order === _sortOrder));
            if (_queryType === "tag") _queryType = "keyword";
            if (_listType !== "mylist" && _listType !== "series") _listType = "mylist";
        }
        return [_searchQuery, _searchType as SearchType, _queryType as SearchQueryType, _sortKey, _sortOrder, _listType as SearchListType];
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
    const searchQueryClear = () => {
        setInputSearchQuery("");
        setSearchParams({});
    }
    const setSearchType = (type: SearchTypeSps) => {
        if (type === "keyword" || type === "tag") {
            setSearchParams({ q: searchQuery, type: "video", queryType: type, sortKey, sortOrder });
        } else if (type === "user") {
            setSearchParams({ q: searchQuery, type: "user", queryType: "keyword" });
        } else if (type === "mylist" || type === "series") {
            setSearchParams({ q: searchQuery, type: "list", queryType: "keyword", listType: type, sortKey, sortOrder });
        }
    }
    const setSearchSetting = (index: number) => {
        if (searchType === "video") {
            setSearchParams({ q: searchQuery, type: searchType, queryType, sortKey: videoSortSettings[index].key, sortOrder: videoSortSettings[index].order });
        } else if (searchType === "user") {
            setSearchParams({ q: searchQuery, type: searchType, queryType, sortKey: userSortSetting[index].key, sortOrder });
        } else if (searchType === "list") {
            setSearchParams({ q: searchQuery, type: searchType, queryType, sortKey: listSortSettings[index].key, sortOrder: listSortSettings[index].order });
        }
        setSelectedSortSettingIndex(index);
    }
    return (
        <div className={styled.searchPage}>
            <div className={styled.searchSettings}>
                <div className={styled.searchQueryContainer}>
                    <input type="text" placeholder="検索キーワード" value={inputSearchQuery} onChange={(e) => setInputSearchQuery(e.target.value)} onKeyDown={searchInputEntered} />
                    <MdOutlineSearch className={styled.searchIcon} />
                    {inputSearchQuery.length > 0 && (
                        <button onClick={searchQueryClear} className={styled.clearButton}>
                            <MdClear />
                        </button>
                    )}
                </div>
                {searchQuery !== "" && (
                    <div className={styled.searchSettingSelector}>
                        <div className={styled.searchTypeSelector}>
                            <div onClick={() => setSearchType("keyword")} className={searchType === "video" && queryType === "keyword" ? styled.selected : ""}>キーワード</div>
                            <div onClick={() => setSearchType("tag")} className={searchType === "video" && queryType === "tag" ? styled.selected : ""}>タグ</div>
                            <div onClick={() => setSearchType("user")} className={searchType === "user" ? styled.selected : ""}>ユーザー</div>
                            <div onClick={() => setSearchType("mylist")} className={searchType === "list" && listType === "mylist" ? styled.selected : ""}>マイリスト</div>
                            <div onClick={() => setSearchType("series")} className={searchType === "list" && listType === "series" ? styled.selected : ""}>シリーズ</div>
                        </div>
                        <select className={styled.searchSortSelector} value={selectedSortSettingIndex} onChange={(e) => setSearchSetting(parseInt(e.target.value))}>
                            {searchType === "video" && videoSortSettings.map((item, index) => (
                                <option key={index} value={index}>{item.label}</option>
                            ))}
                            {searchType === "user" && userSortSetting.map((item, index) => (
                                <option key={index} value={index}>{item.label}</option>
                            ))}
                            {searchType === "list" && listSortSettings.map((item, index) => (
                                <option key={index} value={index}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            {searchQuery === "" ? (
                <PopularTagsViewer />
            ) : (
                <>
                    {searchType === "video" && (
                        <VideoSearchViewer searchQuery={searchQuery} queryType={queryType} sortKey={sortKey as SearchVideoSortKey} sortOrder={sortOrder as SearchSortOrder} />
                    )}
                    {searchType === "user" && (
                        <UserSearchViewer searchQuery={searchQuery} sortKey={sortKey as SearchUserSortKey} />
                    )}
                    {searchType === "list" && (
                        <ListSearchViewer searchQuery={searchQuery} listType={listType} sortKey={sortKey as SearchListSortKey} sortOrder={sortOrder as SearchSortOrder} />
                    )}
                </>
            )}
        </div>
    );
};
