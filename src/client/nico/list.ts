import { NicoError, get, post } from "./common";

export async function getOwnMylists(sampleItemCount: number = 3): Promise<MylistInfoData[]> {
    const url = `https://nvapi.nicovideo.jp/v1/users/me/mylists?sampleItemCount=${sampleItemCount}`;
    const res = await get<NvAPIResponse<MylistsData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.mylists;
}

export async function addVideoToMylist(mylistId: number, videoId: string, description: string = ""): Promise<number> {
    let url = `https://nvapi.nicovideo.jp/v1/users/me/mylists/${mylistId}/items`;
    const params = new URLSearchParams();
    params.append("itemId", videoId);
    params.append("description", description);
    url += "?" + params.toString();
    const res = await post<NvAPIResponse<undefined>>(url);
    if (res.meta.status === 201 || res.meta.status === 200) {
        return res.meta.status;
    } else {
        throw new NicoError(res.meta.errorCode!);
    }
}

export async function getMylistItems(
    mylistId: string,
    pageSize?: number,
    page?: number,
    sortKey?: MylistSortKey,
    sortOrder?: MylistSortOrder,
): Promise<MylistDetailData> {
    let url = `https://nvapi.nicovideo.jp/v1/mylists/${mylistId}`;
    const params = new URLSearchParams();
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (page !== undefined) params.append("page", page.toString());
    if (sortKey !== undefined) params.append("sortKey", sortKey);
    if (sortOrder !== undefined) params.append("sortOrder", sortOrder);
    if (params.toString() !== "") url += "?" + params.toString();
    const res = await get<NvAPIResponse<MylistData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.mylist;
}

export async function getSeriesItems(seriesId: string, pageSize?: number, page?: number): Promise<SeriesData> {
    let url = `https://nvapi.nicovideo.jp/v2/series/${seriesId}`;
    const params = new URLSearchParams();
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (page !== undefined) params.append("page", page.toString());
    if (params.toString() !== "") url += "?" + params.toString();
    const res = await get<NvAPIResponse<SeriesData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}
