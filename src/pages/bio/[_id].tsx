import { useRouter } from "next/router";
import { IMember } from "../../types/member";
import Image from "next/image";
import { Button, Typography } from "@material-ui/core";
import useRedirect from "../../hooks/useRedirect";
import useUser from "../../hooks/useUser";
import Link from "next/link";

const SAMPLE_MEMBER: IMember = {
    name: "Isaac",
    _id: "new ObjectId()",
    pic: "jjfjsk",
    quote: "Hello",
}

export default function Bio() {
    const router = useRouter();
    const { _id } = router.query;
    const member = SAMPLE_MEMBER;
    const user = useUser();
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : (
        <div>
            {user._id === _id && (
                <Link href="/settings">
                    <Button>
                        Edit Profile
                    </Button>
                </Link>
            )}
            <div className={"flex flex_wrap"}>
                <Image src={"/" + member.pic} height={128} width={128} />
                <Typography variant="h4" className={"ml_8"}>{member.name}</Typography>
            </div>
            <div className={"mt_8"}>
                <Typography>
                    {member.quote}
                </Typography>
            </div>
        </div>
    );
}