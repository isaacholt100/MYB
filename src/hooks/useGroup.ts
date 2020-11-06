import Cookies from "js-cookie";
import type { ObjectId } from "mongodb";
import useSWR from "swr";

interface IGroup {
    _id: string;
    name: string;
    admin_id: string;
    pic: string;
}
export default function useGroup(): IGroup {
    const { data, error } = useSWR("/api/group", {
        refreshInterval: 1000,
    });
    if (error || data?.err || !data) {
        return process.browser ? {
            name: localStorage.getItem("group_name"),
            _id: localStorage.getItem("group__id"),
            pic: localStorage.getItem("group_pic"),
            admin_id: localStorage.getItem("group_admin_id"),
        } : {
            name: "",
            _id: "",
            pic: "",
            admin_id: "",
        };
    }
    return data;
}