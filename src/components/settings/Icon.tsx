import React, { memo, useState } from "react";
import useRequest, { usePut } from "../../hooks/useRequest";
import { useSelector } from "react-redux";
//import { dispatchEmit } from "../../api/socketDispatch";
import { Typography, Box, Avatar, Button, Dialog, DialogTitle, DialogContent, ButtonBase, DialogActions } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import { mdiAccount } from "@mdi/js";
import profileIcons from "../../json/profileIcons";
import LoadBtn from "../LoadBtn";
import Icon from "../Icon";

export default memo(() => {
    const
        [put, loading] = usePut(),
        icon = "infinity",//useSelector(s => s.userInfo.icon),
        [enlarged, setEnlarged] = useState(icon),
        [open, setOpen] = useState(false),
        change = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            !loading && put("/user/icon", {
                setLoading: true,
                failedMsg: "updating your profile pic",
                body: { icon: enlarged },
                done: () => {
                    setOpen(false);
                    /*dispatchEmit("/user/info/update", {
                        icon: enlarged,
                    });*/
                },
            });
        };
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Profile Icon
            </Typography>
            <Box display="flex" alignItems="center">
                <Box clone bgcolor="primary.main" color="primary.contrastText" height={64} width={64} mr={1}>
                    <Avatar>
                        <Icon path={profileIcons[icon] || mdiAccount} size="48px" />
                    </Avatar>
                </Box>
                <Button
                    color="secondary"
                    onClick={() => setOpen(true)}
                >
                    Change
                </Button>
            </Box>
            <MarginDivider />
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="pic-dialog-title"
                maxWidth="md"
            >
                <form onSubmit={change}>
                    <DialogTitle>Profile Icon</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexWrap="wrap">
                            {Object.keys(profileIcons).map(p => (
                                <Box clone borderRadius="50%" bgcolor={enlarged === p ? "secondary.main" : "background.paper"} color={enlarged === p ? "secondary.contrastText" : "secondary.main"} m="2px" border={enlarged === p ? 0 : 2} borderColor="secondary.main" onClick={() => setEnlarged(p)} key={p}>
                                    <Avatar component={ButtonBase}>
                                        <Icon path={profileIcons[p]} />
                                    </Avatar>
                                </Box>
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                        <LoadBtn
                            label="Update"
                            disabled={false}
                            loading={loading}
                        />
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
});