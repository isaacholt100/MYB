import React, { useEffect, useState } from "react";
import { Tabs, Tab, AppBar, Card, Box, TextField, Typography, Button } from "@material-ui/core";
import useRedirect from "../hooks/useRedirect";
import useUser from "../hooks/useUser";
import useGroup from "../hooks/useGroup";
import { usePost, usePut } from "../hooks/useRequest";
import LoadBtn from "../components/LoadBtn";
import DeleteAccount from "../components/settings/DeleteAccount";
import Password from "../components/settings/Password";
import { startCase } from "lodash";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import FieldSettings from "../components/settings/FieldSettings";
import Pic from "../components/settings/Pic";
import Group from "../components/settings/Group";

export default function Settings() {
    //const [page, setPage] = useState(0);
    const user = useUser();
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
            <FieldSettings name="name" limit={50} route="/user/settings/" initial={user.name} />
            <FieldSettings name="quote" limit={150} route="/user/settings/" initial={user.quote} />
            <Pic route="/user/settings/pic" done={(data) => {
                console.log(data);
                                
                mutate("/api/user", {
                    ...user,
                    pic: data.name,
                }, true);
                mutate("/api/members");
            }} pic={user.pic} />
            <br />
            {user.admin && <Group />}
            <Typography variant="h4" gutterBottom>Account Settings</Typography>
            <Password />
            <DeleteAccount />
        </div>
    );
};