import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Tooltip } from "@material-ui/core";
import { mdiFormatQuoteClose } from "@mdi/js";
import Link from "next/link";
import { IMember } from "../types/member";
import Icon from "./Icon";
import ProfileImg from "./ProfileImg";

export default function MemberItem({ m, setActiveMember, btn }: {m: IMember, setActiveMember: (m: IMember) => void, btn?: JSX.Element }) {
    return (
        <Link href={"/bio/" + m._id} key={m._id}>
            <ListItem button>
                <ListItemAvatar>
                    <Avatar>
                        <ProfileImg alt="" src={m.pic || "/images/default_user.png"} height={40} width={40} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={m.name} />
                <ListItemSecondaryAction>
                    <Tooltip title="Quote">
                        <IconButton edge="end" aria-label="quote" onClick={() => setActiveMember(m)} color="secondary">
                            <Icon path={mdiFormatQuoteClose} />
                        </IconButton>
                    </Tooltip>
                    {btn || null}
                </ListItemSecondaryAction>
            </ListItem>
        </Link>
    );
}