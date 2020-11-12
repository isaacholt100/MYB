import { Button, Typography } from "@material-ui/core"
import Link from "next/link";

export default function LandingPage() {
    return (
        <div>
                <Typography variant="h3" gutterBottom>Landing Page</Typography>
                <Link href="/signup">
                    <Button color="primary" component="a">
                        Sign up
                    </Button>
                </Link>
                <Link href="/login">
                    <Button variant="outlined" color="primary" component="a">
                        Login
                    </Button>
                </Link>
        </div>
    );
}