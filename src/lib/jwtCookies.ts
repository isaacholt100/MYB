import { mutate } from "swr";
import Cookies from "js-cookie";

export default ({ accessToken, refreshToken, staySignedIn }: { accessToken: string, refreshToken: string, staySignedIn: boolean }) => {
    sessionStorage.setItem("visited", "1");
    Cookies.set("accessToken", accessToken, {sameSite: "strict", ...(staySignedIn ? { expires: 100 } : {expires: 100})});
    Cookies.set("refreshToken", refreshToken, {sameSite: "strict", ...(staySignedIn ? { expires: 1000000 } : {})});
    mutate("/api/login", true, false);
}