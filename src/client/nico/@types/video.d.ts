interface NvAPIResponse<T> {
    meta: {
        status: number;
        errorCode?: string;
    };
    data?: T;
}

interface AccessRight {
    contentUrl: string;
    createTime: string;
    expireTime: string;
}

interface Recommend {
    recommendId: string;
    items: Recommendation[];
}

interface Recommendation {
    id: string;
    contentType: "video";
    recommendType: "recommend";
    reason: {
        tag: string;
    };
    content: EssentialVideo;
}

interface EssentialVideo {
    type: "essential";
    id: string;
    title: string;
    registeredAt: string;
    count: {
        view: number;
        comment: number;
        mylist: number;
        like: number;
    };
    thumbnail: {
        url: string;
        middleUrl: string;
        largeUrl: string;
        listingUrl: string;
        nHdUrl: string;
    };
    duration: number;
    shortDescription: string;
    latestCommentSummary: string;
    isChannelVideo: boolean;
    isPaymentRequired: boolean;
    playbackPosition?: number;
    requireSensitiveMasking: boolean;
    isMuted: boolean;
    owner: User;
    videoLive?: {
        liveStartTime: string;
    };
}

interface User {
    type: "user";
    visibility: "visible" | "hidden";
    id: string;
    name: string;
    iconUrl: string;
}

interface DoLike {
    thanksMessage: string | null;
}
