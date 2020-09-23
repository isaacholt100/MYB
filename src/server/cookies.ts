import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiResponse } from "next";
export const clearCookies = (res: NextApiResponse, ...cs: [string, CookieSerializeOptions][]) => {
    res.setHeader("Set-Cookie", cs.map(c => serialize(c[0], "", {
        maxAge: -1,
        ...c[1],
    })));
}
export const setCookies = (res: NextApiResponse, ...cs: [string, string, CookieSerializeOptions][]) => {
    res.setHeader("Set-Cookie", cs.map(c => serialize(c[0], c[1], {
        ...c[2],
    })));
}