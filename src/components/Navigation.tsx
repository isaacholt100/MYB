/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, memo, ReactChildren, ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
    SwipeableDrawer,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Hidden,
    Tooltip,
    ListItemText,
    ListItem,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import usePathname from "../hooks/usePathname";
import useCookies from "../hooks/useCookies";
import Icon from "./Icon";
import { mdiAccountGroup, mdiAccountPlus, mdiBell, mdiBook, mdiCalendar, mdiChat, mdiCog, mdiDotsHorizontal, mdiFormatListChecks, mdiGroup, mdiHome, mdiLogin, mdiMenu, mdiSchool, mdiTimetable, mdiWrench } from "@mdi/js";
import Link from "next/link";
import useIsLoggedIn from "../hooks/useIsLoggedIn";

const
    useStyles = makeStyles(theme => ({
        appBar: {
            marginLeft: 65,
            [theme.breakpoints.up("lg")]: {
                width: `calc(100% - ${65}px)`
            },
            boxShadow: "none",
            //position: "fixed",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            padding: 0,
            borderRadius: 0,
            zIndex: 1200,
            borderBottom: `4px solid ${theme.palette.primary.main}`,
        },
        navIconHide: {
            [theme.breakpoints.up("lg")]: {
                display: "none",
            },
            marginLeft: 4,
            marginRight: 4,
        },
        drawerPaper: {
            position: "fixed",
            width: 240,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            "& *": {
                fontFamily: theme.typography.fontFamily,
            },
            padding: 0,
            borderRadius: 0,
        },
        drawerLarge: {
            width: 65,
        },
        mr: {
            marginRight: 4,
            position: "relative",
            top: 0,
        },
        iconBtn: {
            /*color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            "&:hover": {
                backgroundColor: (theme.palette.background as any).level1,
            },*/
        },
        linksContainer: {
            padding: 8,
            display: "flex",
            flexDirection: "column",
        },
    }));
const Nav = memo(() => {
    const
        pathname = usePathname(),
        [mobileOpen, setMobileOpen] = useState(false),
        [notificationOpen, setNotificationOpen] = useState(false),
        dispatch = useDispatch(),
        isLoggedIn = useIsLoggedIn(),
        classes = useStyles(),
        role = ["student", "teacher"][0],//useSelector(s => s.userInfo.role),
        iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent),
        icons = {
            "Books": <Icon path={mdiBook} />,
            "Classes": <Icon path={mdiAccountGroup} />,
            "Chats": <Icon path={mdiChat} />,
            "Timetable": <Icon path={mdiTimetable} />,
            "Calendar": <Icon path={mdiCalendar} />,
            "Tools": <Icon path={mdiWrench} />,
            "Reminders": <Icon path={mdiFormatListChecks} />,
            "Settings": <Icon path={mdiCog} />,
            "School": <Icon path={mdiSchool} />,
            "Home": <Icon path={mdiHome} />
        },
        links = () => {
            if (!isLoggedIn) {
                return ["Home", "Signup", "Login"];
            }
            switch (role) {
                case "student":
                    return ["Home", "Books", "Classes", "Chats", "Timetable", "Calendar", "Tools", "Reminders", "Settings"];
                case "teacher":
                    return ["Home", "Classes", "Chats", "Timetable", "Calendar", "Tools", "Reminders", "Settings"];
                default:
                    return ["Home", "School", "Chats", "Calendar", "Tools", "Reminders", "Settings"];
            }
        },
        DrawerItems = (small: boolean) => isLoggedIn && (
            <>
                <Box p={"8px 8px 0px 8px"}>
                    {links().map((link, i) => (
                        <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" borderRadius={8} mb="8px" height="48px !important" px="12px !important" key={i} color={link.toLowerCase() === pathname.split("/")[1] ? "primary.main" : "text.primary"} /*border={link === "Home" && 2}*/ onClick={() => setMobileOpen(false)}>
                            {b => (
                                <Tooltip placement="left" title={link} {...(small ? {open: false} : {})}>
                                    <ListItem
                                        {...b}
                                        button
                                        component={Link}
                                        to={"/" + link.toLowerCase()}
                                        //selected={link.toLowerCase() === location.pathname.split("/")[1]}
                                        selected={link === "Home"}
                                    >
                                        {icons[link]}
                                        {small && (
                                            <Box ml="16px" clone>
                                                <ListItemText primary={link} />
                                            </Box>
                                        )}
                                    </ListItem>
                                </Tooltip>
                            )}
                        </Box>
                    ))}
                </Box>
            </>
        );
    return (
        <>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar disableGutters={true} style={{minHeight: 56}}>
                    <Tooltip title="Menu">
                        <IconButton
                            aria-label="Open drawer"
                            color="inherit"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={clsx(classes.navIconHide, classes.iconBtn)}
                        >
                            <Icon path={mdiMenu} />
                        </IconButton>
                    </Tooltip>
                    <Box ml="auto">
                        {isLoggedIn && (
                            <>
                                <Tooltip title="Notifications">
                                    <Box ml="auto" mr="8px" clone>
                                        <IconButton
                                            className={clsx(classes.mr, classes.iconBtn)}
                                            onClick={() => setNotificationOpen(true)}
                                        >
                                            <Icon path={mdiBell} />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                                <Tooltip title="More Options">
                                    <IconButton
                                        className={clsx(classes.mr, classes.iconBtn)}
                                        onClick={() => dispatch({
                                            type: "/moreActions/open",
                                        })}
                                    >
                                        <Icon path={mdiDotsHorizontal} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                anchor="right"
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div className={classes.linksContainer}>
                    <Typography variant="h5">Notifications</Typography>
                </div>
            </Drawer>
            <Hidden lgUp>
                <SwipeableDrawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    onOpen={() => setMobileOpen(true)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                >
                    {DrawerItems(true)}
                </SwipeableDrawer>
            </Hidden>
            <Hidden mdDown implementation="css">
                <Drawer
                    variant="permanent"
                    open
                    classes={{
                        paper: clsx(classes.drawerPaper, classes.drawerLarge),
                    }}
                >
                    {DrawerItems(false)}
                </Drawer>
            </Hidden>
        </>
    );
});
export default () => {
    const loggedIn = useIsLoggedIn();
    return loggedIn ? <Nav /> : null;
}