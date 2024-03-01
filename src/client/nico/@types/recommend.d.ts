interface RecommendData<T = RecommendItem> {
    recipe: RecommendRecipe;
    recommendId: string;
    items: T[];
}

interface RecommendRecipe {
    id: string;
    meta: null;
}

type RecommendItem = RecommendVideoItem | RecommendTagItem | RecommendMylistItem | RecommendUserItem;

type RecommendContentType = "video" | "tag" | "mylist" | "user";

interface RecommendItemBase {
    id: string;
    contentType: RecommendContentType;
    recommendType: "recommend";
}

interface RecommendVideoItem extends RecommendItemBase {
    contentType: "video";
    content: EssentialVideo;
}

interface RecommendTagItem extends RecommendItemBase {
    contentType: "tag";
    content: string;
}

interface RecommendMylistItem extends RecommendItemBase {
    contentType: "mylist";
    content: MylistInfoData;
}

interface RecommendUserItem extends RecommendItemBase {
    contentType: "user";
    content: RelationshipUser;
}
