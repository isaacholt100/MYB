import useSWR from "swr";
import { IMember } from "../types/member";
import Cookies from "js-cookie";

export default function useUser(): IMember & { group_id: string } {
    const { data: user, error } = useSWR("/api/user", {
        refreshInterval: 1000,
    });
    if (error || user?.err || !user) {
        return process.browser ? {
            name: localStorage.getItem("name"),
            _id: Cookies.get("user_id"),
            pic: localStorage.getItem("pic"),
            quote: localStorage.getItem("quote"),
            group_id: localStorage.getItem("group_id"),
        } : {
            name: "",
            _id: "",
            pic: "",
            quote: "",
            group_id: "",
        };
    }
    return user;
}