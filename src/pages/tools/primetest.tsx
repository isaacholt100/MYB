import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    result: {
        color: theme.palette.secondary.main,
        marginLeft: "auto",
        borderRadius: 4,
        border: `2px solid ${theme.palette.secondary.main}`,
        padding: 4,
    }
}));
export default () => {
    const
        [number, setNumber] = useState(""),
        [message, setMessage] = useState(""),
        classes = useStyles(),
        handleChange = event => {
            setNumber(event.target.value);
        },
        handleSubmit = () => {
            let prime = true;
            const num = +number;
            if (num % 1 !== 0) {
                setMessage("Number is not whole");
            } else {
                if (num >= 1e16) {
                    setMessage("Too big. Get a supercomputer.");
                } else {
                    if (num % 2 === 0 || num % 3 === 0) {
                        prime = false;
                    }
                    for (let i = 5; i * i <= num; i = i + 6) {
                        if (num % i === 0 || num % (i + 2) === 0) {
                            prime = false;
                        }
                    }
                    if (num <= 3) {
                        prime = true;
                    }
                    if (num <= 1) {
                        prime = false;
                    }
                    if (!prime) {
                        setMessage("Number is not prime");
                    } else {
                        setMessage("Number is prime");
                    }
                }
            }
        },
        prevent = e => {
            e.preventDefault();
            if (number.length !== 0) {
                handleSubmit();
            }
        };
    return (
        <div style={{ flex: 1, width: "100%" }} className="fadeup">
            <Paper elevation={0} style={{ borderRadius: 16, margin: 8 }}>
                <form onSubmit={prevent} style={{ padding: 16 }}>
                    <Typography variant="h5">Prime number test</Typography>
                    <TextField
                        id="number"
                        label="Number"
                        value={number}
                        onChange={handleChange}
                        margin="normal"
                        type="number"
                        //maxLength="16"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <div className={"flex align_items_center"}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={number.length === 0}
                        >
                            test
                        </Button>
                        {message !== "" && <div className={classes.result}>{message}</div>}
                    </div>
                </form>
            </Paper>
        </div>
    );
};
