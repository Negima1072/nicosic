interface WatchAPIResponse<T> {
  meta: {
    status: number;
    errorCode?: string;
  };
  data?: T;
}

interface WatchData {
  ads: {
    isAvailable: boolean
  } | null
  category: null,
  channel: WatchChannel | null,
  client: WatchClient,
  comment: WatchComment,
  community: WatchCommunity | null
  easyComment: WatchEasyComments,
  external: {
    commons: {
      hasContentTree: boolean
    }
    ichiba: {
      isEnabled: boolean
    }
  } | null,
  genre: WatchGenre,
  marquee: {
    isDisabled: boolean
    tagRelatedLead: null
  } | null,
  media: WatchMedia,
  okReason: string
  owner: WatchOwner | null
  payment: WatchPayment
  pcWatchPage: null
  player: WatchPlayer
  ppv: {
    accessFrom: string | null
  } | null
  ranking: WatchRanking
  series: WatchSeries | null
  smartphone: null
  system: {
    serverTime: string
    isPeakTime: boolean
    isStellaAlive: boolean
  }
  tag: WatchTags
  video: WatchVideo
  videoAds: WatchVideoAds
  videoLive: {
    programId: string
    beginAt: string
    endAt: string
  } | null
  viewer: WatchViewer | null
  waku: null
}

interface WatchChannel{
  id: string
  name: string
  isOfficialAnime: boolean
  isDisplayAdBanner: boolean
  thumbnail: {
    url: string
    smallUrl: string
  }
  viewer: {
    follow: {
      isFollowed: boolean
      isBookmarked: boolean
      token: string
      tokenTimestamp: number
    }
  }
}

interface WatchClient{
  nicosid: string
  watchId: string
  watchTrackId: string
}

interface WatchComment{
  server: {
    url: string
  }
  keys: {
    userKey: string
  }
  layers: WatchCommentLayer[]
  threads: WatchCommentThread[]
  ng: {
    ngScore: {
      isDisabled: boolean
    }
    channel: []
    owner: []
    viewer: {
      revision: number
      count: number
      items: {
        type: string
        source: string
        registeredAt: string
      }[]
    }
  }
  isAttentionRequired: boolean
  nvComment: WatchNvComment
}

interface WatchCommentLayer{
  index: number
  isTranslucent: boolean
  threadIds: {
    id: number
    fork: number
    forkLabel: string
  }[]
}

interface WatchCommentThread{
  id: number
  fork: number
  forkLabel: string
  videoId: string
  isActive: boolean
  isDefaultPostTarget: boolean
  isEasyCommentPostTarget: boolean
  isLeafRequired: boolean
  isOwnerThread: boolean
  isThreadkeyRequired: boolean
  threadkey: string | null;
  is184Forced: boolean
  hasNicoscript: boolean;
  label: string
  postkeyStatus: number
  server: string
}

interface WatchNvComment{
  threadKey: string
  server: string
  params: {
    targets: {
      id: string
      fork: string
    }[]
    language: string
  }
}

interface WatchCommunity{
  main: {
    id: string
    name: string
  }
  belong: {
    id: string
    name: string
  }
}

interface WatchEasyComments{
  phrases: WatchEasyComment[]
}

interface WatchEasyComment{
  text: string
  nicodic: {
    title: string
    viewTitle: string
    summary: string
    link: string
  }
}

interface WatchGenre{
  key: string
  label: string
  isImmoral: boolean
  isDisabled: boolean
  isNotSet: boolean
}

interface WatchMedia{
  domand: WatchDomand | null
  delivery: WatchMediaDelivery | null
  deliveryLegacy: null
}

interface WatchDomand{
  videos: WatchDomandVideo[]
  audios: WatchDomandAudio[]
  isStoryboardAvailable: boolean
  accessRightKey: string
}

interface WatchDomandVideo{
  id: string
  isAvailable: boolean
  label: string
  bitRate: number
  width: number
  height: number
  qualityLevel: number
  recommendedHighestAudioQualityLevel: number
}

interface WatchDomandAudio{
  id: string
  isAvailable: boolean
  bitRate: number
  samplingRate: number
  integratedLoudness: number
  truePeak: number
  qualityLevel: number
  loudnessCollection: {
    type: string
    value: number
  }[]
}

interface WatchMediaDelivery{
  recipeId: string
  encryption: null
  movie: {
    contentId: string
    audios: WatchMediaDeliveryAudio[]
    videos: WatchMediaDeliveryVideo[]
    session: WatchMediaDeliverySession
  }
  storyboard: {
    contentId: string
    images: {
      id: string
    }[]
    session: WatchMediaDeliverySession
  }
  trackingId: string
}

