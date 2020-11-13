import {  Avatar, Box, Button, List, makeStyles, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";
import usePrizes, { IPoll } from "../../hooks/usePrizes";
import useRedirect from "../../hooks/useRedirect";
import useUser from "../../hooks/useUser";
import { groupBy, sortBy } from "lodash";
import VoteDialog from "../../components/VoteDialog";
import { useState } from "react";
import Link from "next/link";
import useMembers from "../../hooks/useMembers";
import MemberItem from "../../components/MemberItem";
import QuoteDialog from "../../components/QuoteDialog";
import PrizeIcon from "../../components/PrizeIcon";
import useGroup from "../../hooks/useGroup";

const getTopThree = (polls: IPoll[]) => {
    if (!polls || polls.length === 0) {
        return [];
    }
    const list = [].concat(...polls.map(p => p.votes)) as string[];
    const groups = groupBy(list);
    const sorted = sortBy(groups, a => -a.length);
    return sorted.slice(0, 3).map(x => x[0]);
}
const COLORS = ["gold", "silver", "#cd7f32"];
const TEXT = ["#000", "#000", "#fff"];

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: 64,
        width: 64,
        marginRight: 8,
        fontSize: 32,
    },
}));

export default function Prize() {
    const router = useRouter();
    const { _id } = router.query as { _id: string };
    const [prizes, prizesLoading] = usePrizes();
    const prize = prizes.find(p => p._id === _id);
    const user = useUser();
    const isLoggedIn = useRedirect();
    const [open, setOpen] = useState(false);
    const topThree = getTopThree(prize?.poll);
    const [activeMember, setActiveMember] = useState(null);
    const [members, membersLoading] = useMembers();
    const classes = useStyles();
    const group = useGroup();
    return !isLoggedIn ? null : !prize ? !prizesLoading && !membersLoading ? (
        <AlertError
            msg="Prize not found"
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
            <div className={"flex flex_wrap align_items_center mb_8"}>
                <Avatar className={classes.avatar}>
                    <PrizeIcon path={prize.icon} />
                </Avatar>
                <Typography variant="h4">{prize.name}</Typography>
            </div>
            {prize.poll.every(v => v.user_id !== user._id) ? (
                <Button color="primary" onClick={() => setOpen(true)} className={"mr_8"} disabled={!group.can_vote}>Vote</Button>
            ) : (
                <Typography>You've already voted for this prize</Typography>
            )}
            <Link href="/prizes">
                <Button color="secondary">Go to Prizes</Button>
            </Link>
            <Typography variant="h6">Votes so far: {prize.poll.length} (waiting for {members.length - prize.poll.length} to vote)</Typography>
            <VoteDialog open={open} close={() => setOpen(false)} _id={_id} />
            <Typography variant="h6" gutterBottom>Leaderboard</Typography>
            {[0, 1, 2].map(pos => {
                const m = topThree[pos] && members.find(m => m._id === topThree[pos]);
                return (
                    <List className="flex align_items_center" key={pos}>
                        <Box height={64} width={64} bgcolor={COLORS[pos]} borderRadius={"50%"} color={TEXT[pos]} className="flex align_items_center justify_content_center mr_8" fontSize={32}>{pos + 1}</Box>
                        <Box flex={1}>
                            {topThree[pos] && m && (
                                <MemberItem m={m} setActiveMember={setActiveMember} />
                            )}
                        </Box>
                    </List>
                );
            })}
            <QuoteDialog member={activeMember} close={() => setActiveMember(null)} />
        </div>
    )
}