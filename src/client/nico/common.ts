export async function get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch("/proxy?url=" + encodeURIComponent(url), {
        method: "GET",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Request-With": "https://www.nicovideo.jp/",
            ...headers,
        },
        cache: "force-cache",
    });
    const data = (await response.json()) as T;
    return data;
}

export async function post<T>(url: string, body: object, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch("/proxy?url=" + encodeURIComponent(url), {
        method: "POST",
        headers: {
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Request-With": "https://www.nicovideo.jp",
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify(body),
    });
    const data = (await response.json()) as T;
    return data;
}

export class NicoError extends Error {
    constructor(public errorCode: string) {
        super(`NicoError: ${errorCode}`);
    }
}
