import React, { useEffect, useState } from "react";
import { Tabs, Tab, AppBar, Card, Box, TextField, Typography, Button } from "@material-ui/core";
import useRedirect from "../hooks/useRedirect";
import useUser from "../hooks/useUser";
import { usePost, usePut } from "../hooks/useRequest";
import LoadBtn from "../components/LoadBtn";
import DeleteAccount from "../components/settings/DeleteAccount";
import Password from "../components/settings/Password";
import { startCase } from "lodash";
import Image from "next/image";
import { mutate } from "swr";

const FieldSettings = ({ name, limit }: { name: "quote" | "name", limit: number }) => {
    const user = useUser();
    const [val, setVal] = useState(user[name]);
    const [put, loading] = usePut();
    const error = val.length > limit;
    const updateQuote = e => {
        e.preventDefault();
        if (!loading) {
            put("/user/settings/" + name, {
                setLoading: true,
                failedMsg: "changing your " + name,
                body: {
                    [name]: val,
                },
                doneMsg: startCase(name) + " updated",
            })
        }
    }
    useEffect(() => {
        setVal(user[name]);
    }, [user[name]]);
    return (
        <div className={"mb_16"}>
            <form onSubmit={updateQuote}>
                <TextField
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    label={startCase(name)}
                    multiline={name === "quote"}
                    fullWidth
                    helperText={error ? startCase(name) + " too long" : " "}
                    error={error}
                />
                <LoadBtn label={"Update " + name} loading={loading} disabled={error} />
            </form>
        </div>
    );
}
const Pic = () => {
    const user = useUser();
    const [put, loading] = usePut();
    return (
        <div className="flex align_items_center">
            <img src={"/uploads/" + user.pic} height={64} width={64} style={{borderRadius: "50%"}} />
            <div className="ml_8">
                <input
                    accept="image/*"
                    className={"display_none"}
                    id="contained-button-file"
                    type="file"
                    onChange={e => {
                        const form = new FormData();
                        form.append("file", e.target.files[0]);
                        put("/user/settings/pic", {
                            file: true,
                            setLoading: true,
                            failedMsg: "uploading this image",
                            done(data: any) {
                                console.log(data);
                                
                                mutate("/api/user", {
                                    ...user,
                                    pic: data.name,
                                }, true);
                                mutate("/api/members");
                            },
                            body: form,
                        });
                    }}
                />
                <label htmlFor="contained-button-file">
                    <LoadBtn loading={loading} label="Change Picture" disabled={false} component="span" />
                </label>
            </div>
        </div>
    );
}

export default function Settings() {
    //const [page, setPage] = useState(0);
    const isLoggedIn = useRedirect();
    return !isLoggedIn ? null : (
        <div>
            {/*<Box clone mb={{ xs: "8px !important", lg: "16px !important" }}>
                <AppBar position="relative" color="default">
                    <Tabs
                        value={page}
                        onChange={(e, p) => setPage(p)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable tabs"
                    >
                        {["account", "theme"].map((tab, i) => (
                            <Tab
                                key={i}
                                id={`scrollable-auto-tab-${i}`}
                                aria-controls={`scrollable-auto-tabpanel-${i}`}
                                label={tab}
                            />
                        ))}
                    </Tabs>
                </AppBar>
            </Box>*/}
            <Typography variant="h4" gutterBottom>Profile Settings</Typography>
            <FieldSettings name="name" limit={50} />
            <FieldSettings name="quote" limit={150} />
            <Pic />
            <Typography variant="h4" gutterBottom>Account Settings</Typography>
            <Password />
            <DeleteAccount />
        </div>
    );
};