interface WatchMediaDeliveryAudio{
  id: string
  isAvailable: boolean
  metadata: {
    bitrate: number
    samplingRate: number
    loudness: {
      integratedLoudness: number
      truePeak: number
    }
    levelIndex: number
    loudnessCollection: {
      type: string
      value: number
    }[]
  }
}

interface WatchMediaDeliveryVideo{
  id: string
  isAvailable: boolean
  metadata: {
    label: string
    bitrate: number
    resolution: {
      width: number
      height: number
    }
    levelIndex: number
    recommendedHighestAudioLevelIndex: number
  }
}

interface WatchMediaDeliverySession{
  recipeId: string
  playerId: string
  videos: string[]
  audios: string[]
  movies: []
  protocols: string[]
  authTypes: {[key: string]: string}
  serviceUserId: string
  token: string
  signature: string
  contentId: string
  heartbeatLifetime: number
  contentKeyTimeout: number
  priority: number
  transferPresets: string[]
  urls: {
    url: string
    isWellKnownPort: boolean
    isSsl: boolean
  }[]
}

interface WatchOwner{
  id: number
  nickname: string
  iconUrl: string
  channel: {
    id: string
    name: string
    url: string
  } | null
  live: {
    id: string
    title: string
    url: string
    begunAt: string
    isVideoLive: boolean
    videoLiveOnAirStartTime: string | null;
    thumbnailUrl: string | null;
  } | null
  isVideosPublic: boolean
  isMylistsPublic: boolean
  videoLiveNotice: null
  viewer: {
    isFollowing: boolean
  } | null
}

interface WatchPayment{
  video: {
    isPpv: boolean
    isAdmission: boolean
    isContinuationBenefit: boolean
    isPremium: boolean
    watchableUserType: string
    commentableUserType: string
  }
  preview: {
    ppv: {
      isEnabled: boolean
    }
    admission: {
      isEnabled: boolean
    }
    continuationBenefit: {
      isEnabled: boolean
    }
    premium: {
      isEnabled: boolean
    }
  }
}

interface WatchPlayer{
  initialPlayback: {
    type: string
    positionSec: number
  } | null
  comment: {
    isDefaultInvisible: boolean
  }
  layerMode: number
}

interface WatchRanking{
  genre: {
    rank: number
    genre: string
    dateTime: string
  } | null
  popularTag: {
    tag: string
    regularizedTag: string
    rank: number
    genre: string
    dateTime: string
  }[]
}

interface WatchSeries{
  id: number
  title: string
  description: string
  thumbnailUrl: string
  video: {
    prev: EssentialVideo | null
    next: EssentialVideo | null
    first: EssentialVideo | null
  }
}

interface WatchTags{
  items: {
    name: string
    isCategory: boolean
    isCategoryCandidate: boolean
    isNicodicArticleExists: boolean
    isLocked: boolean
  }[]
  hasR18Tag: boolean
  isPublishedNicoscript: boolean
  edit: {
    isEditable:  boolean
    uneditableReason: string | null
    editKey: string | null
  }
  viewer: {
    isEditable: boolean
    uneditableReason: string | null
    editKey: string | null
  } | null
}

interface WatchVideo{
  id: string
  title: string
  description: string
  count: {
    view: number
    comment: number
    mylist: number
    like: number
  }
  duration: number
  thumbnail: {
    url: string
    middleUrl: string
    largeUrl: string
    player: string
    ogp: string
  }
  rating: {
    isAdult: boolean
  }
  registeredAt: string
  isPrivate: boolean
  isDeleted: boolean
  isNoBanner: boolean
  isAuthenticationRequired: boolean
  isEmbedPlayerAllowed: boolean
  isGiftAllowed: boolean
  viewer: {
    isOwner: boolean
    like: {
      isLiked: boolean
      count: null
    }
  } | null
  watchableUserTypeForPayment: string
  commentableUserTypeForPayment: string
}

interface WatchVideoAds{
  additionalParams: {
    videoId: string
    videoDuration: number
    isAdultRatingNG: boolean
    isAuthenticationRequired: boolean
    isR18: boolean
    nicosid: string
    lang: string
    watchTrackId: string
    genre?: string
    gender?: string
    age?: number
  }
  reason: string | null
  items: {
    type: string
    timingMs: number | null
    additionalParams: {
      linearType: string
      adIdx: number
      skipType: number
      skippableType: number
      pod: number
    }
  }[]
}

interface WatchViewer{
  id: number
  nickname: string
  isPremium: boolean
  existence: {
    age: number
    prefecture: string
    sex: string
  }
}

interface UserFollow{
  following: boolean
}
