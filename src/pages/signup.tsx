/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
//import redirect from "../../api/redirect";
//import useRequest from "../hooks/useRequest";
import { useDispatch, useSelector } from "react-redux";
//import socket from "../../api/socket";
import { startCase } from "lodash";
//import { useHistory, Link } from "react-router-dom";
//import serverUrl from "../../api/serverUrl";
import effects from "../css/effects.module.css";
import {
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    TextField,
    Radio,
    RadioGroup,
    InputAdornment,
    Divider,
    Box,
    Card,
} from "@material-ui/core";
import LoadBtn from "../components/LoadBtn";
import clsx from "clsx";
//import { setCookie } from "../../api/cookies";
//import useTitle from "../../hooks/useTitle";
//import useSocket from "../../hooks/useSocket";
import { usePost } from "../hooks/useRequest";
import Link from "next/link";

const
    initialValues = {
        firstName: "",
        surname: "",
        email: "",
        schoolID: "",
        password: "",
        repeatPassword: "",
    },
    useStyles = makeStyles(theme => ({
        input: {
            width: "100%",
            margin: "4px 0",
        },
        firstName: {
            width: "calc(50% - 4px)",
            textTransform: "capitalize"
        },
        surname: {
            width: "calc(50% - 4px)",
            marginLeft: 8,
            textTransform: "capitalize"
        },
        password: {
            width: "calc(50% - 4px)",
        },
        repeatPassword: {
            width: "calc(50% - 4px)",
            marginLeft: 8,
        },
    }));
