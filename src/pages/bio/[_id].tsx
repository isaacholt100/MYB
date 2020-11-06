import { useRouter } from "next/router";
import { IMember } from "../../types/member";
import Image from "next/image";
import { Button, Typography } from "@material-ui/core";
import useRedirect from "../../hooks/useRedirect";
import useUser from "../../hooks/useUser";
import Link from "next/link";
import useSWR from "swr";
import useMembers from "../../hooks/useMembers";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";

export default function Bio() {
    const router = useRouter();
    const { _id } = router.query;
    const members = useMembers();
    const member = members.find(m => m._id === _id);
    const user = useUser();
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : !member ? members.length > 0 ? (
        <AlertError
            msg="User not found"
            btn={(
                <Button onClick={router.back}>
                    Back
                </Button>
            )}
        />
    ) : (
        <Loader />
    ) : (
        <div>
            <div className={"flex flex_wrap"}>
                <Image src={"/" + member.pic} height={128} width={128} />
                <Typography variant="h4" className={"ml_8"}>{member.name}</Typography>
            </div>
            <div className={"mt_8"}>
                <Typography>
                    {member.quote}
                </Typography>
            </div>
            {user._id === _id && (
                <Link href="/settings">
                    <Button>
                        Edit Profile
                    </Button>
                </Link>
            )}
        </div>
    );
}