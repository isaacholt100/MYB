import { Button } from "@material-ui/core";
import type { NextApiResponse, NextPageContext } from "next";
import Link from "next/link";
import { AlertError } from "../components/AlertError";

export default function Error({ statusCode }) {
    return (
        <AlertError
            msg={statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}
            btn={(
                <Link href="/feedback">
                    <Button component="a" variant="outlined">
                        Send Feedback
                    </Button>
                </Link>
            )}
        />
    )
};
Error.getInitialProps = ({ res, err }: NextPageContext) => {
    return {
        statusCode: res ? res.statusCode : err ? err.statusCode : 404,
    }
}