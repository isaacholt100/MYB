/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, memo, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
    BottomNavigation,
    BottomNavigationAction,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import Icon from "./Icon";
import { mdiAccountGroup, mdiCog, mdiHome, mdiSeal } from "@mdi/js";
import Link from "next/link";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import NProgress from "nprogress";
import NProgressBar from "./NProgressBar";
import { useRouter } from "next/router";
import MoreActions from "./MoreActions";
import usePathname from "../hooks/usePathname";
import { startCase } from "lodash";
import styles from "../css/nav.module.css";

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
            backgroundColor: theme.palette.background.default,
            padding: 0,
            borderRadius: 0,
            zIndex: 1200,
            height: 60,
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
            padding: 0,
            borderRadius: 0,
        },
        drawerLarge: {
            width: 65,
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
        },
        logo: {
            margin: -8,
            userSelect: "none",
            msUserSelect: "none",
            MozUserSelect: "none",
            WebkitUserSelect: "none",
        },
    }));

const icons = {
    "Home": mdiHome,
    "Prizes": mdiSeal,
    "Members": mdiAccountGroup,
    "Settings": mdiCog,
};
const BottomNav = memo(() => {
    const pathname = startCase(usePathname());
    const router = useRouter();
    return (
        <BottomNavigation value={icons[pathname] ? pathname : ""} className={styles.bottom_nav}>
            {Object.keys(icons).map(link => (
                <BottomNavigationAction label={link} value={link} icon={<Icon path={icons[link]} />} selected onClick={() => router.push("/" + link.toLowerCase())} />
            ))}
        </BottomNavigation>
    );
});
const Nav = memo(() => {
    const
        router = useRouter(),
        classes = useStyles();
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
                </Toolbar>
                <div id="nprogress-parent" className={classes.progressContainer}>
                    <Box position="absolute" bgcolor="primary.main" height={"4px"} width={1} />
                    <NProgressBar />
                </div>
            </AppBar>
            <Hidden smUp>
                <BottomNav />
            </Hidden>
            <Hidden xsDown>
                <Drawer
                    variant="permanent"
                    open
                    classes={{
                        paper: clsx(classes.drawerPaper, classes.drawerLarge),
                    }}
                >
                    <Box p={"8px 8px 0px 8px"}>
                        {Object.keys(icons).map(link => (
                            <Fragment key={link}>
                                <Link href={"/" + link.toLowerCase()}>
                                    <div>
                                        <Tooltip placement="left" title={link}>
                                            <ListItem
                                                button
                                                href={"/" + link.toLowerCase()}
                                                selected={link.toLowerCase() === router.pathname.split("/")[1] || (link === "Home" && router.pathname === "/")}
                                                className={classes.navItem}
                                            >
                                                <Icon path={icons[link]} />
                                            </ListItem>
                                        </Tooltip>
                                    </div>
                                </Link>
                            </Fragment>
                        ))}
                    </Box>
                </Drawer>
            </Hidden>
        </>
    );
});
export default function Navigation() {
    const loggedIn = useIsLoggedIn();
    return loggedIn ? <Nav /> : null;
}