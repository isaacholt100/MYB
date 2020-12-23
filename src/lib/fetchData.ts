import type { IOptions, Handler } from "../types/fetch";

export default async function fetchData({ serverUrl, url, method, file, body, accessToken, refreshToken, fetchOptions }: IOptions, fn: Handler) {
    const res = await fetch(serverUrl + url, {
        credentials: "include",
        method,
        ...(body ? file ? { body: body as BodyInit } : { body: JSON.stringify(body) } : {}),
        ...(fetchOptions || {}),
        headers: {
            ...(file ? {} : { "Content-Type": "application/json" }),
            "authorization": "Bearer " + accessToken,
            "authorization-refresh": "Bearer " + refreshToken,
            "Access-Control-Expose-Headers": "authorization",
            "Access-Control-Allow-Headers": "authorization",
        },
    });
    const header = res?.headers?.get("authorization");
    const extra = header ? {
        accessToken: header,
    } : {};
    if (res?.ok) {
        const data = await res.json();
        if (data?.errors) {
            fn({
                type: "errors",
                data,
                ...extra,
            });
        } else {
            fn({
                type: "success",
                data,
                ...extra,
            });
        }
    } else {
        if (res?.status === 401) {
            fn({
                type: "noauth",
                data: "noauth",
            });
        } else {
            fn({
                type: "failed",
                data: "failed",
                ...extra,
            });
        }
    }
}