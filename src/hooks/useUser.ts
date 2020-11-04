import useSWR from "swr";
import { IMember } from "../types/member";
import Cookies from "js-cookie";

export default function useUser(): IMember & { school_id: string } {
    const { data: user, error } = useSWR("/api/user", {
        refreshInterval: 1000,
    });
    if (error || user?.err || !user) {
        return process.browser ? {
            name: localStorage.getItem("name"),
            _id: Cookies.get("user_id"),
            pic: localStorage.getItem("pic"),
            quote: localStorage.getItem("quote"),
            school_id: localStorage.getItem("school_id"),
        } : {
            name: "",
            _id: "",
            pic: "",
            quote: "",
            school_id: "",
        };
    }
    return user;
}