import { NicoError, get } from "./common";

export async function searchVideos(
    query: string,
    queryType: SearchQueryType,
    page?: number,
    pageSize?: number,
    minDuration?: number,
    maxDuration?: number,
    minRegisteredAt?: string,
    maxRegisteredAt?: string,
    channelVideoListingStatus?: ChannelVideoListingStatus,
    sortKey?: SearchVideoSortKey,
    sortOrder?: SearchOrder,
    genres?: string[],
    searchByUser?: boolean,
    allowFutureContents: boolean = false,
): Promise<SearchVideoData> {
    const url = `https://nvapi.nicovideo.jp/v2/search/video`;
    const params = new URLSearchParams();
    params.append(queryType, query);
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (sortKey !== undefined) params.append("sortKey", sortKey);
    if (sortOrder !== undefined) params.append("sortOrder", sortOrder);
    if (genres !== undefined) params.append("genres", genres.join(","));
    if (searchByUser !== undefined) params.append("searchByUser", searchByUser.toString());
    if (minDuration !== undefined) params.append("minDuration", minDuration.toString());
    if (maxDuration !== undefined) params.append("maxDuration", maxDuration.toString());
    if (minRegisteredAt !== undefined) params.append("minRegisteredAt", minRegisteredAt);
    if (maxRegisteredAt !== undefined) params.append("maxRegisteredAt", maxRegisteredAt);
    if (channelVideoListingStatus !== undefined) params.append("channelVideoListingStatus", channelVideoListingStatus);
    params.append("allowFutureContents", allowFutureContents.toString());
    const res = await get<NvAPIResponse<SearchVideoData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function searchUsers(
    keyword: string,
    page?: number,
    pageSize?: number,
    sortKey?: SearchUserSortKey,
    searchByUser?: boolean,
): Promise<SearchUserData> {
    const url = `https://nvapi.nicovideo.jp/v1/search/user`;
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (sortKey !== undefined) params.append("sortKey", sortKey);
    if (searchByUser !== undefined) params.append("searchByUser", searchByUser.toString());
    const res = await get<NvAPIResponse<SearchUserData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function searchMylists(
    keyword: string,
    listType: SearchListType,
    page?: number,
    pageSize?: number,
    sortKey?: SearchListSortKey,
    sortOrder?: SearchOrder,
    searchByUser?: boolean,
): Promise<SearchListData> {
    const url = `https://nvapi.nicovideo.jp/v1/search/list`;
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    params.append("types", listType);
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (sortKey !== undefined) params.append("sortKey", sortKey);
    if (sortOrder !== undefined) params.append("sortOrder", sortOrder);
    if (searchByUser !== undefined) params.append("searchByUser", searchByUser.toString());
    const res = await get<NvAPIResponse<SearchListData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}
