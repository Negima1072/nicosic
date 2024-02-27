import { NicoError, get, post } from "./common";

export function makeActionTrackId(): string {
    const randomStr = Math.random().toString(36).slice(-10);
    const unixTime = Date.now();
    return `${randomStr}_${unixTime}`;
}

export async function getWatchData(videoId: string, actionTrackId: string): Promise<WatchData> {
    const url = `https://www.nicovideo.jp/api/watch/v3_guest/${videoId}?actionTrackId=${actionTrackId}`;
    const res = await get<WatchAPIResponse<WatchData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getAccessRight(
    videoId: string,
    outputs: string[][],
    actionTrackId: string,
): Promise<AccessRight> {
    const url = `https://nvapi.nicovideo.jp/v1/watch/${videoId}/access-rights/hls?actionTrackId=${actionTrackId}`;
    const res = await post<WatchAPIResponse<AccessRight>>(url, {
        outputs: outputs,
    });
    if (res.meta.status !== 201 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}
