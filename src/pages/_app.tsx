import { useEffect, ReactChild, useRef, MutableRefObject } from "react";
import Head from "next/head";
import { createMuiTheme, makeStyles, ThemeProvider as MuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider as Pickers } from "@material-ui/pickers";
import DateUtils from "@date-io/date-fns";
import "date-fns";
import { ProviderContext, SnackbarProvider as Snackbar } from "notistack";
import { Grow, IconButton } from "@material-ui/core";
import Icon from "../components/Icon";
import { mdiClose } from "@mdi/js";
import { SWRConfig } from "swr";
import Navigation from "../components/Navigation";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import "../css/global.css";
import useUser from "../hooks/useUser";
import useGroup from "../hooks/useGroup";
import Cookies from "js-cookie";

const PRIMARY = "#1976D2";
const SECONDARY = "#0097A7";
const TYPE = "light";

function ThemeWrapper({ children }: { children: ReactChild }) {
    const
        isLoggedIn = useIsLoggedIn(),
        classes = useContainerStyles(isLoggedIn),
        paperBg = TYPE === "light" ? "#f1f3f4" : "#424242",
        defaultBg = TYPE === "light" ? "#fff" : "#121212",
        level1Bg = TYPE === "light" ? "#ddd" : "#333",
        muiTheme = createMuiTheme({
            palette: {
                primary: {
                    main: PRIMARY,
                },
                secondary: {
                    main: SECONDARY,
                },
                type: "light",
                background: {
                    default: defaultBg,
                    paper: paperBg,
                    level1: level1Bg,
                } as any,
            },
            typography: {
                fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
            },
            overrides: {
                MuiCssBaseline: {
                    "@global": {
                        "html, body, body > #__next": {
                            width: "100vw",
                            height: "100vh",
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
                    root: {
                        borderRadius: 8,
                    }
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
                        borderBottom: `4px solid ${PRIMARY}`,
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
                MuiCircularProgress: {
                    disableShrink: true,
                }
            },
        });
    return (
        <>
            {isLoggedIn && <Listener />}
            <MuiTheme theme={muiTheme}>
                <div className={"flex flex_col full_screen"}>
                    <Navigation />
                    <CssBaseline />
                    <div className={classes.appContainer}>
                        {children}
                    </div>
                </div>
            </MuiTheme>
        </>
    );
}
const Listener = (): null => {
    const user = useUser();
    const school = useGroup();
    process.browser && window.addEventListener("beforeunload", () => {
        for (let key in user) {
            localStorage.setItem(key, user[key]);
        }
        for (let key in school) {
            localStorage.setItem("group_" + key, school[key]);
        }
    });
    return null;
}
const useContainerStyles = makeStyles(({ breakpoints }) => ({
    appContainer: {
        width: "100vw",
        //marginTop: props => (props as any) ? 60 : 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 64,
        [breakpoints.up("sm")]: {
            marginLeft: props => (props as any) ? 65 : 0,
            width: props => (props as any) ? "calc(100vw - 65px)" : "100vw",
            marginBottom: 0,
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
const useStyles = makeStyles(({ palette }) => ({
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
export default function App({ Component, pageProps }) {
    const snack: MutableRefObject<ProviderContext> = useRef();
    const classes = useStyles();
    useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <SWRConfig
            value={{
                onError: (err) => {
                    console.error(err);
                    snack.current.enqueueSnackbar("There was an error loading a request", {
                        variant: "error",
                    });
                },
                fetcher: (url, options) => fetch(url, {
                    ...options,
                    credentials: "include",
                    headers: {
                        "authorization": "Bearer " + Cookies.get("accessToken"),
                        "authorization-refresh": "Bearer " + Cookies.get("refreshToken"),
                        "Access-Control-Expose-Headers": "authorization",
                        "Access-Control-Allow-Headers": "authorization",
                    },
                }).then(res => {
                    const header = res?.headers?.get("authorization");
                    if (header) {
                        Cookies.set("accessToken", header, {sameSite: "strict", ...(true ? { expires: 100 } : {expires: 100})});
                    }
                    return res.json();
                })
            }}
        >
            <Head>
                <title>MYB</title>
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5" />
            </Head>
            <Pickers utils={DateUtils}>
                <Snackbar
                    ref={snack as any}
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
                    <ThemeWrapper>
                        <Component {...pageProps} />
                    </ThemeWrapper>
                </Snackbar>
            </Pickers>
        </SWRConfig>
    );
}