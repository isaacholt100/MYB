import fetchData from "../lib/fetchData";
import useSnackbar from "./useSnackbar";
import { IFetchOptions, IRes } from "../types/fetch";
import { useState } from "react";
import Cookies from "js-cookie";
import useLogout from "./useLogout";
type Handler = (data: object | string) => void;
interface IOptions extends IFetchOptions {
    setLoading?: boolean;
    failedMsg?: string;
    doneMsg?: string;
    errors?: (data: IErrors) => void;
    done?: Handler;
    failed?: Handler;
    fetchOptions?: RequestInit;
}
interface IErrors {
    errors: string | { [key: string]: string };
}
function useFetch(): [({ url, setLoading: load, method, failedMsg, doneMsg, errors, done, failed, file, body, ...other }: IOptions) => void, boolean] {
    const
        snackbar = useSnackbar(),
        [loading, setLoading] = useState(false),
        logout = useLogout();
    const fetcher = ({ url, setLoading: load, method, failedMsg, doneMsg, errors, done, failed, file, body, ...other }: IOptions) => {
        const response = (res: IRes) => {
            load && setLoading(false);
            res.accessToken && Cookies.set("accessToken", res.accessToken, {sameSite: "strict", ...(true ? { expires: 100 } : {expires: 100})});
            switch (res.type) {
                case "noauth":
                    done(res.data);
                    logout();
                    break;
                case "failed":
                    failed && failed(failedMsg);
                    failedMsg && snackbar.error("There was an error " + failedMsg);
                    break;
                case "errors":
                    errors && errors(res.data as IErrors);
                    break;
                default:
                    doneMsg && snackbar.info(doneMsg);
                    done && done(res.data);
            }
        }
        load && setLoading(true);
        const obj = {
            url,
            method,
            serverUrl: "/api",
            body,
            accessToken: Cookies.get("accessToken"),
            refreshToken: Cookies.get("refreshToken"),
            ...other,
        }
        if (file) {
            fetchData({
                file: true,
                ...obj
            }, response);
        } else {
            const worker = new Worker(new URL("../workers/request", import.meta.url), { type: "module", name: "request" });
            worker.postMessage(obj);
            worker.addEventListener("message", ({ data: res }) => {
                response(res);
                worker.terminate();
            });
        }
    }
    return [fetcher, loading];
}
type PublicOptions = Omit<IOptions, "url" | "method">;
type FetchHook = [(url: string, options: PublicOptions) => void, boolean];
export function useGet(): FetchHook {
    const [f, loading] = useFetch();
    const fn = (url: string, options: PublicOptions) => {
        f({ url, method: "GET", ...options });
    }
    return [fn, loading];
}
export function usePost(): FetchHook {
    const [f, loading] = useFetch();
    const fn = (url: string, options: PublicOptions) => {
        f({ url, method: "POST", ...options });
    }
    return [fn, loading];
}
export function usePut(): FetchHook {
    const [f, loading] = useFetch();
    const fn = (url: string, options: PublicOptions) => {
        f({ url, method: "PUT", ...options });
    }
    return [fn, loading];
}
export function useDelete(): FetchHook {
    const [f, loading] = useFetch();
    const fn = (url: string, options: PublicOptions) => {
        f({ url, method: "DELETE", ...options });
    }
    return [fn, loading];
}
export default function useRequest() {
    const [f] = useFetch();
    return {
        get(url: string, options: PublicOptions) {
            f({ url, method: "GET", ...options });
        },
        post(url: string, options: PublicOptions) {
            f({ url, method: "POST", ...options });
        },
        put(url: string, options: PublicOptions) {
            f({ url, method: "PUT", ...options });
        },
        delete(url: string, options: PublicOptions) {
            f({ url, method: "DELETE", ...options });
        }
    };
}