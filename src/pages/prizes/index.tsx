import { Avatar, Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Tooltip, Typography } from "@material-ui/core";
import { mdiCheck, mdiDelete, mdiVote } from "@mdi/js";
import Link from "next/link";
import { useState } from "react";
import { mutate } from "swr";
import Icon from "../../components/Icon";
import LoadBtn from "../../components/LoadBtn";
import Loader from "../../components/Loader";
import VoteDialog from "../../components/VoteDialog";
import useConfirm from "../../hooks/useConfirm";
import usePrizes from "../../hooks/usePrizes";
import useRedirect from "../../hooks/useRedirect";
import { useDelete, usePost, usePut } from "../../hooks/useRequest";
import useUser from "../../hooks/useUser";
import prizeIcons from "../../lib/prizeIcons";
import clsx from "clsx";
import PrizeIcon from "../../components/PrizeIcon";

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    iconOption: {
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.main,
        margin: 2,
        border: 2,
        borderStyle: "solid",
    },
    iconOptionSelected: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        border: 0,
    }
}));

export default function Prizes() {
    const isLoggedIn = useRedirect();
    const [prizes, getLoading] = usePrizes();
    const isAdmin = useUser().admin;
    const [open, setOpen] = useState(false);
    const [currentPrize, setCurrentPrize] = useState(null);
    const [name, setName] = useState("");
    const [err, setErr] = useState("");
    const [post, postLoading] = usePost();
    const [del, delLoading] = useDelete();
    const [put] = usePut();
    const user = useUser();
    const classes = useStyles();
    const [icon, setIcon] = useState("");
    const [ConfirmDialog, confirm, closeConfirm] = useConfirm(delLoading);
    const submitPrize = (e) => {
        e.preventDefault();
        post("/prizes", {
            body: {
                name,
                icon,
            },
            setLoading: true,
            done(data: any) {
                setOpen(false);
                mutate("/api/prizes", [...prizes, data], true);
            },
            errors(data) {
                setErr(data.errors as string);
            }
        });
    }
    const removePrize = (_id: string) => {
        del("/prizes", {
            setLoading: true,
            body: {
                _id,
            },
            done() {
                closeConfirm();
                mutate("/api/prizes", prizes.filter(p => p._id !== _id), true);
            }
        });
    }
    const acceptPrize = (_id: string) => {
        put("/prizes", {
            setLoading: true,
            body: {
                _id,
            },
            done() {
                closeConfirm();
                mutate("/api/prizes", prizes.map(p => p._id === _id ? {...p, accepted: true} : p), true);
            }
        });
    }
    return !isLoggedIn ? null : getLoading ? <Loader /> : (
        <div>
            <Button color="primary" onClick={() => setOpen(true)}>
                {isAdmin ? "Create" : "Suggest"}{" "}Prize
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form onSubmit={submitPrize}>
                    <DialogTitle id="alert-dialog-title">{isAdmin ? "Create" : "Suggest"}{" "}Prize</DialogTitle>
                    <DialogContent>
                        <TextField
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                setErr("");
                            }}
                            label="Prize Name"
                            autoFocus
                            helperText={err + " "}
                            error={err !== ""}
                            fullWidth
                        />
                        <Typography variant="h6">Choose a custom prize icon</Typography>
                        <div className="flex flex_wrap">
                        {Object.keys(prizeIcons).map(i => (
                            <Avatar
                                component={ButtonBase}
                                onClick={() => setIcon(i)}
                                key={i}
                                className={clsx(classes.iconOption, icon === i && classes.iconOptionSelected)}
                            >
                                <Icon path={prizeIcons[i]} />
                            </Avatar>
                        ))}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>
                            Close
                        </Button>
                        <LoadBtn loading={postLoading} label={isAdmin ? "Create" : "Suggest"} disabled={name === "" || err !== ""} />
                    </DialogActions>
                </form>
            </Dialog>
            <Typography variant="h6">Suggested Prizes</Typography>
            <List>
                {prizes.filter(p => !p.accepted).map(p => (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PrizeIcon path={p.icon} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={p.name} />
                        <ListItemSecondaryAction>
                            {isAdmin && (
                                <>
                                    <Tooltip title="Accept Prize">
                                        <IconButton onClick={() => acceptPrize(p._id)} edge="end" aria-label="accept" style={{marginRight: 4}} color="secondary" >
                                            <Icon path={mdiCheck} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Prize">
                                        <IconButton edge="end" aria-label="remove" onClick={() => confirm("remove the prize '" + p.name + "' from this group?", () => removePrize(p._id))}>
                                            <Icon path={mdiDelete} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Typography variant="h6">Current Prizes</Typography>
            <List>
                {prizes.filter(p => p.accepted).map(p => (
                    <Link href={"/prizes/" + p._id} key={p._id}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <PrizeIcon path={p.icon} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={p.name} />
                            <ListItemSecondaryAction>
                                <Tooltip title="Vote">
                                    <IconButton edge="end" aria-label="vote" onClick={() => setCurrentPrize(p._id)} disabled={p.poll.some(v => v.user_id === user._id)} color="secondary">
                                        <Icon path={mdiVote} />
                                    </IconButton>
                                </Tooltip>
                                {isAdmin && (
                                    <Tooltip title="Remove Prize">
                                        <IconButton edge="end" aria-label="remove" onClick={() => confirm("remove the prize '" + p.name + "' from this group?", () => removePrize(p._id))} style={{marginLeft: 16}}>
                                            <Icon path={mdiDelete} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Link>
                ))}
            </List>
            {ConfirmDialog}
            <VoteDialog _id={currentPrize} open={currentPrize !== null} close={() => setCurrentPrize(null)} />
        </div>
    );
}