import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Link from "next/link";
import { memo } from "react";
import { IMember } from "../types/member";
import Quote from "./Quote";

const DialogInfo = memo(({ member }: any) => {
    return (
        <>
            <DialogTitle id="quote-title">{member?.name + "'s"} Quote</DialogTitle>
            <DialogContent>
                <Quote quote={member?.quote} />
            </DialogContent>
        </>
    );
}, (prev, next) => next?.member === null || prev?.member?._id === next?.member?._id);
export default function QuoteDialog({ member, close }: { member: IMember, close: () => void }) {
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