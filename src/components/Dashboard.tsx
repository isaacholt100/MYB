import { useDelete } from "../hooks/useRequest";
import Cookies from "js-cookie";
import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { mutate } from "swr";
export default function Dashboard() {
    const [del, loading] = useDelete();
    const router = useRouter();
    const logout = () => {
        del("/login", {
            setLoading: true,
            done: () => {
                Cookies.remove("refreshToken");
                Cookies.remove("accessToken");
                Cookies.remove("user_id");
                localStorage.clear();
                mutate("/api/login", false, false);
                //router.push("/");
            }
        });
    }
    return (
        <div>Dashboard<Button onClick={logout}>Logout</Button></div>
    );
}