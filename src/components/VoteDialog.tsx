import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";
import { mutate } from "swr";
import useMembers from "../hooks/useMembers";
import usePrizes from "../hooks/usePrizes";
import { usePost } from "../hooks/useRequest";
import useUser from "../hooks/useUser";
import { IMember } from "../types/member";
import LoadBtn from "./LoadBtn";

interface IProps {
    open: boolean;
    close(): void;
    _id: string;
}

export default function VoteDialog(props: IProps) {
    const [prizes] = usePrizes();
    const [votes, setVotes] = useState<IMember[]>([]);
    const _id = useUser()._id;
    const [members] = useMembers();
    const [post, loading] = usePost();
    const vote = (e) => {
        e.preventDefault();
        if (!loading) {
            post("/prizes/vote", {
                setLoading: true,
                doneMsg: "Votes submitted!",
                failedMsg: "submitting your votes",
                body: {
                    _id: props._id,
                    votes: votes.map(v => v._id),
                },
                done(data: any) {
                    mutate("/api/prizes", prizes.map(p => p._id === props._id ? {...p, poll: [...p.poll, data]} : p), true);
                    props.close();
                    setVotes([]);
                }
            });
        }
    }
    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            aria-labelledby="vote-for-prize"
        >
            <form onSubmit={vote}>
                <DialogTitle id="vote-for-prize">
                    Vote for Prize
                </DialogTitle>
                <DialogContent>
                    <DialogContentText gutterBottom>
                        You can't change your votes once you've voted, so choose carefully! You must vote for 3 people.
                    </DialogContentText>
                    <Autocomplete
                        multiple
                        value={votes}
                        onChange={(e, newVal) => setVotes(newVal as any)}
                        options={members.filter(m => m._id !== _id)}
                        id="members-list"
                        disableCloseOnSelect
                        getOptionLabel={m => m.name}
                        renderOption={(option, { selected }) => (
                            <>
                                <Checkbox
                                    size="small"
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.name}
                            </>
                        )}
                        fullWidth
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Choose Members" />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.close}>
                        Close
                    </Button>
                    <LoadBtn loading={loading} label="Vote" disabled={votes.length !== 3} />
                </DialogActions>
            </form>
        </Dialog>
    );
}