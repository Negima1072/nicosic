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
  contentType: 'video';
  recommendType: 'recommend';
  reason: {
    tag: string;
  };
  content: EssentialVideo;
}

interface EssentialVideo {
  type: 'essential';
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
  type: 'user';
  visibility: 'visible' | 'hidden';
  id: string;
  name: string;
  iconUrl: string;
}

interface ExpandUser{
  description: string
  decoratedDescriptionHtml: string
  strippedDescription: string
  isPremium: boolean
  registeredVersion: string
  followeeCount: number
  followerCount: number
  userLevel: {
    currentLevel: number
    nextLevelThresholdExperience: number
    nextLevelExperience: number
    currentLevelExperience: number
  }
  niconicoPoint: number
  language: string
  premiumTicketExpireTime: string | null
  creatorPatronizingScore: number
  userChannel: UserCahennel | null
  isMailBounced: boolean
  isNicorepoReadable: boolean
  isNicorepoAutoPostedToTwitter: boolean
  sns: UserSNS[]
  coverImage: UserCoverImage | null
  id: string
  nickname: string
  icons: {
    small: string
    large: string
  }
}

interface UserCahennel{
  id: string
  name: string
  description: string
  thumbnailUrl: string
  thumbnailSmallUrl: string
}

interface UserCoverImage{
  ogpUrl: string
  pcUrl: string
  smartphoneUrl: string
}

interface UserSNS{
  type: "twitter" | "youtube" | "facebook" | "instagram"
  label: string
  iconUrl: string
  screenName: string
  url: string
}

interface OwnUserData{
  user: ExpandUser
}

interface CreatorSupport{
  creatorSupport: {
    isSupportable: boolean
    canOpenCreatorSupport: boolean
    supporterStatus: {
      isSupporting: boolean
      isBanned: boolean
    }
  }
}

interface DoLike{
  thanksMessage: string | null;
}
