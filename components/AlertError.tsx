import React, { ReactChild } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Box } from "@material-ui/core";
import Link from "next/link";
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
                <Box mt="8px">
                    <Link href="/">
                        <Button variant="outlined" component="a">
                            Go Home
                        </Button>
                    </Link>
                    {props.btn}
                </Box>
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
                <Box mt="8px">
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
                                <Box clone ml="8px">
                                    <Button variant="outlined" onClick={router.back}>
                                        Go Back
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Alert>
        </div>
    );
}