/* eslint-disable react-hooks/exhaustive-deps */
//Imports
import React, { FormEvent, useState } from "react";
//import { Link } from "react-router-dom";
//import redirect from "../../api/redirect";
//import { useDispatch } from "react-redux";
import { usePost }/*, { usePost }*/ from "../hooks/useRequest";
//import { useHistory } from "react-router-dom";
//import serverUrl from "../../api/serverUrl";
//import socket from "../../api/socket";
import Cookies from "js-cookie";
import {
    Typography,
    Divider,
    IconButton,
    Button,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    TextField,
    Box,
    Card,
    Tooltip,
} from "@material-ui/core";
import Icon from "../components/Icon";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import Link from "next/link";
import effects from "../css/effects.module.css";
import { useTheme } from "../context/Theme";
import LoadBtn from "../components/LoadBtn";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { mutate } from "swr";
//import AjaxBtn from "../../components/AjaxBtn";
//import { setCookie } from "../../api/cookies";
//import useSocket from "../../hooks/useSocket";

const initialState = {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
};
export default function Login() {
    const
        isLoggedIn = useAuthRedirect(),
        router = useRouter(),
        [post, loading] = usePost(),
        //request = useRequest(),
        [, setTheme] = useTheme(),
        [show, setShow] = useState(false),
        [staySigned, setStaySigned] = useState(true),
        [state, setState] = useState(initialState),
        dispatch = useDispatch(),
        //history = useHistory(),
        //socket = useSocket(),
        disabled = state.emailError !== "" || state.passwordError !== "" || state.email === "" || state.password === "",
        handleChange = (name: "email" | "password") => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setState({
                ...state,
                [name]: e.target.value,
                [`${name}Error`]: e.target.value === "" ? "Field required" : "",
            });
        },
        handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            const email = state.email.trim().toLocaleLowerCase();
            if (!disabled) {
                post("/login", {
                    setLoading: true,
                    failedMsg: "logging you in",
                    body: {
                        email,
                        password: state.password,
                        staySignedIn: staySigned,
                    },
                    done(data: any) {
                        console.log(data);
                        setTheme(data.theme);
                        dispatch({
                            type: "UPLOAD_DATA",
                            payload: {
                                userInfo: {
                                    ...data.userInfo,
                                    email,
                                },
                                ...data,
                            },
                        });
                        sessionStorage.setItem("visited", "1");
                        Cookies.set("refreshToken", data.refreshToken, {sameSite: "strict", secure: true, ...(staySigned ? { expires: 1000000 } : {})});
                        Cookies.set("accessToken", data.accessToken, { sameSite: "strict",  secure: true, expires: 1000000 });
                        mutate("/api/login", true, false);
                        const q = router.query.to as string;
                        router.replace(q && q[0] === "/" ? q : "/");
                        //socket.connect(`http://${serverUrl.split(":5000")[0]}`);
                    },
                    errors: data => setState({
                        ...state,
                        ...(data as any).errors,
                    })
                });
            }
        };
    return isLoggedIn ? null : (
        <div>
            <Box maxWidth={600} mx="auto" className={effects.fadeup} component={Card}>
                <Typography variant="h5" gutterBottom>
                    Login to Squool
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box my="8px">
                        <TextField
                            id="email"
                            name="email"
                            required
                            error={state.emailError !== ""}
                            variant="outlined"
                            label="Email"
                            value={state.email}
                            onChange={handleChange("email")}
                            autoComplete="new-email"
                            helperText={state.emailError + " "}
                            fullWidth
                            autoFocus
                        />
                    </Box>
                    <Box my="8px">
                        <TextField
                            name="password"
                            id="password"
                            required
                            error={state.passwordError !== ""}
                            variant="outlined"
                            type={show ? "text" : "password"}
                            label="Password"
                            value={state.password}
                            onChange={handleChange("password")}
                            autoComplete="new-password"
                            helperText={state.passwordError + " "}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Show Password">
                                            <IconButton
                                                aria-label="Toggle password visibility"
                                                onClick={() => setShow(!show)}
                                                onMouseDown={e => e.preventDefault()}
                                            >
                                                {show ? <Icon path={mdiEyeOff} /> : <Icon path={mdiEye} />}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box clone mt="-8px" mb="4px">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={staySigned}
                                    onChange={e => setStaySigned(e.target.checked)}
                                    value="Stay signed in"
                                    color="primary"
                                />
                            }
                            label="Stay signed in"
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <LoadBtn loading={loading} label="Login" disabled={disabled} />
                        <Button
                            onClick={() => setState(initialState)}
                            variant="outlined"
                            color="primary"
                        >
                            clear
                        </Button>
                    </Box>
                </form>
                <Divider style={{ margin: "8px 0" }} />
                <Typography variant="h6" gutterBottom>Don't have an account yet?</Typography>
                <Link href="/signup">
                    <Button
                        color="secondary"
                        component="a"
                    >
                        Sign up now
                    </Button>
                </Link>
            </Box>
        </div>
    );
};