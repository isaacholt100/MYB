import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { mutate } from "swr";

export default function useLogout() {
    const router = useRouter();
    return () => {
        mutate("/api/login", "", false);
        Cookies.remove("refreshToken");
        Cookies.remove("accessToken");
        Cookies.remove("user_id");
        localStorage.clear();
        router.push("/login");
    }
}