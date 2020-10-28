/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { startCase } from "lodash";
import { Typography, Button, Paper, TextField, Box, Card } from '@material-ui/core';
import useIsLoggedIn from "../hooks/useIsLoggedIn";
const initialState = {
    val: "",
    error: "",
};
export default function Feedback() {
    const
        dispatch = useDispatch(),
        isLoggedIn = useIsLoggedIn(),
        [message, setMessage] = useState(initialState),
        [subject, setSubject] = useState(initialState),
        disabled =
            message.error !== "" ||
            subject.error !== "" ||
            message.val === "" ||
            subject.val === "",
        handleChange = name => event => {
            let fn = setSubject;
            if (name === "message") {
                fn = setMessage
            };
            fn({
                val: event.target.value,
                error: event.target.value === "" ? "Field required" : "",
            });
        },
        handleClear = () => {
            setSubject(initialState);
            setMessage(initialState);
        },
        sendFeedback = e => {
            e.preventDefault();
            if (!disabled) {

            }
        };
    return !isLoggedIn ? null : (
        <div>
            <Box maxWidth={600} mx="auto" /*className={effects.fadeup}*/ component={Card}>
                <Typography variant="h5" gutterBottom>
                    Send feedback
                </Typography>
                <form noValidate onSubmit={sendFeedback}>
                    {["subject", "message"].map(field => {
                        let name = subject;
                        if (field === "message") {
                            name = message;
                        };
                        return (
                            <TextField
                                key={field}
                                id={field}
                                required
                                error={name.error !== ""}
                                variant="outlined"
                                type={field === "email" ? "email" : "text"}
                                label={startCase(field)}
                                value={name.val}
                                onChange={handleChange(field)}
                                helperText={name.error + " "}
                                multiline={field === "message"}
                                rows="6"
                                fullWidth
                            />
                        );
                    })}
                    <div className={"flex space_between"}>
                        <Button variant="contained" color="primary" disabled={disabled} type="submit">
                            Submit
                        </Button>
                        <Button onClick={handleClear} variant="outlined" color="primary">
                            clear
                        </Button>
                    </div>
                </form>
            </Box>
        </div>
    )
};