export default () => {
    const
        [post, loading] = usePost(),
        //socket = useSocket(),
        //title = useTitle(),
        [values, setValues] = useState(initialValues),
        [helpers, setHelpers] = useState(initialValues),
        [role, setRole] = useState("student"),
        [staySigned, setStaySigned] = useState(true),
        dispatch = useDispatch(),
        classes = useStyles(),
        //history = useHistory(),
        signup = e => {
            e.preventDefault();
            const email = values.email.trim().toLocaleLowerCase();
            post("/signup", {
                setLoading: true,
                failedMsg:  "signing you up",
                body: {
                    email,
                    firstName: values.firstName.trim(),
                    surname: values.surname.trim(),
                    schoolID: values.schoolID.trim(),
                    password: values.password,
                    repeatPassword: values.repeatPassword,
                    role: role,
                    staySignedIn: staySigned,
                },
                done: (data: any) => {
                    /*sessionStorage.setItem("visited", "1");
                    localStorage.setItem("role", role);
                    setCookie("refresh", data.refreshToken, staySignedIn);
                    setCookie("accessToken", data.accessToken, true);
                    dispatch({
                        type: "/user/info/update",
                        payload: {
                            email,
                            name: values.firstName + " " + values.surname,
                            role,
                            user_id: data.user_id,
                        },
                    });
                    history.push(redirect());
                    socket.connect(`http://${serverUrl.split(":5000")[0]}`);*/
                },
                errors: (data: any) => setHelpers({
                    ...helpers,
                    ...data.errors,
                })
            });
        },
        handleClear = () => {
            setHelpers(initialValues);
            setValues(initialValues);
        },
        handleChange = (field: string) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            let newState = {};
            const { value } = e.target;
            setValues({
                ...values,
                [field]: value,
            });
            if (!field.includes("assword") ? value.trim() === "" : value === "") {
                newState = {
                    [field]: "Field required",
                };
            } else {
                newState = {
                    [field]: "",
                };
            }
            if (field === "repeatPassword") {
                if (value.length === 0) {
                    newState = {
                        repeatPassword: "",
                    };
                } else if (value !== values.password) {
                    newState = {
                        repeatPassword: "Passwords must match",
                    };
                }
            } else if (field === "password") {
                if (value.length < 6) {
                    newState = {
                        password: "Password must at least 6 characters",
                    };
                }
                if (values.repeatPassword.length === 0) {
                    newState = {
                        ...newState,
                        repeatPassword: "",
                    };
                } else if (values.repeatPassword !== value) {
                    newState = {
                        ...newState,
                        repeatPassword: "Passwords must match",
                    };
                }
            } else if (field === "username") {
                if (value.length < 4) {
                    newState = {
                        username: "Username must be at least 4 characters",
                    };
                } else if (!value.match(/^[0-9a-z]+$/)) {
                    newState = {
                        username: "Username must be alphanumerical",
                    };
                }
            } else if (field === "schoolID") {
                if (role === "admin" && value.trim() === "") {
                    newState = {
                        schoolID: "Please enter your school name",
                    };
                } else {
                    newState = {
                        schoolID: "",
                    };
                }
            } else if (field === "email") {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(value).toLowerCase())) {
                    newState = {
                        email: "Email address invalid",
                    };
                }
            } else if (field === "firstName" || field === "surname") {
                setValues({
                    ...values,
                    [field]: value
                        .toLowerCase()
                        .split(" ")
                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(" "),
                });
            }
            setHelpers({
                ...helpers,
                ...newState,
            });
        },
        changePosition = (e: ChangeEvent<HTMLInputElement>, val: string) => {
            if (values.schoolID === "" && helpers.schoolID !== "") {
                setHelpers({
                    ...helpers,
                    schoolID: "",
                });
            }
            setRole(val);
        },
        disabled =
            helpers.email !== "" ||
            helpers.password !== "" ||
            helpers.repeatPassword !== "" ||
            helpers.firstName !== "" ||
            helpers.surname !== "" ||
            (role === "admin" && helpers.schoolID !== "") ||
            values.email === "" ||
            values.password === "" ||
            values.repeatPassword === "" ||
            values.firstName === "" ||
            values.surname === "" ||
            (role === "admin" && values.schoolID === "");
    useEffect(() => {
        //title("Sign Up");
    }, []);
    return (
        <div>
            <Box maxWidth={600} /*className={effects.fadeup}*/ mx="auto" component={Card}>
                <Typography variant="h5" gutterBottom>
                    Sign up to Squool
                </Typography>
                <form noValidate autoComplete="off" onSubmit={signup}>
                    <Typography>I am a...</Typography>
                    <FormGroup row>
                        <RadioGroup
                            aria-label="Position"
                            name="role"
                            value={role}
                            onChange={changePosition}
                            row
                        >
                            <FormControlLabel
                                value="student"
                                control={<Radio />}
                                label="Student"
                            />
                            <FormControlLabel
                                value="teacher"
                                control={<Radio />}
                                label="Teacher"
                            />
                            <FormControlLabel
                                value="admin"
                                control={<Radio />}
                                label="Admin"
                            />
                        </RadioGroup>
                    </FormGroup>
                    {Object.keys(initialValues).map((field, i) => (
                        <TextField
                            autoFocus={i === 0}
                            key={field}
                            id={field}
                            required={field !== "schoolID" || role === "admin"}
                            error={helpers[field] !== "" && (role !== "admin" ? field !== "schoolID" || helpers[field] === "School not found" : true)}
                            autoComplete={`new-${field}`}
                            variant="outlined"
                            type={field.includes("assword") ? "password" : "text"}
                            label={
                                field === "firstName" && role !== "student"
                                    ? "Title"
                                    : field === "schoolID" && role === "admin"
                                        ? "Create School (Enter Name)"
                                        : startCase(field)
                            }
                            value={values[field]}
                            onChange={handleChange(field)}
                            helperText={helpers[field] + " "}
                            className={clsx(classes.input, classes[field])}
                            InputProps={{
                                startAdornment: field === "username" && (
                                    <InputAdornment position="start">
                                        @
                                    </InputAdornment>
                                ),
                            }}
                        />
                    ))}
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
                        <LoadBtn loading={loading} label="Sign Up" disabled={disabled} />
                        <Button
                            onClick={handleClear}
                            variant="outlined"
                            color="primary"
                        >
                            clear
                        </Button>
                    </Box>
                </form>
                <Divider style={{margin: "8px 0"}} />
                <Typography variant="h6" gutterBottom>
                    Already have an account?
                </Typography>
                <Link href="/login">
                    <Button
                        color="secondary"
                        component="a"
                    >
                        Login
                    </Button>
                </Link>
            </Box>
        </div>
    );
};
