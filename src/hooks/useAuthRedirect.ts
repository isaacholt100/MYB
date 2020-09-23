import { useRouter } from "next/router";
import { useEffect } from "react";
import useIsLoggedIn from "./useIsLoggedIn"

export default () => {
    const isLoggedIn = useIsLoggedIn(), router = useRouter();
    useEffect(() => {
        if (isLoggedIn) {
            router.replace("/");
        }
    });
    return isLoggedIn;
}