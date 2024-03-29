import { Avatar, Button, Chip, Divider, Typography } from "@material-ui/core";
import useUser from "../hooks/useUser";
import CopyToClipboard from "react-copy-to-clipboard";
import useGroup from "../hooks/useGroup";
import usePrizes from "../hooks/usePrizes";
import Link from "next/link";
import useMembers from "../hooks/useMembers";
import Loader from "./Loader";
import PrizeIcon from "./PrizeIcon";
import ProfileImg from "./ProfileImg";
import Yearbook from "./Yearbook";

export default function Dashboard() {
    const user = useUser();
    const [group, groupLoading] = useGroup();
    const [prizes, prizesLoading] = usePrizes();
    const [members, membersLoading] = useMembers();
    const unvoted = prizes.filter(p => p.accepted && p.poll.every(v => v.user_id !== user._id));
    const totalUnvoted = prizes.filter(p => p.accepted &&  p.poll.length < members.length);
    const membersNotVoted = members.filter(m => prizes.some(p => p.accepted && p.poll.every(v => v.user_id !== m._id)));
    return prizesLoading || membersLoading || groupLoading ? <Loader /> : (
        <div>
            <div className={"flex flex_wrap align_items_center mb_8"}>
                <ProfileImg alt="" src={group.pic || "/images/default_group.png"} height={128} width={128} className={"br_50"} key={group.pic} priority />
                <Typography variant="h4" component="div" style={{flex: 1, minWidth: 200, }} className="ml_16">
                    {group.name}
                </Typography>
            </div>
            <Typography>
                Invite people from your year to join:{" "}
                <Typography color="secondary" component="span">
                    {process.browser && (window.location.origin + "/signup?id=" + user.group_id)}
                </Typography>
            </Typography>
            <CopyToClipboard text={process.browser && (window.location.origin + "/signup?id=" + user.group_id)}>
                <Button color="secondary">
                    Copy Link
                </Button>
            </CopyToClipboard>
            <Divider className={"my_16"} />
            <Yearbook unvoted={totalUnvoted.length} />
            <Divider className={"my_16"} />
            {group.can_vote ? (
                <>
                    <Typography gutterBottom>
                        You currently have {unvoted.length} prize{unvoted.length === 1 ? "" : "s"} you haven't voted for yet{unvoted.length === 0 ? "." : ":"}
                    </Typography>
                    <div className="mb_8">
                        {unvoted.map(u => (
                            <Chip avatar={<Avatar><PrizeIcon path={u.icon} /></Avatar>} variant="outlined" color="primary" label={u.name} key={u._id} style={{marginRight: 4}} />
                        ))}
                    </div>
                    <Typography gutterBottom>There {totalUnvoted.length === 1 ? "is" : "are"} {totalUnvoted.length} prize{totalUnvoted.length === 1 ? "" : "s"} which haven't been voted for by everyone in your group yet.</Typography>
                    <Typography gutterBottom>There {membersNotVoted.length === 1 ? "is" : "are"} {membersNotVoted.length} member{membersNotVoted.length === 1 ? "" : "s"} who still have prizes to vote for. Get them to vote!</Typography>
                    <Link href="/prizes">
                        <Button color="secondary">Go To Prizes</Button>
                    </Link>
                </>
            ) : (
                <Typography>Voting is currently disabled for your group</Typography>
            )}
        </div>
    );
}