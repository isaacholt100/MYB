import Cookies from "js-cookie";
import useCookies from "./useCookies";
import useSWR from "swr";
const fetcher = async (url: string) => {
    const res = await fetch(url);
    return await res.json();
}
export default () => {
    const { data, error } = useSWR("/api/login", url => fetch(url).then(res => res.json()));
    if (!error) {
        return data.loggedIn;
    }
    const l = Boolean(Cookies.get("accessToken") && Cookies.get("refresh"));
    return l;
}