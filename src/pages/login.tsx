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
import LoadBtn from "../components/LoadBtn";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { mutate } from "swr";
import jwtCookies from "../lib/jwtCookies";
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
        [show, setShow] = useState(false),
        [staySignedIn, setStaySignedIn] = useState(true),
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
                        staySignedIn,
                    },
                    done(data: any) {
                        jwtCookies({
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                            staySignedIn,
                            user_id: data._id,
                        });
                        const q = router.query.to as string;
                        router.replace(q && q[0] === "/" ? q : "/home");
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
            <Box maxWidth={600} mx="auto" /*className={effects.fadeup}*/ component={Card}>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div className={"my_8"}>
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
                    </div>
                    <div className={"my_8"}>
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
                                        <Tooltip title={(show ? "Hide" : "Show") + " Password"}>
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
                    </div>
                    <Box clone mt="-8px" mb="4px">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={staySignedIn}
                                    onChange={e => setStaySignedIn(e.target.checked)}
                                    value="Stay signed in"
                                    color="primary"
                                />
                            }
                            label="Stay signed in"
                        />
                    </Box>
                    <div className={"flex space_between"}>
                        <LoadBtn loading={loading} label="Login" disabled={disabled} />
                        <Button
                            onClick={() => setState(initialState)}
                            variant="outlined"
                            color="primary"
                        >
                            clear
                        </Button>
                    </div>
                </form>
                <Divider className={"my_8"} />
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