import { useDelete } from "../hooks/useRequest";
import Cookies from "js-cookie";
import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { mutate } from "swr";
export default () => {
    const [del, loading] = useDelete();
    const router = useRouter();
    const logout = () => {
        del("/login", {
            setLoading: true,
            done: () => {
                Cookies.remove("refreshToken");
                Cookies.remove("accessToken");
                mutate("/api/login", false, false);
                router.push("/login");
            }
        });
    }
    return (
        <div>Dashboard<Button onClick={logout}>Logout</Button></div>
    );
}