interface MylistsData {
    mylists: MylistInfoData[];
}

interface MylistData {
    mylist: MylistDetailData;
}

type SortKey =
    | "addedAt"
    | "title"
    | "mylistComment"
    | "registeredAt"
    | "viewCount"
    | "lastCommentTime"
    | "commentCount"
    | "likeCount"
    | "mylistCount"
    | "duration";
type SortOrder = "asc" | "desc";

interface MylistInfoData {
    createdAt: string;
    decoratedDescriptionHtml: string;
    defaultSortKey: SortKey;
    defaultSortOrder: SortOrder;
    description: string;
    followerCount: number;
    id: number;
    isFollowing: boolean;
    isPublic: boolean;
    itemsCount: number;
    name: string;
    owner: User | Channel;
    sampleItems: MylistItem[];
}

interface MylistItem {
    addedAt: string;
    decorateDescriptionHtml: string;
    description: string;
    itemId: string;
    status: string;
    video?: EssentialVideo;
    watchId: string;
}

interface MylistDetailData {
    decoratedDescriptionHtml: string;
    defaultSortKey: SortKey;
    defaultSortOrder: SortOrder;
    description: string;
    followerCount?: number;
    id: number;
    isFollowing: boolean;
    isPublic: boolean;
    name: string;
    owner: User | Channel;
    totalItemCount: number;
    hasNext: boolean;
    items: MylistItem[];
}
