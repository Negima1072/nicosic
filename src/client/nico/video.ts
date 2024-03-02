import { NicoError, get, post } from "./common";

export function makeActionTrackId(): string {
    const randomStrBase = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomStr = Array.from(
        { length: 10 },
        () => randomStrBase[Math.floor(Math.random() * randomStrBase.length)],
    ).join("");
    const unixTime = Date.now();
    return `${randomStr}_${unixTime}`;
}

export async function getWatchDataGuest(videoId: string, actionTrackId: string, prevIntegratedLoudness?: number): Promise<WatchData> {
    const url = `https://www.nicovideo.jp/api/watch/v3_guest/${videoId}`;
    const params = new URLSearchParams();
    params.append("actionTrackId", actionTrackId);
    if (prevIntegratedLoudness !== undefined) {
        params.append("prevIntegratedLoudness", prevIntegratedLoudness.toString());
    }
    const res = await get<WatchAPIResponse<WatchData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getWatchData(videoId: string, actionTrackId: string, prevIntegratedLoudness?: number): Promise<WatchData> {
    const url = `https://www.nicovideo.jp/api/watch/v3/${videoId}`;
    const params = new URLSearchParams();
    params.append("actionTrackId", actionTrackId);
    if (prevIntegratedLoudness !== undefined) {
        params.append("prevIntegratedLoudness", prevIntegratedLoudness.toString());
    }
    const res = await get<WatchAPIResponse<WatchData>>(url + "?" + params.toString());
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}

export async function getAccessRight(
    videoId: string,
    outputs: string[][],
    accessRightKey: string,
    actionTrackId: string,
): Promise<AccessRight> {
    const url = `https://nvapi.nicovideo.jp/v1/watch/${videoId}/access-rights/hls?actionTrackId=${actionTrackId}`;
    const res = await post<NvAPIResponse<AccessRight>>(
        url,
        {
            outputs: outputs,
        },
        {
            "X-Access-Right-Key": accessRightKey,
        },
    );
    if (res.meta.status !== 201 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data;
}
