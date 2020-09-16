import Request from "../workers/request.worker";
import serverUrl from "../api/serverUrl";
import fetchData from "../api/fetchData";
import { useDispatch } from "react-redux";
import useSnackbar from "./useSnackbar";
import useCookies from "./useCookies";

const useFetch = () => {
    const snackbar = useSnackbar();
    const dispatch = useDispatch();
    const cookies = useCookies();
    return ({ url, setLoading, method, failedMsg, doneMsg, errors, done, failed, file, body, ...other }) => {
        const response = res => {
            setLoading && dispatch({
                type: "AJAX_LOADING",
                payload: false,
            });
            res.accessToken && cookies.set("accessToken", res.accessToken, true);
            switch (res.type) {
                case "failed":
                    if (method === "GET" && setLoading) {
                        dispatch({
                            type: "LOAD_ERROR",
                            payload: failedMsg,
                        });
                    }
                    failed && failed(failedMsg);
                    failedMsg && snackbar.error("There was an error " + failedMsg);
                    break;
                case "errors":
                    errors && errors(res.data);
                    break;
                default:
                    dispatch({
                        type: "CLOSE_CONFIRM_DIALOG",
                    });
                    doneMsg && snackbar.info(doneMsg);
                    done && done(res.data);
            }
        }
        setLoading && dispatch({
            type: "AJAX_LOADING",
            payload: true,
        });
        const obj = {
            url,
            method,
            serverUrl,
            body,
            accessToken: cookies.get("accessToken"),
            refreshToken: cookies.get("refresh"),
            ...other,
        }
        if (file) {
            fetchData({
                file: true,
                ...obj
            }, response);
        } else {
            const worker = new Request();
            worker.postMessage(obj);
            worker.onmessage = ({ data: res }) => response(res);
        }
    }
}

export default () => {
    const f = useFetch();
    return {
        get(url: string, obj) {
            f({ url, method: "GET", ...obj });
        },
        post(url, obj) {
            f({ url, method: "POST", ...obj });
        },
        put(url, obj) {
            f({ url, method: "PUT", ...obj });
        },
        delete(url, obj) {
            f({ url, method: "DELETE", ...obj });
        }
    };
}