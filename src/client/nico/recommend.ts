import { NicoError, get } from "./common";

export async function getRecommendItems<T = RecommendItem>(
    recipeId: string,
    recipeVersion: number = 1,
    site: string = "nicobox",
    contentTypeFilter: RecommendContentType = "video",
): Promise<RecommendData<T>> {
    const url = `https://nvapi.nicovideo.jp/v1/recommend`;
    const params = new URLSearchParams();
    params.set("recipeId", recipeId);
    params.set("recipeVersion", recipeVersion.toString());
    params.set("site", site);
    params.set("contentTypeFilter", contentTypeFilter);
    const res = await get<NvAPIResponse<RecommendData<T>>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getNicoboxTrendVideos(): Promise<RecommendData<RecommendVideoItem>> {
    return getRecommendItems("nicobox_ios_trends");
}
