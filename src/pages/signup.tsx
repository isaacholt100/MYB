/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { startCase } from "lodash";
import {
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    TextField,
    Radio,
    RadioGroup,
    Divider,
    Box,
    Card,
} from "@material-ui/core";
import LoadBtn from "../components/LoadBtn";
import clsx from "clsx";
import { usePost } from "../hooks/useRequest";
import Link from "next/link";
import Head from "next/head";
import jwtCookies from "../lib/jwtCookies";
import styles from "../css/signup.module.css";
interface IFields {
    firstName: string;
    surname: string;
    email: string;
    schoolID: string;
    password: string;
    repeatPassword: string;
}
const
    initialValues: IFields = {
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
export default function Login() {
    const
        [post, loading] = usePost(),
        //socket = useSocket(),
        //title = useTitle(),
        [values, setValues] = useState(initialValues),
        [helpers, setHelpers] = useState(initialValues),
        [role, setRole] = useState("student"),
        [staySignedIn, setStaySignedIn] = useState(true),
        dispatch = useDispatch(),
        classes = useStyles(),
        //history = useHistory(),
        signup = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const email = values.email.trim().toLocaleLowerCase();
            post("/user", {
                setLoading: true,
                failedMsg:  "signing you up",
                body: {
                    email,
                    firstName: values.firstName.trim(),
                    surname: values.surname.trim(),
                    schoolID: values.schoolID.trim(),
                    password: values.password,
                    repeatPassword: values.repeatPassword,
                    role,
                    staySignedIn,
                },
                done: (data: any) => {
                    jwtCookies({
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        staySignedIn,
                        user_id: data.user_id,
                    });
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
                errors: data => setHelpers({
                    ...helpers,
                    ...data.errors as object,
                })
            });
        },
        handleClear = () => {
            setHelpers(initialValues);
            setValues(initialValues);
        },
        handleChange = (field: keyof(IFields)) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
    return (
        <>
            <Head>
                <title>Signup</title>
            </Head>
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
                        {Object.keys(initialValues).map((field: keyof IFields, i) => (
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
                            />
                        ))}
                        <Box clone mt="-8px" mb="4px">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={staySignedIn}
                                        onChange={(e, checked) => setStaySignedIn(checked)}
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
                    <Divider className={"my_8"} />
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
        </>
    );
};
