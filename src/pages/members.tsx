import { IconButton, List, TextField, Tooltip } from "@material-ui/core";
import { mdiAccountRemove } from "@mdi/js";
//import { ObjectId } from "mongodb";
import { useState } from "react";
import { mutate } from "swr";
import Icon from "../components/Icon";
import Loader from "../components/Loader";
import MemberItem from "../components/MemberItem";
import QuoteDialog from "../components/QuoteDialog";
import useConfirm from "../hooks/useConfirm";
import useMembers from "../hooks/useMembers";
import useRedirect from "../hooks/useRedirect";
import { useDelete } from "../hooks/useRequest";
import useUser from "../hooks/useUser";

export default function Members() {
    const [members, getLoading] = useMembers();
    const [del, loading] = useDelete();
    const isAdmin = useUser().admin;
    const [ConfirmDialog, confirm, closeConfirm] = useConfirm(loading);
    const [val, setVal] = useState("");
    const [activeMember, setActiveMember] = useState(null);
    const removeMember = (_id: string) => {
        del("/members", {
            setLoading: true,
            body: {
                _id,
            },
            done() {
                closeConfirm();
                mutate("/api/members", members.filter(m => m._id !== _id), true);
            }
        });
    };
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : getLoading ? <Loader /> : (
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
                    <MemberItem m={m} setActiveMember={setActiveMember} btn={isAdmin && (
                        <Tooltip title="Remove User">
                            <IconButton style={{marginLeft: 16}} edge="end" aria-label="quote" onClick={() => confirm("remove " + m.name + " from this group?", () => removeMember(m._id))}>
                                <Icon path={mdiAccountRemove} />
                            </IconButton>
                        </Tooltip>
                    )} />
                ))}
            </List>
            <QuoteDialog member={activeMember} close={() => setActiveMember(null)} />
            {ConfirmDialog}
        </div>
    );
}