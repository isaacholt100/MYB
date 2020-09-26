import { useState, useEffect, ReactChild, useRef, MutableRefObject } from "react";
import Head from "next/head";
import { createMuiTheme, makeStyles, ThemeProvider as MuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import type { AppProps } from "next/app";
import { Provider as Redux } from "react-redux";
import { MuiPickersUtilsProvider as Pickers } from "@material-ui/pickers";
import DateUtils from "@date-io/date-fns";
import "date-fns";
import { ProviderContext, SnackbarProvider as Snackbar } from "notistack";
import { Box, Grow, IconButton } from "@material-ui/core";
import Icon from "../components/Icon";
import { mdiClose } from "@mdi/js";
import store from "../redux/store";
import { useRouter } from "next/router";
import Theme, { useTheme } from "../context/Theme";
import { SWRConfig } from "swr";
import Navigation from "../components/Navigation";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import Cookies from "js-cookie";

function ThemeWrapper({ children }: { children: ReactChild }) {
    const
        //[mounted, setMounted] = useState(true),
        isLoggedIn = useIsLoggedIn(),
        [theme] = useTheme(),
        paperBg = theme.type === "light" ? "#f1f3f4" : "#424242",
        defaultBg = theme.type === "light" ? "#fff" : "#121212",
        level1Bg = theme.type === "light" ? "#ddd" : "#333",
        fontFamily = `https://fonts.googleapis.com/css?family=${theme.fontFamily.toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join("+")}:300,400,500`,
        classes = useContainerStyles(isLoggedIn),
        muiTheme = createMuiTheme({
            palette: {
                primary: {
                    main: theme.primary,
                },
                secondary: {
                    main: theme.secondary,
                },
                type: theme.type as any,
                background: {
                    default: defaultBg,
                    paper: paperBg,
                    level1: level1Bg,
                } as any,
            },
            typography: {
                fontFamily: `"${theme.fontFamily}", "Helvetica", "Arial", sans-serif`,
            },
            overrides: {
                MuiCssBaseline: {
                    "@global": {
                        "html, body, body > #__next": {
                            width: "100vw",
                            height: "100vh",
                            fontFamily: theme.fontFamily,
                        },
                    }
                },
                MuiMenu: {
                    paper: {
                        border: `2px solid gray`,
                        "& li:first-child .MuiTouchRipple-root": {
                            borderRadius: "14px 14px 0 0",
                        },
                        "& li:last-child .MuiTouchRipple-root": {
                            borderRadius: "0 0 14px 14px",
                        },
                        "& li:only-child .MuiTouchRipple-root": {
                            borderRadius: 14,
                        },
                        overflowX: "hidden !important" as any,
                    },
                    list: {
                        padding: 0,
                    },
                },
                MuiDivider: {
                    root: {
                        height: 2,
                    },
                },
                MuiTab: {
                    root: {
                        textTransform: "capitalize",
                    },
                },
                MuiListItem: {
                    gutters: {
                        paddingLeft: 8,
                        paddingRight: 8,
                    },
                    dense: {
                        paddingTop: 0,
                        paddingBottom: 0,
                    },
                },
                MuiButton: {
                    root: {
                        borderRadius: 8,
                        textTransform: "capitalize",
                    },
                    outlined: {
                        borderWidth: "2px !important",
                        "& .MuiTouchRipple-root": {
                            borderRadius: 6,
                        }
                    },
                },
                MuiAutocomplete: {
                    paper: {
                        border: `2px solid gray`,
                        borderRadius: 8,
                    },
                    listbox: {
                        padding: 0,
                        maxHeight: 256,
                    },
                    option: {
                        minHeight: 36,
                    },
                },
                MuiOutlinedInput: {
                    root: {
                        borderRadius: 8,
                    },
                    notchedOutline: {
                        borderWidth: 2,
                    },
                },
                MuiCardActionArea: {
                    root: {
                        borderRadius: 16,
                        overflow: "hidden",
                    },
                    focusHighlight: {
                        borderRadius: 16,
                    },
                },
                MuiMenuItem: {
                    root: {
                        minHeight: 36,
                    },
                },
                MuiToolbar: {
                    regular: {
                        minHeight: "56px !important"
                    },
                },
                MuiPaper: {
                    root: {
                        boxShadow: "none !important",
                        borderRadius: 16,
                    },
                    rounded: {
                        borderRadius: 16,
                    },
                },
                MuiCard: {
                    root: {
                        padding: 16,
                    },
                },
                MuiDialog: {
                    paper: {
                        borderRadius: 16,
                        margin: 16,
                        width: "100%",
                    },
                },
                MuiSelect: {
                    root: {
                        borderRadius: "8px !important",
                    },
                },
                MuiDialogContent: {
                    root: {
                        padding: "8px 16px",
                    },
                },
                MuiAlert: {
                    root: {
                        borderRadius: "16px !important",
                        width: "100%",
                    },
                },
                MuiDialogActions: {
                    root: {
                        padding: 16,
                    },
                },
                MuiTabs: {
                    root: {
                        borderRadius: 16,
                    },
                },
                MuiAppBar: {
                    root: {
                        overflow: "hidden",
                    },
                    colorDefault: {
                        backgroundColor: level1Bg,
                    },
                },
                MuiDialogTitle: {
                    root: {
                        textTransform: "capitalize",
                        borderBottom: `4px solid ${theme.primary}`,
                    },
                },
            } as any,
            props: {
                MuiButton: {
                    variant: "contained",
                    disableElevation: true,
                },
                MuiTextField: {
                    size: "small",
                    variant: "outlined",
                },
                MuiFormControl: {
                    size: "small",
                },
            },
        });
    return (
        <>
            <Head>
                <link rel="stylesheet" href={fontFamily} />
            </Head>
            {false ? <div /> : (
                <MuiTheme theme={muiTheme}>
                    <Box display="flex" flexDirection="column" height="100vh" width="100vw">
                        <Navigation />
                        <CssBaseline />
                        <div className={classes.appContainer}>
                            {children}
                        </div>
                    </Box>
                </MuiTheme>
            )}
        </>
    );
}
const useContainerStyles = makeStyles(({ breakpoints }) => ({
    appContainer: {
        width: "100vw",
        //marginTop: props => (props as any) ? 60 : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        [breakpoints.up("md")]: {
            marginLeft: props => (props as any) ? 65 : 0,
            width: props => (props as any) ? "calc(100vw - 65px)" : "100vw",
        },
        "& > *": {
            width: "100%",
            //maxWidth: 2048,
            margin: "0 auto",
            overflowY: "auto",
            overflowX: "hidden",
            flex: 1,
            //height: "100%",
            [breakpoints.up("lg")]: {
                padding: 16,
            },
            padding: 8,
        },
        flex: 1,
        minHeight: 0,
    },
}));
const useStyles = makeStyles(({ palette, typography }) => ({
    snackbar: {
        "& > div": {
            borderRadius: 8,
            width: "100%",
            paddingLeft: 12,
        },
        "& .MuiIconButton-root": {
            color: "inherit",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
        },
    },
    error: {
        backgroundColor: palette.error.main + " !important",
        color: palette.error.contrastText + " !important",
    },
    success: {
        backgroundColor: palette.success.main + " !important",
        color: palette.success.contrastText + " !important",
        "& .MuiIconButton-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
    warning: {
        backgroundColor: palette.warning.main + " !important",
        color: palette.warning.contrastText + " !important",
        "& .MuiIconButton-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
    },
    info: {
        backgroundColor: palette.info.main + " !important",
        color: palette.info.contrastText + " !important",
    },
    bottom: {
        bottom: 4,
        right: 8,
    },
}));
export default ({ Component, pageProps }: AppProps) => {
    const snack: MutableRefObject<ProviderContext> = useRef();
    const classes = useStyles();
    useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <Redux store={store}>
            <SWRConfig
                value={{
                    onError: (err, key, config) => {
                        console.error(err);
                        snack.current.enqueueSnackbar("There was an error loading", {
                            variant: "error",
                        });
                    }
                }}
            >
                    <Theme>
                        <Pickers utils={DateUtils}>
                            <Snackbar
                                ref={snack}
                                action={key => (
                                    <IconButton size="small" onClick={() => snack.current.closeSnackbar(key)}>
                                        <Icon path={mdiClose} />
                                    </IconButton>
                                )}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                preventDuplicate
                                autoHideDuration={8192}
                                TransitionComponent={Grow as any}
                                classes={{
                                    variantError: classes.error,
                                    variantSuccess: classes.success,
                                    variantInfo: classes.info,
                                    variantWarning: classes.warning,
                                    root: classes.snackbar,
                                    containerAnchorOriginBottomRight: classes.bottom,
                                }}
                                maxSnack={4}
                            >
                                <Head>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                                    <meta charSet="utf-8" />
                                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                                    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
                                    <meta name="description" content="<Description Here>" />
                                    <meta name="keywords" content="<Keywords here>" />
                                    <link rel="manifest" href="/manifest.json" />
                                    <link href="/favicons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
                                    <link href="/favicons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
                                    <link rel="apple-touch-icon" href="/favicons/apple-icon.png"></link>
                                    <meta name="theme-color" content="#317EFB" />
                                    <title>Squool</title>
                                </Head>
                                <ThemeWrapper>
                                    <Component {...pageProps} />
                                </ThemeWrapper>
                            </Snackbar>
                        </Pickers>
                    </Theme>
            </SWRConfig>
        </Redux>
    );
}