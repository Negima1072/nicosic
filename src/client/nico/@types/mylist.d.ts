interface MylistsData {
    mylists: MylistInfoData[];
}

interface MylistData {
    mylist: MylistDetailData;
}

type MylistSortKey =
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
type MylistSortOrder = "asc" | "desc";

interface MylistInfoData {
    createdAt: string;
    decoratedDescriptionHtml: string;
    defaultSortKey: MylistSortKey;
    defaultSortOrder: MylistSortOrder;
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
    defaultSortKey: MylistSortKey;
    defaultSortOrder: MylistSortOrder;
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
