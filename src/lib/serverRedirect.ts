import type { NextPageContext } from "next";
import nextCookies from "next-cookies";

export default async function serverRedirect(ctx: NextPageContext, toLogin: boolean) {
    const cookies = nextCookies(ctx);
    const { res } = ctx;
    const isLoggedIn = Boolean(cookies.refreshToken && cookies.httpRefreshToken && cookies.accessToken);
    if (!isLoggedIn && toLogin) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return;
    } else if (isLoggedIn && !toLogin) {
        res.setHeader("location", "/home");
        res.statusCode = 302;
        res.end();
        return;
    }
    return {
        props: {}
    }
}