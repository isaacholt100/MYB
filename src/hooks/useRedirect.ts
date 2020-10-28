import { useRouter } from "next/router";
import { useEffect } from "react";
import useIsLoggedIn from "./useIsLoggedIn"
import useSnackbar from "./useSnackbar";

export default function useRedirect() {
    const isLoggedIn = useIsLoggedIn(), snackbar = useSnackbar(), router = useRouter();
    useEffect(() => {
        if (isLoggedIn as any === "") {
            router.replace("/");
        } else if (!isLoggedIn) {
            router.replace("/login?to=" + router.pathname);
            snackbar.error("Please login first");
        }
    });
    return Boolean(isLoggedIn);
}