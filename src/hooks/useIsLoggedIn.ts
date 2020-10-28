import Cookies from "js-cookie";
import useSWR from "swr";
export default function useIsLoggedIn() {
    const l = Boolean(Cookies.get("refreshToken") && Cookies.get("accessToken"));
    const { data, error } = useSWR("/api/login", url => fetch(url).then(res => res.json()), {
        refreshInterval: 1000,
        onError: () => {},
        initialData: l,
    });
    if (!error) {
        return data as boolean;
    }
    return l;
}