import React, { memo, useState, useRef, useEffect } from "react";
import useRequest, { useDelete } from "../../hooks/useRequest";
import useConfirm from "../../hooks/useConfirm";
import { useDispatch } from "react-redux";
//import socket from "../../api/socket";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, makeStyles } from "@material-ui/core";
import useCookies from "../../hooks/useCookies";
import LoadBtn from "../LoadBtn";
import Cookies from "js-cookie";
import { useTheme } from "../../context/Theme";
import { mutate } from "swr";

const useStyles = makeStyles(({ palette, breakpoints }) => ({
    highlighted: {
        color: palette.secondary.main,
        fontWeight: 700,
    },
    tab: {
        borderRadius: 0
    },
    tabs: {
        marginBottom: 0,
        borderRadius: "16px 16px 0px 0px",
        boxShadow: "none",
        padding: 0,
    },
    txt: {
        color: palette.text.primary,
    },
    expansionPanel: {
        border: `2px solid ${palette.divider}`,
        borderRadius: 16,
        marginBottom: 8,
        "&::before": {
            display: "none",
        },
    },
    deleteAccount: {
        backgroundColor: palette.error.main,
        color: palette.error.contrastText,
        "&:hover": {
            backgroundColor: palette.error.dark,
        },
        marginLeft: "auto",
    },
}));

export default memo(() => {
    const
        request = useRequest(),
        [del, loading] = useDelete(),
        cookies = useCookies(),
        confirm = useConfirm(),
        [passwordState, setPasswordState] = useState({
            confirmPassword: "",
            confirmPasswordError: "",
        }),
        [state, setState] = useState({
            deleteDialogOpen: false,
            deleteDisabled: true,
        }),
        classes = useStyles(),
        timer = useRef<NodeJS.Timeout>(),
        [, setTheme] = useTheme(),
        logout = () => {
            del("/login", {
                setLoading: true,
                done: () => {
                    Cookies.remove("refreshToken");
                    Cookies.remove("accessToken");
                    localStorage.clear();
                    setTheme(null);
                    mutate("/api/login", false, false);
                    //router.push("/");
                }
            });
        },
        openDeleteDialog = () => {
            setState({
                ...state,
                deleteDialogOpen: true,
                deleteDisabled: true,
            });
            setPasswordState({
                ...passwordState,
                confirmPassword: "",
                confirmPasswordError: "",
            });
            timer.current = setTimeout(() => {
                setState({
                    ...state,
                    deleteDisabled: false,
                    deleteDialogOpen: true,
                });
            }, 1);
        },
        closeDeleteDialog = () => {
            setState({
                ...state,
                deleteDialogOpen: false,
                deleteDisabled: true,
            });
            setPasswordState({
                confirmPassword: "",
                confirmPasswordError: "",
            });
            clearTimeout(timer.current);
        },
        deleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!state.deleteDisabled && passwordState.confirmPassword !== "") {
                request.delete("/user", {
                    setLoading: true,
                    failedMsg: "deleting your account",
                    body: { password: passwordState.confirmPassword },
                    done: logout,
                    errors: data => setPasswordState({
                        ...passwordState,
                        confirmPasswordError: data.errors as string,
                    })
                });
            }
        };
    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);
    return (
        <>
            <div className={"flex"}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => confirm("logout?", logout)}
                >
                    Log out
                </Button>
                <Button
                    variant="contained"
                    className={classes.deleteAccount}
                    onClick={openDeleteDialog}
                >
                    Delete Account
                </Button>
            </div>
            <Dialog
                open={state.deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure you want to delete your account? You'll lose it forever!</DialogTitle>
                <form onSubmit={deleteAccount}>
                    <DialogContent>
                        <DialogContentText>
                            To prevent accidentally deleting your account and to give you time to think whether you really want to, the delete button will be disabled for 10 seconds. <br />
                            You must enter your password to continue:
                        </DialogContentText>
                        <TextField
                            value={passwordState.confirmPassword}
                            onChange={e => setPasswordState({...passwordState, confirmPassword: e.target.value, confirmPasswordError: ""})}
                            label="Password"
                            variant="outlined"
                            error={passwordState.confirmPasswordError !== ""}
                            helperText={passwordState.confirmPasswordError + " "}
                            fullWidth
                            type="password"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteDialog} color="default" autoFocus disabled={loading}>
                            cancel
                        </Button>
                        <LoadBtn
                            label="Delete Account"
                            disabled={state.deleteDisabled || passwordState.confirmPassword === "" || passwordState.confirmPasswordError !== ""}
                            className={classes.deleteAccount}
                            loading={loading}
                        />
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
});