import { NicoError, get } from "./common";

export async function getWktkFrames<T>(name: string): Promise<WktkFrameItem<T>[]> {
    const url = `https://wktk.nicovideo.jp/v2/wakutkool/frames.json`;
    const params = new URLSearchParams();
    params.append("responseType", "nicobox");
    params.append("names", name);
    const res = await get<NvAPIResponse<WktkData<T>>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined || res.data.frames.length === 0) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.frames[0].items;
}

export async function getHomePickupFrames(): Promise<WktkFrameItem<WktkHomePickupItem>[]> {
    return await getWktkFrames<WktkHomePickupItem>("nicobox-home-pickup-small");
}

export async function getMylistRankingFrames(): Promise<WktkFrameItem<WktkMylistRankingItem>[]> {
    return await getWktkFrames<WktkMylistRankingItem>("nicobox-home-mylist-ranking");
}

export async function getTwitterMylistFrames(): Promise<WktkFrameItem<WktkTwitterMylistItem>[]> {
    return await getWktkFrames<WktkTwitterMylistItem>("nicobox-home-mylist-twitter");
}

export async function getPastEventFrames(): Promise<WktkFrameItem<WktkPastEventItem>[]> {
    return await getWktkFrames<WktkPastEventItem>("nicobox-past-events");
}

export async function getPastFeatureFrames(): Promise<WktkFrameItem<WktkPastFeatureItem>[]> {
    return await getWktkFrames<WktkPastFeatureItem>("vocacolle-app-past-feature");
}
