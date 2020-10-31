import React, { memo, useState } from "react";
import useRequest, { usePut } from "../../hooks/useRequest";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { Typography, TextField, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import Cookies from "js-cookie";

export default memo(() => {
    const
        [put, loading] = usePut(),
        snackbar = useSnackbar(),
        [ConfirmDialog, confirm] = useConfirm(loading),
        [state, setState] = useState({
            _id: "",
            helper: "",
        }),
        change = () => {
            put("/user/school", {
                failedMsg: "updating your school",
                body: { school_id: state._id },
                done: data => {
                    setState({
                        helper: "",
                        _id: "",
                    });
                    snackbar.success("School updated");
                },
                errors: data => setState({
                    ...state,
                    helper: data.errors as string,
                })
            });
        },
        submit = e => {
            e.preventDefault();
            if (state._id !== "") {
                if (Cookies.get("school_id")) {
                    confirm("change your school? You'll leave all your classes.", change);
                } else if (state._id === Cookies.get("school_id")) {
                    setState({
                        ...state,
                        _id: "",
                    });
                } else {
                    change();
                }
            }
        };
    return (
        <form onSubmit={submit}>
            <Typography variant="h6" gutterBottom>
                School
            </Typography>
            <TextField
                value={state._id}
                variant="outlined"
                label="New school ID"
                onChange={e => setState({ _id: e.target.value, helper: "" })}
                error={state.helper !== ""}
                helperText={state.helper + " "}
                fullWidth
            />
            <Button
                color="secondary"
                type="submit"
            >
                Change
            </Button>
            <MarginDivider />
            {ConfirmDialog}
        </form>
    );
});