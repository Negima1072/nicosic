interface MylistData {
    mylists: MylistData[];
}

type SortKey = "addedAt" | "title" | "mylistComment" | "registeredAt" | "viewCount" | "lastCommentTime" | "commentCount" | "likeCount" | "mylistCount" | "duration";
type SortOrder = "asc" | "desc";

interface MylistData {
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
    owner: User;
    sampleItems: MylistItem[];
}

interface MylistItem {
    addedAt: string;
    decorateDescriptionHtml: string;
    description: string;
    itemId: string;
    status: string;
    video: EssentialVideo;
    watchId: string;
}
