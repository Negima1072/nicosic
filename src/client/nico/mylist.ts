import { NicoError, get } from "./common";

export async function getOwnMylists(sampleItemCount: number = 3): Promise<MylistData[]> {
    const url = `https://nvapi.nicovideo.jp/v1/users/me/mylists?sampleItemCount=${sampleItemCount}`;
    const res = await get<NvAPIResponse<MylistData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.mylists;
}
