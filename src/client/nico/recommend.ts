import { NicoError, get } from "./common";

export async function getRecommendItems<T = RecommendItem>(
    recipeId: string,
    recipeVersion: number = 1,
    site: string = "nicobox",
    contentTypeFilter: RecommendContentType = "video",
    limit?: number,
    additionalParams: Record<string, string> = {}
): Promise<RecommendData<T>> {
    const url = `https://nvapi.nicovideo.jp/v1/recommend`;
    const params = new URLSearchParams();
    params.set("recipeId", recipeId);
    params.set("recipeVersion", recipeVersion.toString());
    params.set("site", site);
    params.set("contentTypeFilter", contentTypeFilter);
    if (limit !== undefined) {
        params.set("limit", limit.toString());
    }
    for (const key in additionalParams) {
        params.set(key, additionalParams[key]);
    }
    const res = await get<NvAPIResponse<RecommendData<T>>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getNicoboxTrendVideos(): Promise<RecommendData<RecommendVideoItem>> {
    return await getRecommendItems("nicobox_ios_trends", 1, "nicobox", "video", 100);
}

export async function getNicoboxPopularTags(): Promise<RecommendData<RecommendTagItem>> {
    return await getRecommendItems("nicobox_ios_trend_tag", 2, "nicobox", "tag", 12);
}

export async function getVideoRelatedMylists(videoId: string): Promise<RecommendData<RecommendMylistItem>> {
    return await getRecommendItems("nicobox_ios_related_mylist", 1, "nicobox", "mylist", 10, { videoId });
}

export async function getPopularWorks(): Promise<RecommendData<RecommendVideoItem>> {
    return await getRecommendItems("nicobox_ios_trend_works", 1, "nicobox", "video", 10);
}

export async function getHomeRecommendVideos(userId: string): Promise<RecommendData<RecommendVideoItem>> {
    return await getRecommendItems("nicobox_ios_home_recommend", 1, "nicobox", "video", 10, { userId });
}

export async function getTrendMylists(): Promise<RecommendData<RecommendMylistItem>> {
    return await getRecommendItems("nicobox_ios_trend_user_mylist", 1, "nicobox", "mylist", 10);
}
