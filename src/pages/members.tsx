import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField, Tooltip } from "@material-ui/core";
import { mdiAccountRemove, mdiFormatQuoteClose } from "@mdi/js";
//import { ObjectId } from "mongodb";
import Link from "next/link";
import { memo, useState } from "react";
import Icon from "../components/Icon";
import useConfirm from "../hooks/useConfirm";
import useIsAdmin from "../hooks/useIsAdmin";
import useMembers from "../hooks/useMembers";
import useRedirect from "../hooks/useRedirect";
import { useDelete } from "../hooks/useRequest";
import { IMember } from "../types/member";

const DialogInfo = memo(({ member }: any) => {
    return (
        <>
            <DialogTitle id="quote-title">{member?.name + "'s"} Quote</DialogTitle>
            <DialogContent>
                <DialogContentText id="quote">
                    {member?.quote}
                </DialogContentText>
            </DialogContent>
        </>
    );
}, (prev, next) => next?.member === null || prev?.member?._id === next?.member?._id);
const QuoteDialog = ({ member, close }: { member: IMember, close: () => void }) => {
    return (
        <Dialog
            open={member !== null}
            onClose={close}
            aria-labelledby="quote-title"
            aria-describedby="quote"
        >
            <DialogInfo member={member} />
            <DialogActions>
                <Link href={"/bio/" + member?._id}>
                    <Button color="primary">
                        View Bio
                    </Button>
                </Link>
                <Button onClick={close} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default function Members() {
    const members = useMembers();
    const [del, loading] = useDelete();
    const isAdmin = useIsAdmin();
    const [ConfirmDialog, confirm] = useConfirm(loading);
    const [val, setVal] = useState("");
    const [activeMember, setActiveMember] = useState(null);
    const removeMember = (m: IMember) => {

    };
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : (
        <div>
            <TextField
                value={val}
                onChange={e => setVal(e.target.value)}
                label="Search Members"
                variant="filled"
                fullWidth
            />
            <List dense={false}>
                {members.filter(m => m.name.toLowerCase().includes(val.toLowerCase())).map((m, i) => (
                    <Link href={"/bio/" + m._id} key={i}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar src={m.pic} />
                            </ListItemAvatar>
                            <ListItemText primary={m.name} />
                            <ListItemSecondaryAction>
                                <Tooltip title="Quote">
                                    <IconButton edge="end" aria-label="quote" onClick={() => setActiveMember(m)}>
                                        <Icon path={mdiFormatQuoteClose} />
                                    </IconButton>
                                </Tooltip>
                                {isAdmin && (
                                    <Tooltip title="Remove User">
                                        <IconButton edge="end" aria-label="quote" onClick={() => confirm("remove " + m.name + " from this group?", () => removeMember(m))}>
                                            <Icon path={mdiAccountRemove} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <QuoteDialog member={activeMember} close={() => setActiveMember(null)} />
            {ConfirmDialog}
        </div>
    );
}