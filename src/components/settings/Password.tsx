import React, { memo, useState } from "react";
import { usePut } from "../../hooks/useRequest";
import { Typography, Grid, TextField } from "@material-ui/core";
import { startCase } from "lodash";
import MarginDivider from "../MarginDivider";
import LoadBtn from "../LoadBtn";
interface IFields {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
    oldPasswordError: string;
    newPasswordError: string;
    repeatPasswordError: string;
}
export default memo(() => {
    const
        [put, loading] = usePut(),
        [state, setState] = useState<IFields>({
            oldPassword: "",
            newPassword: "",
            repeatPassword: "",
            oldPasswordError: "",
            newPasswordError: "",
            repeatPasswordError: "",
        }),
        enabled = state.repeatPasswordError === "" && state.newPasswordError === "" && state.oldPasswordError === "" && state.newPassword !== "" && state.repeatPassword !== "",
        changePassword = e => {
            e.preventDefault();
            if (enabled && !loading) {
                put("/user/password", {
                    setLoading: true,
                    failedMsg: "changing your password",
                    body: {
                        newPassword: state.newPassword,
                        oldPassword: state.oldPassword,
                    },
                    doneMsg: "Password updated",
                    done: data => setState({
                        ...state,
                        newPassword: "",
                        repeatPassword: "",
                        oldPassword: "",
                    }),
                    errors: data => setState({
                        ...state,
                        ...data.errors as Partial<IFields>,
                    })
                });
                /*request("/user/password", "PUT", false, data => {
                    setState({
                        ...state,
                        newPassword: "",
                        repeatPassword: "",
                        oldPassword: "",
                    });
                    showSnackbar("Password updated", {
                        variant: "info",
                    });
                }, "changing your password", {
                    newPassword: state.newPassword,
                    oldPassword: state.oldPassword,
                }, data => {
                    setState({
                        ...state,
                        ...data.errors,
                    });
                });*/
            }
        },
        handleChange = (p: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newState: Partial<IFields> = {};
            const { value } = e.target;
            switch (p) {
                case "repeatPassword":
                    if (value.length === 0) {
                        newState.repeatPasswordError = "";
                    } else if (value !== state.newPassword) {
                        newState.repeatPasswordError = "Passwords must match";
                    } else {
                        newState.repeatPasswordError = "";
                    }
                    break;
                case "newPassword":
                    if (value.length < 6) {
                        newState.newPasswordError = "Password must at least 6 characters";
                    } else {
                        newState.newPasswordError = "";
                    }
                    if (value !== state.newPassword && state.repeatPassword !== "") {
                        newState.repeatPasswordError = "Passwords must match";
                    } else {
                        newState.repeatPasswordError = "";
                    }
                    break;
                default:
                    newState.oldPasswordError = "";
                    break;
            }
            setState({
                ...state,
                [p]: value,
                ...newState,
            });
        };
    return (
        <form onSubmit={changePassword}>
            <Typography variant="h6" gutterBottom>
                Password
            </Typography>
            <Grid container spacing={2}>
                {["old", "new", "repeat"].map(p => (
                    <Grid item xs={12} md={4} key={p}>
                        <TextField
                            id={p + "-password"}
                            label={startCase(p) + " Password"}
                            type="password"
                            fullWidth
                            value={state[`${p}Password`]}
                            margin="none"
                            variant="outlined"
                            onChange={handleChange(`${p}Password`)}
                            required
                            error={state[`${p}PasswordError`] !== ""}
                            helperText={state[`${p}PasswordError`] + " "}
                            autoComplete="false"
                        />
                    </Grid>
                ))}
            </Grid>
            <LoadBtn
                label="Change"
                disabled={!enabled}
                loading={loading}
            />
            <MarginDivider />
        </form>
    );
});