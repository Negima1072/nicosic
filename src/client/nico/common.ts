export async function get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch("/proxy?url" + encodeURIComponent(url), {
        method: "GET",
        headers: {
            ...headers,
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Request-With": "https://www.nicovideo.jp/",
        },
    });
    const data = (await response.json()) as T;
    return data;
}

export async function post<T>(url: string, body: object, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch("/proxy?url" + encodeURIComponent(url), {
        method: "POST",
        headers: {
            ...headers,
            "X-Frontend-Id": "6",
            "X-Frontend-Version": "0",
            "X-Request-With": "https://www.nicovideo.jp/",
            "Content-Type": "application/json",
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
