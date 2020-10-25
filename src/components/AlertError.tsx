import React, { ReactChild } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import layoutStyles from "../css/layout.module.css";

interface IProps {
    msg: string;
    btn: ReactChild;
}
export function AlertError(props: IProps) {
    return (
        <div>
            <Alert severity="error" className="fadein" variant="filled">
                <AlertTitle>Uh oh!</AlertTitle>
                {props.msg}
                <div className={layoutStyles.mt_8}>
                    <Link href="/">
                        <Button variant="outlined" component="a">
                            Go Home
                        </Button>
                    </Link>
                    {props.btn}
                </div>
            </Alert>
        </div>
    );
}
export default ({ msg }) => {
    const
        dispatch = useDispatch(),
        router = useRouter()/*,
        retry = () => {
            dispatch({
                type: "LOAD_ERROR",
                payload: "",
            });
        }*/;
    return (
        <div>
            <Alert severity="error" className="fadein" variant="filled">
                <AlertTitle>Uh oh!</AlertTitle>
                {msg}
                <div className={layoutStyles.mt_8}>
                    {msg.includes("went wrong") ? (
                        <>
                            <Link href="/">
                                <Button variant="outlined" component="a">
                                    Go Home
                                </Button>
                            </Link>
                            <Link href="/feedback">
                                <Button variant="outlined" component="a">
                                    Send Feedback
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/">
                                <Button variant="outlined" component="a">
                                    Go Home
                                </Button>
                            </Link>
                            {history.length > 2 && (
                                <Button variant="outlined" onClick={router.back} className={layoutStyles.ml_8}>
                                    Go Back
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Alert>
        </div>
    );
}