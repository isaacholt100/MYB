import { Button } from "@material-ui/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { AlertError } from "../components/AlertError"

export default function Page404() {
    const router = useRouter();
    return (
        <AlertError
            msg="404 - Page Not Found"
            btn={(
                <Button onClick={router.back}>
                    Back
                </Button>
            )}
        />
    );
}