/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, memo, ReactChildren, ReactNode, useEffect } from "react";
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
    Divider,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import usePathname from "../hooks/usePathname";
import Icon from "./Icon";
import { mdiAccountGroup, mdiAccountPlus, mdiBell, mdiBook, mdiCalendar, mdiChat, mdiCog, mdiDotsHorizontal, mdiFormatListChecks, mdiGroup, mdiHome, mdiLogin, mdiMenu, mdiSchool, mdiTimetable, mdiWrench } from "@mdi/js";
import Link from "next/link";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import NProgress from "nprogress";
import NProgressBar from "./NProgressBar";
import { useRouter } from "next/router";
NProgress.configure({
    parent: "#nprogress-parent",
});

const
    useStyles = makeStyles(theme => ({
        appBar: {
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${65}px)`,
                marginLeft: 65,
            },
            //boxShadow: "none",
            //position: "fixed",
            backgroundColor: theme.palette.background.default,
            //color: theme.palette.text.primary,
            padding: 0,
            borderRadius: 0,
            zIndex: 1200,
            height: 60,
            //borderBottom: `4px solid ${theme.palette.primary.main}`,
        },
        navIconHide: {
            [theme.breakpoints.up("md")]: {
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
            //backgroundColor: theme.palette.background.paper,
            //color: theme.palette.text.primary,
            //"& *": {
                //fontFamily: theme.typography.fontFamily,
            //},
            padding: 0,
            borderRadius: 0,
        },
        drawerLarge: {
            width: 65,
        },
        mr: {
            marginRight: 4,
            position: "relative",
        },
        linksContainer: {
            padding: 8,
            display: "flex",
            flexDirection: "column",
        },
        navItem: {
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            borderRadius: 8,
            marginBottom: 8,
            height: "48px !important",
            paddingLeft: "12px !important",
            paddingRight: "12px !important",
        },
        progressContainer: {
            position: "relative",
            zIndex: 1000000,
            height: 4,
        },
        homeDivider: {
            marginTop: -4,
            marginBottom: 4,
        }
    }));
const Nav = memo(() => {
    const
        pathname = usePathname(),
        router = useRouter(),
        [mobileOpen, setMobileOpen] = useState(false),
        [notificationOpen, setNotificationOpen] = useState(false),
        dispatch = useDispatch(),
        classes = useStyles(),
        role = ["student", "teacher"][0],//useSelector(s => s.userInfo.role),
        iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent),
        icons = {
            "Books": mdiBook,
            "Classes": mdiAccountGroup,
            "Chats": mdiChat,
            "Timetable": mdiTimetable,
            "Calendar": mdiCalendar,
            "Tools": mdiWrench,
            "Reminders": mdiFormatListChecks,
            "Settings": mdiCog,
            "School": mdiSchool,
            "Home": mdiHome
        },
        links = () => {
            switch (role) {
                case "student":
                    return ["Home", "Books", "Classes", "Chats", "Timetable", "Calendar", "Tools", "Reminders", "Settings"];
                case "teacher":
                    return ["Home", "Classes", "Chats", "Timetable", "Calendar", "Tools", "Reminders", "Settings"];
                default:
                    return ["Home", "School", "Chats", "Calendar", "Tools", "Reminders", "Settings"];
            }
        },
        DrawerItems = (small: boolean) => (
            <>
                <Box p={"8px 8px 0px 8px"}>
                    {links().map(link => (
                        <Link href={"/" + link.toLowerCase()} key={link}>
                            <Tooltip placement="left" title={link} {...(small ? {open: false} : {})}>
                                <div>
                                <ListItem
                                    button
                                    //component={BtnLink}
                                    href={"/" + link.toLowerCase()}
                                    selected={link.toLowerCase() === location.pathname.split("/")[1]}
                                    //selected={link === "Home"}
                                    className={classes.navItem}
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        //color: link.toLowerCase() === pathname.split("/")[1] ? "primary.main" : "text.primary"
                                    }}
                                >
                                    <Icon path={icons[link]} />
                                    {small && (
                                        <ListItemText primary={link} className={"ml_16"} />
                                    )}
                                </ListItem>
                                {link === "Home" && (
                                    <Divider className={classes.homeDivider} />
                                )}
                                </div>
                        </Tooltip>
                        </Link>
                    ))}
                </Box>
            </>
        );
    useEffect(() => {
        router.events.on("routeChangeStart", NProgress.start);
        router.events.on("routeChangeComplete", NProgress.done);
        router.events.on("routeChangeError", NProgress.done);
        return () => {
            router.events.off("routeChangeStart", NProgress.start);
            router.events.off("routeChangeComplete", NProgress.done);
            router.events.off("routeChangeError", NProgress.done);
        }
    }, []);
    return (
        <>
            <AppBar className={classes.appBar} color="default" position="relative">
                <Toolbar disableGutters={true}>
                    <Tooltip title="Menu">
                        <IconButton
                            aria-label="Open drawer"
                            color="inherit"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={classes.navIconHide}
                        >
                            <Icon path={mdiMenu} />
                        </IconButton>
                    </Tooltip>
                    <div className={"ml_auto"}>
                        <Tooltip title="Notifications">
                            <IconButton
                                className={clsx(classes.mr, "ml_auto")}
                                onClick={() => setNotificationOpen(true)}
                                color="inherit"
                            >
                                <Icon path={mdiBell} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="More Options">
                            <IconButton
                                className={classes.mr}
                                onClick={() => dispatch({
                                    type: "/moreActions/open",
                                })}
                                color="inherit"
                            >
                                <Icon path={mdiDotsHorizontal} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
                <div id="nprogress-parent" className={classes.progressContainer}>
                    <Box position="absolute" bgcolor="primary.main" height={"4px"} width={1} />
                    <NProgressBar />
                </div>
            </AppBar>
            <SwipeableDrawer
                variant="temporary"
                anchor="right"
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onOpen={() => setNotificationOpen(true)}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true,
                }}
                disableDiscovery
                hysteresis={0.32}
                minFlingVelocity={256}
                disableBackdropTransition={!iOS}
            >
                <div className={classes.linksContainer}>
                    <Typography variant="h5">Notifications</Typography>
                </div>
            </SwipeableDrawer>
            <Hidden mdUp>
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
                    hysteresis={0.32}
                    minFlingVelocity={256}
                >
                    {DrawerItems(true)}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown>
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