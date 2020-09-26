import React, { useState } from "react";
import { Tabs, Tab, AppBar, Card, Box } from "@material-ui/core";
import Icon from "../components/settings/Icon";
import Password from "../components/settings/Password";
import Timetable from "../components/settings/Timetable";
import School from "../components/settings/School";
import DeleteAccount from "../components/settings/DeleteAccount";
import Theme from "../components/settings/Theme";

export default () => {
    const [page, setPage] = useState(0);
    return (
        <Box mb="50px !important" pb={"0 !important"}>
            <Box clone mb={{ xs: 1, lg: 2 }}>
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
            </Box>
            <Box component={Card} mb={{ xs: 1, lg: 2, }} className="fadeup">
                {page === 0 && (
                    <>
                        <Icon />
                        <Password />
                        <Timetable />
                        <School />
                        <DeleteAccount />
                    </>
                )}
                {page === 1 && <Theme />}
            </Box>
        </Box>
    );
};