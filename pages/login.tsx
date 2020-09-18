/* eslint-disable react-hooks/exhaustive-deps */
//Imports
import React, { useState } from "react";
//import { Link } from "react-router-dom";
//import redirect from "../../api/redirect";
//import { useDispatch } from "react-redux";
//import useRequest from "../../hooks/useFetch";
//import { useHistory } from "react-router-dom";
//import serverUrl from "../../api/serverUrl";
//import socket from "../../api/socket";
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
//import AjaxBtn from "../../components/AjaxBtn";
//import { setCookie } from "../../api/cookies";
//import useSocket from "../../hooks/useSocket";

const
    originalState = {
        email: "",
        password: "",
        emailError: "",
        passwordError: "",
    };

export default () => {
    const
        //request = useRequest(),
        [show, setShow] = useState(false),
        [staySigned, setStaySigned] = useState(true),
        [state, setState] = useState(originalState),
        //dispatch = useDispatch(),
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
        handleClear = () => {
            setState(originalState);
        },
        handleSubmit = async e => {
            e.preventDefault();
            const email = state.email.trim().toLocaleLowerCase();
            if (state.emailError === "" && state.passwordError === "") {
                /*request.post("/login", {
                    setLoading: true,
                    failedMsg: "logging you in",
                    body: {
                        email,
                        password: state.password,
                        staySignedIn: state.staySignedIn,
                    },
                    done: data => {
                        setCookie("refresh", data.refreshToken, state.staySignedIn);
                        setCookie("accessToken", data.accessToken, true);
                        setCookie("email", email, true);
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
                        socket.connect(`http://${serverUrl.split(":5000")[0]}`);
                        history.push(redirect());
                    },
                    errors: data => setState({
                        ...state,
                        ...data.errors,
                    })
                });*/
                /*request("/login", "POST", true, data => {
                    setCookie("refresh", data.refreshToken, state.staySignedIn);
                    setCookie("accessToken", data.accessToken, true);
                    setCookie("email", email, true);
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
                    socket.connect(`http://${serverUrl.split(":5000")[0]}`);
                    history.push(redirect());
                }, "logging you in", {
                    email,
                    password: state.password,
                    staySignedIn: state.staySignedIn,
                }, data => {
                    setState({
                        ...state,
                        ...data.errors,
                    });
                });*/
            }
        }
        //t({ url: "/test", done: console.log})
        //console.log(snack, s, t({ url: "/test"}));
    return (
        <div>
            <Box maxWidth={600} mx="auto" className="fadeup" component={Card}>
                <Typography variant="h5" gutterBottom>
                    Login to Unnamed
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box my="8px">
                        <TextField
                            id="email"
                            name="email"
                            required
                            error={state.emailError !== ""}
                            variant="outlined"
                            label="Username or email"
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
                        <Button type="submit">
                            Login
                        </Button>
                        {/*<AjaxBtn label="Login" disabled={disabled} />*/}
                        <Button
                            onClick={handleClear}
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
                        //component={React.forwardRef((props, ref) => <Link href="/signup" naked ref={ref as any} {...props} />)}
                        //href="/signup"
                    >
                        Sign up now
                    </Button>
                </Link>
                <Link href="/poo">
                        <Button variant="outlined" component="a">
                            Go Home
                        </Button>
                    </Link>
            </Box>
        </div>
    );
};