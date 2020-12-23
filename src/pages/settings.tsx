import React, { useState } from "react";
import { Tabs, Tab, AppBar, Box, Button, Divider } from "@material-ui/core";
import useRedirect from "../hooks/useRedirect";
import useUser from "../hooks/useUser";
import DeleteAccount from "../components/settings/DeleteAccount";
import Password from "../components/settings/Password";
import { mutate } from "swr";
import FieldSettings from "../components/settings/FieldSettings";
import Pic from "../components/settings/Pic";
import Group from "../components/settings/Group";
import ChangeGroup from "../components/settings/ChangeGroup";
import Link from "next/link";
import { useDelete } from "../hooks/useRequest";
import LoadBtn from "../components/LoadBtn";

export default function Settings() {
    const [page, setPage] = useState(0);
    const user = useUser();
    const isLoggedIn = useRedirect();
    const [del, delLoading] = useDelete();
    const resetPicture = e => {
        e.preventDefault();
        if (user.pic !== "") {
            del("/user/settings/pic", {
                doneMsg: "Profile picture reset",
                failedMsg: "resetting your profile picture",
                setLoading: true,
            });
        }
    }
    return !isLoggedIn ? null : (
        <div>
            <Box clone mb={{ xs: "8px !important", lg: "16px !important" }}>
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
                        {(user.admin ? ["Profile", "Account", "Group"] : ["Profile", "Account"]).map((tab, i) => (
                            <Tab
                                key={i}
                                id={`scrollable-auto-tab-${i}`}
                                aria-controls={`scrollable-auto-tabpanel-${i}`}
                                label={tab}
                            />
                        ))}
                    </Tabs>
                </AppBar>
            </Box>
            {page === 0 && (
                <div className={"mt_16"}>
                    <FieldSettings name="name" limit={50} route="/user/settings/" initial={user.name} />
                    <FieldSettings name="quote" limit={150} route="/user/settings/" initial={user.quote} />
                    <Pic route="/user/settings/pic" done={(data) => {
                        mutate("/api/user", {
                            ...user,
                            pic: data.name,
                        }, true);
                        mutate("/api/members");
                    }} pic={user.pic} />
                    <form onSubmit={resetPicture}>
                        <LoadBtn label="Reset Picture" className="mt_8" loading={delLoading} disabled={user.pic === ""} color="default" />
                    </form>
                    <Divider className={"my_16"} />
                    <Link href={"/bio/" + user._id}>
                        <Button color="secondary">View Profile</Button>
                    </Link>
                </div>
            )}
            {page === 1 && (
                <>
                    {!user.group_id && <ChangeGroup />}
                    <Password />
                    <DeleteAccount />
                </>
            )}
            {page === 2 && user.admin && <Group />}
        </div>
    );
};