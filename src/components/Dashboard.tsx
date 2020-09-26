import { useDelete } from "../hooks/useRequest";
import Cookies from "js-cookie";
import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { useTheme } from "../context/Theme";
export default () => {
    const [del, loading] = useDelete();
    const router = useRouter();
    const [, setTheme] = useTheme();
    const logout = () => {
        del("/login", {
            setLoading: true,
            done: () => {
                Cookies.remove("refreshToken");
                Cookies.remove("accessToken");
                Cookies.remove("user_id");
                localStorage.clear();
                setTheme(null);
                mutate("/api/login", false, false);
                //router.push("/");
            }
        });
    }
    return (
        <div>Dashboard<Button onClick={logout}>Logout</Button></div>
    );
}