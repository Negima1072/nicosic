import { NicoError, get } from "./common";

export async function getOwnMylists(sampleItemCount: number = 3): Promise<MylistInfoData[]> {
    const url = `https://nvapi.nicovideo.jp/v1/users/me/mylists?sampleItemCount=${sampleItemCount}`;
    const res = await get<NvAPIResponse<MylistsData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.mylists;
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
