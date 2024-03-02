interface SearchDataBase<T> {
    searchId: string;
    totalCount: number;
    hasNext: boolean;
    items: T[];
}

interface SearchVideoData extends SearchDataBase<EssentialVideo> {
    keyword: string | null;
    tag: string | null;
    lockTag: string | null;
    genres: SearchGenre[];
    additional: SearchAdditional;
}

interface SearchListData extends SearchDataBase<SearchList> {}

interface SearchUserData extends SearchDataBase<SearchUser> {}

interface SearchGenre {
    key: string;
    label: string;
}

interface SearchTag {
    text: string;
    type: string;
}

interface SearchAdditional {
    tags: SearchTag[];
    waku: {};
}

type SearchType = "video" | "list" | "user";
type SearchListType = "mylist" | "series";
type SearchQueryType = "keyword" | "tag" | "lockTag";

type SearchVideoSortKeySp = "hot" | "personalized";
type SearchVideoSortKeyOd =
    | "registeredAt"
    | "viewCount"
    | "lastCommentTime"
    | "commentCount"
    | "likeCount"
    | "mylistCount"
    | "duration";
type SearchVideoSortKey = SearchVideoSortKeySp | SearchVideoSortKeyOd;

type SearchSortOrder = "desc" | "asc" | "none";

type SearchListSortKey = "_hotTotalScore" | "videoCount" | "startTime";
type SearchUserSortKey = "_personalized" | "followerCount" | "videoCount" | "liveCount";

type ChannelVideoListingStatus = "only" | "exclude";

interface SearchList {
    id: number;
    type: SearchListType;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoCount: number;
    owner: User | Channel;
    isMuted: boolean;
}

interface SearchUser {
    type: "userSearch";
    followerCount: number;
    videoCount: number;
    liveCount: number;
    isPremium: boolean;
    description: string;
    strippedDescription: string;
    shortDescription: string;
    id: number;
    nickname: string;
    icons: {
        small: string;
        large: string;
    };
    relationships: {
        sessionUser: {
            isFollowing: boolean;
        };
    };
}
