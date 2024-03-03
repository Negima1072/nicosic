interface RelationshipUser {
    description: string;
    icons: {
        large: string;
        small: string;
    };
    id: string;
    isPremium: boolean;
    nickname: string;
    relationships: {
        sessionUser: {
            isFollowing: boolean;
        };
    };
    shortDescription: string;
    strippedDescription: string;
    type: "relationship";
}

interface EssentialUser {
    type: "essential";
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
}

interface NicoUser {
    description: string;
    decoratedDescriptionHtml: string;
    strippedDescription: string;
    isPremium: boolean;
    registeredVersion: string;
    followeeCount: number;
    followerCount: number;
    userLevel: {
        currentLevel: number;
        nextLevelThresholdExperience: number;
        nextLevelExperience: number;
        currentLevelExperience: number;
    };
    userChannel: UserCahennel | null;
    isNicorepoReadable: boolean;
    sns: UserSNS[];
    coverImage: UserCoverImage | null;
    id: string;
    nickname: string;
    icons: {
        small: string;
        large: string;
    };
}

interface ExpandUser extends NicoUser {
    niconicoPoint: number;
    language: string;
    premiumTicketExpireTime: string | null;
    creatorPatronizingScore: number;
    isMailBounced: boolean;
    isNicorepoAutoPostedToTwitter: boolean;
}

interface UserCahennel {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    thumbnailSmallUrl: string;
}

interface UserCoverImage {
    ogpUrl: string;
    pcUrl: string;
    smartphoneUrl: string;
}

interface UserSNS {
    type: "twitter" | "youtube" | "facebook" | "instagram";
    label: string;
    iconUrl: string;
    screenName: string;
    url: string;
}

interface OwnUserData {
    user: ExpandUser;
}

interface UserRelationships {
    sessionUser: {
        isFollowing: boolean;
    };
    isMe: boolean;
}

interface UserData {
    user: NicoUser;
    relationships: UserRelationships;
}

interface CreatorSupport {
    creatorSupport: {
        isSupportable: boolean;
        canOpenCreatorSupport: boolean;
        supporterStatus: {
            isSupporting: boolean;
            isBanned: boolean;
        };
    };
}

interface UserVideosData {
    totalCount: number;
    items: UserVideoItem[];
}

interface UserVideoItem {
    series: UserVideoItemSeries | null
    essential: EssentialVideo;
}

interface UserVideoItemSeries {
    id: number;
    title: string;
    order: number;
}
