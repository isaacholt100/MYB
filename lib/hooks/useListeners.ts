/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, ReactText, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import publicRoutes from "../../json/publicRoutes.json";
import usePathname from "./usePathname";
import useSnackbar from "./useSnackbar";
import useSocket from "./useSocket";
import useCookies from "./useCookies";

export default () => {
    const
        key: MutableRefObject<ReactText> = useRef(),
        snackbar = useSnackbar(),
        cookies = useCookies(),
        pathname = usePathname(),
        socket = useSocket(),
        dispatch = useDispatch(),
        connection = (online: boolean) => () => {
            if (!online) {
                key.current = snackbar.open("No connection", {
                    variant: "error",
                    persist: true,
                });
            } else {
                snackbar.close(key.current);
            }
        };
    useEffect(() => {
        !navigator.onLine && connection(false)();
        window.addEventListener("offline", connection(false));
        window.addEventListener("online", connection(true));
        socket.on("failed", snackbar.error);
        socket.on("error", () => snackbar.error("There was an error connecting to the server"));
        socket.on("theme", dispatch);
        socket.dispatchOn("/book/create");
        socket.dispatchOn("/book/update");
        socket.dispatchOn("/book/delete");
        socket.dispatchOn("/chats/create");
        socket.dispatchOn("/chats/delete");
        socket.dispatchOn("/chats/member/leave");
        socket.dispatchOn("/chats/member/remove");
        socket.dispatchOn("/chats/member/join");
        socket.dispatchOn("/classes/create");
        socket.dispatchOn("/classes/delete");
        socket.dispatchOn("/classes/member/leave");
        socket.dispatchOn("/classes/member/remove");
        socket.dispatchOn("/classes/member/join");
        socket.dispatchOn("/reminder/create");
        socket.dispatchOn("/reminder/update");
        socket.dispatchOn("/reminder/delete");
        socket.dispatchOn("/reminder/undo");
        socket.dispatchOn("/timetable/update");
        socket.dispatchOn("/timetable/upload");
        socket.dispatchOn("/timetable/sat");
        socket.dispatchOn("/user/info/update");
        socket.dispatchOn("/user/carouselView");
        socket.dispatchOn("/theme");
        socket.dispatchOn("/theme/reset");
        socket.on("logout", () => {
            if (cookies.empty("refresh")) {
                //history.push("/login");
                dispatch({
                    type: "LOGOUT",
                });
            }
        });
        return () => socket.removeAllListeners();
    }, []);
    useEffect(() => {
        dispatch({
            type: "URL_CHANGE",
            payload: false,
        });
        //if (!publicRoutes.includes(pathname.replace(/\/+$/, "")) && cookies.empty("refresh")) {
            //snackbar.error("Please login first");
        //}
    }, [pathname]);
}