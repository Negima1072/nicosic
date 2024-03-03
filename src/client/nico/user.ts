import { NicoError, get } from "./common";

export async function getOwnUserData(): Promise<ExpandUser> {
    const url = `https://nvapi.nicovideo.jp/v1/users/me`;
    const res = await get<NvAPIResponse<OwnUserData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.user;
}

export async function getUserData(userId: string): Promise<UserData> {
    const url = `https://nvapi.nicovideo.jp/v1/users/${userId}`;
    const res = await get<NvAPIResponse<UserData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getUserVideos(
    userId: string,
    sortKey?: SearchVideoSortKeyOd,
    sortOrder?: SearchSortOrder,
    page?: number,
    pageSize?: number,
): Promise<UserVideosData> {
    const url = `https://nvapi.nicovideo.jp/v3/users/${userId}/videos`;
    const params = new URLSearchParams();
    params.append("_language", "ja-jp");
    if (sortKey !== undefined) params.append("sortKey", sortKey);
    if (sortOrder !== undefined) params.append("sortOrder", sortOrder);
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    const res = await get<NvAPIResponse<UserVideosData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getUserMylists(userId: string, sampleItemCount?: number): Promise<MylistsData> {
    const url = `https://nvapi.nicovideo.jp/v1/users/${userId}/mylists`;
    const params = new URLSearchParams();
    params.append("_language", "ja-jp");
    if (sampleItemCount !== undefined) params.append("sampleItemCount", sampleItemCount.toString());
    const res = await get<NvAPIResponse<MylistsData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}
