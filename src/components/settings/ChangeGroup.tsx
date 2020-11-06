import React, { memo, useState } from "react";
import useRequest, { usePut } from "../../hooks/useRequest";
import useConfirm from "../../hooks/useConfirm";
import { Typography, TextField, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import Cookies from "js-cookie";
import LoadBtn from "../LoadBtn";
import { mutate } from "swr";

export default function ChangeGroup() {
    const
        [put, loading] = usePut(),
        [ConfirmDialog, confirm, close] = useConfirm(loading),
        [state, setState] = useState({
            _id: "",
            helper: "",
        }),
        change = () => {
            put("/user/group", {
                failedMsg: "updating your group",
                body: { school_id: state._id },
                doneMsg: "School updated",
                setLoading: true,
                done(data) {
                    close();
                    setState({
                        helper: "",
                        _id: "",
                    });
                    Cookies.remove("refreshToken");
                    Cookies.remove("accessToken");
                    Cookies.remove("user_id");
                    localStorage.clear();
                    mutate("/api/login", "", false);
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
                if (localStorage.getItem("group_id")) {
                    confirm("change your school? You will be logged out and will have to login again.", change);
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
            <TextField
                value={state._id}
                variant="outlined"
                label="New group ID"
                onChange={e => setState({ _id: e.target.value, helper: "" })}
                error={state.helper !== ""}
                helperText={state.helper + " "}
                fullWidth
            />
            <LoadBtn
                loading={loading}
                disabled={state.helper !== ""}
                label="Change Group"
            />
            <MarginDivider />
            {ConfirmDialog}
        </form>
    );
};