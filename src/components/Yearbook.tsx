import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@material-ui/core";
import Loader from "./Loader";
import useGroup from "../hooks/useGroup";
import useRedirect from "../hooks/useRedirect";
import download from "downloadjs";
import useUser from "../hooks/useUser";
import { memo, useState } from "react";
import { usePost } from "../hooks/useRequest";
import LoadBtn from "./LoadBtn";
import { Panel as ColorPickerPanel } from "material-ui-rc-color-picker";
import MarginDivider from "./MarginDivider";
import Color from "color";
import { mutate } from "swr";
import useSnackbar from "../hooks/useSnackbar";
import useMembers from "../hooks/useMembers";
import usePrizes from "../hooks/usePrizes";

const ContentText = memo((props: any) => (
    <DialogContentText gutterBottom>{props.createOpen ? "Note: if you have already generated a yearbook, doing this again will overwrite the current one." : "You're creating a private yearbook which won't be saved, so it will be downloaded instantly when created."}{" "}Generating a yearbook can take some time, so please be patient!</DialogContentText>
), (prev: any, next: any) => next.createOpen === prev.createOpen || next.createOpen === null);

export default function Yearbook() {
    const [group, groupLoading] = useGroup();
    const [createOpen, setCreateOpen] = useState(false);
    const [color, setColor] = useState("#000000");
    const [cover, setCover] = useState<File>(null);
    const [name, setName] = useState(group.name);
    const snackbar = useSnackbar();
    const [downloading, setDownloading] = useState(false);
    const [bytes, setBytes] = useState<ArrayBuffer>(null);
    const [members, membersLoading] = useMembers();
    const [prizes, prizesLoading] = usePrizes();
    const user = useUser();
    const downloadPDF = e => {
        e.preventDefault();
        if (bytes) {
            download(bytes, "yearbook.pdf", "application/pdf");
        } else {
            setDownloading(true);
            fetch(group.pdf).then(res => res.arrayBuffer()).then(data => {
                setDownloading(false);
                setBytes(data);
                download(data, "yearbook.pdf", "application/pdf");
            });
        }
    }
    const [post] = usePost();
    const [pdfLoading, setPdfLoading] = useState(false);
    const generate = async e => {
        e.preventDefault();
        if (!pdfLoading && !disabled && !membersLoading && !prizesLoading) {
            setPdfLoading(true);
            const rgb = Color(color).rgb().array();
            const worker = new Worker("../workers/createPDF", { type: "module" });
            worker.postMessage({
                coverImage: new Uint8Array(await cover.arrayBuffer()),
                groupName: name,
                groupColour: rgb.map(c => c / 255),
                coverPng: cover.type.includes("png"),
                groupImage: group.pic,
                members,
                prizes: prizes.filter(p => p.poll.length > 0),
            });
            const pdf: Uint8Array = await new Promise((res, rej) => {
                worker.addEventListener("message", ({ data }) => {
                    res(data);
                    worker.terminate();
                });
            });
            if (pdf === null) {
                snackbar.error("There was an error creating your yearbook PDF");
                setPdfLoading(false);
            } else {
                if (createOpen === null) {
                    download(pdf, "yearbook.pdf", "application/pdf");
                    setPdfLoading(false);
                    setCreateOpen(false);
                    snackbar.info("Private yearbook downloading");
                } else {
                const form = new FormData();
                form.append("pdf", new Blob([pdf]));
                post("/pdf", {
                    doneMsg: "Yearbook PDF created",
                    done(data: any) {
                        setBytes(pdf);
                        setCreateOpen(false);
                        setPdfLoading(false);
                        mutate("/api/group", {
                            ...group,
                            pdf: data.name,
                        }, true);
                    },
                    failed() {
                        setPdfLoading(false);
                    },
                    failedMsg: "creating your yearbook",
                    setLoading: true,
                    file: true,
                    body: form,
                });
            }
            }
        }
    }
    const isLoggedIn = useRedirect();
    const disabled = !cover || cover.size < 500000 || cover.size > 10000000 || name === "" || (cover.type !== "image/jpeg" && cover.type !== "image/jpg" && cover.type !== "image/png");
    return !isLoggedIn ? null : groupLoading ? <Loader /> : (
        <div>
            {group.pdf === "" ? (
                <Typography>A yearbook PDF for your group hasn't been created yet</Typography>
            ) : (
                <form onSubmit={downloadPDF}>
                    <LoadBtn label="Download Yearbook" color="secondary" /*component="a" href={group.pdf} target="_blank"*/ disabled={false} loading={downloading} />
                </form>
            )}
            <MarginDivider />
            {user.admin && (
                <Button color="primary" onClick={() => setCreateOpen(true)} className="mr_8">Generate Yearbook</Button>
            )}
            <Button color="primary" onClick={() => setCreateOpen(null)}>Create Private Yearbook</Button>
            <Dialog
                open={createOpen || createOpen === null}
                onClose={() => setCreateOpen(false)}
                aria-labelledby="generate-yearbook"
            >
                <form onSubmit={generate}>
                    <DialogTitle id="generate-yearbook">Generate Yearbook</DialogTitle>
                    <DialogContent>
                        <ContentText createOpen={createOpen} />
                        <TextField
                            value={name}
                            onChange={e => setName(e.target.value)}
                            label="Group Display Name"
                            variant="outlined"
                            fullWidth
                            error={name.length > 32}
                            helperText={name.length > 32 ? "Name too long" : " "}
                        />
                        <Typography gutterBottom>Pick a group colour: (this should be visible on a white background)</Typography>
                        <ColorPickerPanel
                            enableAlpha={false}
                            onChange={c => setColor(c.color)}
                            color={color}
                            style={{height: 32, overflow: "hidden"}}
                        />
                        <Typography gutterBottom>Upload a cover image: (this will work best if the image is portrait and at least 842px x 595px)</Typography>
                        <input
                            accept="image/x-png,image/jpeg,.png,.jpg,.jpeg"
                            className={"display_none"}
                            id="cover-image"
                            type="file"
                            onChange={e => {
                                setCover(e.target.files[0]);
                            }}
                        />
                        <label htmlFor="cover-image">
                            <Button color="secondary" component="span">Upload</Button>
                        </label>
                        <Typography>{cover === null ? "No image selected" : "Current image: " + cover.name}</Typography>
                        {cover?.size < 500000 ? (
                            <Typography color="error">This image is too small to be used</Typography>
                        ) : cover?.size > 10000000 ? (
                            <Typography color="error">This image is too large to be used</Typography>
                        ) : (cover && cover.type !== "image/jpeg" && cover.type !== "image/jpg" && cover.type !== "image/png") && (
                            <Typography color="error">Only PNG and JPG formats are allowed</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateOpen(false)} disabled={pdfLoading}>
                            Cancel
                        </Button>
                        <LoadBtn label="Generate" loading={pdfLoading} disabled={disabled} />
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}