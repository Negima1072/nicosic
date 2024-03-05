interface WktkData<T> {
    frames: WktkFrame<T>[]
    label: string | null
}

interface WktkFrame<T> {
    name: string
    items: WktkFrameItem<T>[]
}

interface WktkFrameItem<T> {
    itemId: number
    name: string
    isNew: boolean
    values: T
}

interface WktkHomePickupItem {
    androidDisplayTarget: WktkFrameItemValueText
    iOSDisplayTarget: WktkFrameItemValueText
    description: WktkFrameItemValueText
    image: WktkFrameItemValueImage
    image2: WktkFrameItemValueImage
    image3: WktkFrameItemValueImage
    label: WktkFrameItemValueText
    link: WktkFrameItemValueLink
}

interface WktkFrameItemValueText {
    context: string
    valueType: "text"
}

interface WktkFrameItemValueImage {
    alt: string
    height: number | null
    resized: object
    url: string | null
    valueType: "image"
    width: number | null
}

interface WktkFrameItemValueLink {
    isNewWindow: boolean
    origin: string
    type: "mylist"
    url: string
    valueType: "link"
}

interface WktkMylistRankingItem {
    mylist: WktkFrameItemValueMylist
}

interface WktkPastFeatureItem {
    mylist: WktkFrameItemValueMylist
}

interface WktkTwitterMylistItem {
    mylist: WktkFrameItemValueMylist
    description: WktkFrameItemValueText
}

interface WktkPastEventItem {
    description: WktkFrameItemValueText
    image: WktkFrameItemValueImage
    image2: WktkFrameItemValueImage
    image3: WktkFrameItemValueImage
    link: WktkFrameItemValueLink
    label: WktkFrameItemValueText
    osApplySwitch: WktkFrameItemValueText
}

interface WktkFrameItemValueMylist {
    mylist: WktkMylist
    valueType: "mylist"
}

interface WktkMylist {
    count: number
    id: number
    name: string
    nickname: string
    public: 0 | 1
    url: string
    userId: number
    videos: WktkVideo[]
}

interface WktkVideo {
    commentCounter: number
    id: string
    largeThumbnailUrl: string
    lastResBody: string
    lengthSeconds: number
    middleThumbnailUrl: string
    mylistCounter: number
    ownerIcon: string
    ownerId: number
    ownerName: string
    ownerType: "user" | "channel"
    startTime: string
    thumbnailUrl: string
    title: string
    url: string
    viewCounter: number
}
