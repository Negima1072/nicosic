import { NicoError, get } from "./common";

export async function getOwnUserData(): Promise<ExpandUser> {
    const url = `https://nvapi.nicovideo.jp/v1/users/me`;
    const res = await get<NvAPIResponse<OwnUserData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.user;
}

export async function getUserData(userId: string): Promise<NicoUser> {
    const url = `https://nvapi.nicovideo.jp/v1/users/${userId}`;
    const res = await get<NvAPIResponse<UserData>>(url);
    if (res.meta.status !== 200 || res.data === undefined) {
        throw new NicoError(res.meta.errorCode!);
    }
    return res.data.user;
}
