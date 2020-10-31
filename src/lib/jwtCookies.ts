import { mutate } from "swr";
import Cookies from "js-cookie";

export default function jwtCookies({ accessToken, refreshToken, staySignedIn, user_id }: { accessToken: string, refreshToken: string, staySignedIn: boolean, user_id: string }) {
    sessionStorage.setItem("visited", "1");
    Cookies.set("accessToken", accessToken, {sameSite: "strict", ...(staySignedIn ? { expires: 100 } : {expires: 100})});
    Cookies.set("refreshToken", refreshToken, {sameSite: "strict", ...(staySignedIn ? { expires: 1000000 } : {})});
    Cookies.set("user_id", user_id);
    mutate("/api/login", true, false);
}