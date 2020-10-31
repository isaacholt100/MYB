import React, { memo } from "react";
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Button } from "@material-ui/core";
import LoadBtn from "./LoadBtn";

const Content = memo(({ msg }: { msg: string }) => (
    <DialogContent>
        <DialogContentText id="confirm-description">
            Are you sure you want to {msg}
        </DialogContentText>
    </DialogContent>
), (prev, next) => prev.msg === next.msg || next.msg === "");

export default function ConfirmDialog({ loading, msg, fn, close }: { loading: boolean, msg: string, fn: () => void, close: () => void }) {
    return (
        <Dialog
            open={msg !== ""}
            onClose={close}
            aria-labelledby="confirm-action"
            aria-describedby="confirm-description"
        >
            <DialogTitle id="confirm-action">Confirm Action</DialogTitle>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    !loading && fn();
                }}
            >
                <Content msg={msg} />
                <DialogActions>
                    <Button onClick={close} color="default" disabled={loading}>
                        Cancel
                    </Button>
                    <LoadBtn loading={loading} label="Confirm" autoFocus disabled={false} />
                </DialogActions>
            </form>
        </Dialog>
    );
}