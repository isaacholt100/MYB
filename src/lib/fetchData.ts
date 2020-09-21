import type { IOptions, Handler } from "../types/fetch";

export default async ({ serverUrl, url, method, file, body, accessToken, refreshToken, ...other }: IOptions, fn: Handler) => {
    const res = await fetch(serverUrl + url, {
        credentials: "include",
        method,
        ...(body ? file ? { body: body as BodyInit } : { body: JSON.stringify(body) } : {}),
        ...other,
        headers: {
            ...(file ? {} : { "Content-Type": "application/json" }),
            "authorization": "Bearer " + accessToken,
            "authorization-refresh": "Bearer " + refreshToken,
            "Access-Control-Expose-Headers": "authorization",
            "Access-Control-Allow-Headers": "authorization",
        },
    });
    const extra: { accessToken?: string } = {};
    if (res && res.headers && res.headers.get("authorization")) {
        extra.accessToken = res.headers.get("authorization");
    }
    try {
        if (res && res.ok) {
            const data = await res.json();
            if (data === "failed") {
                throw new Error("Failed");
            } else if (data && data.errors) {
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
            throw new Error("Response not OK");
        }
    } catch (err) {
        fn({
            type: "failed",
            data: err.name,
            ...extra,
        });
    }
}