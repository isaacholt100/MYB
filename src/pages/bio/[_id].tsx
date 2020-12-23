import { useRouter } from "next/router";
import { Button, Typography } from "@material-ui/core";
import useRedirect from "../../hooks/useRedirect";
import useUser from "../../hooks/useUser";
import Link from "next/link";
import useMembers from "../../hooks/useMembers";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";
import Quote from "../../components/Quote";
import ProfileImg from "../../components/ProfileImg";

export default function Bio() {
    const router = useRouter();
    const { _id } = router.query;
    const [members] = useMembers();
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
            <div className={"flex flex_wrap align_items_center"}>
                <ProfileImg src={member.pic || "/images/default_user.png"} height={128} width={128} className={"br_50"} />
                <Typography variant="h4" className={"ml_16"}>{member.name}</Typography>
            </div>
            <div className={"mt_8"}>
                <Typography>
                    <Quote quote={member.quote} />
                </Typography>
            </div>
            {user._id === _id && (
                <Link href="/settings">
                    <Button className={"mt_8 mr_8"} color="primary">
                        Edit Profile
                    </Button>
                </Link>
            )}
            <Link href="/members">
                <Button color="secondary" className="mt_8">Go to Members</Button>
            </Link>
        </div>
    );
}