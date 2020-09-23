import Cookies from "js-cookie";
import useSWR from "swr";
export default () => {
    const { data, error } = useSWR("/api/login", url => fetch(url).then(res => res.json()), {
        refreshInterval: 1000,
        onError: () => {}
    });
    if (data !== undefined && !error) {
        return data as boolean;
    }
    const l = Boolean(Cookies.get("refreshToken") && Cookies.get("accessToken"));
    return l;
}