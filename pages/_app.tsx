
import React, { useState, useEffect, ReactChild, useRef } from "react";
import Head from "next/head";
import { createMuiTheme, ThemeProvider as Theme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import type { AppProps } from "next/app";
import { Provider as Redux } from "react-redux";
import { createStore } from "redux";
import { MuiPickersUtilsProvider as Pickers } from "@material-ui/pickers";
import DateUtils from "@date-io/date-fns";
import "date-fns";
import { ProviderContext, SnackbarProvider as Snackbar } from "notistack";
import { IconButton } from "@material-ui/core";
import Icon from "../components/Icon";
import { mdiClose } from "@mdi/js";
import store from "../store";
import { Provider as Auth, useSession } from "next-auth/client";
import { useRouter } from "next/router";
function ThemeWrapper({ children }: {children: ReactChild}) {
    const
        [mounted, setMounted] = useState(false),
        theme = {
            type: undefined,
            primary: "#fff",
            secondary: "#fff",
            fontFamily: "Roboto"
            //useSelector(s => s.theme),
        },
        paperBg = theme.type === "light" ? "#f1f3f4" : "#424242",
        defaultBg = theme.type === "light" ? "#fff" : "#121212",
        level1Bg = theme.type === "light" ? "#ddd" : "#333",
        fontFamily = `https://fonts.googleapis.com/css?family=${theme.fontFamily.toLowerCase().split(" ").map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join("+")}:300,400,500`,
        router = useRouter(),
        muiTheme = createMuiTheme({
            palette: {
                primary: {
                    main: theme.primary,
                },
                secondary: {
                    main: theme.secondary,
                },
                type: theme.type,
                background: {
                    default: defaultBg,
                    paper: paperBg,
                    level1: level1Bg,
                } as any,
            },
            typography: {
                //fontFamily: theme.fontFamily,
            },
            overrides: {
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
                        "&, &:active, &:focus, &:hover": {
                            boxShadow: "none !important",
                        },
                        borderRadius: 8,
                        textTransform: "capitalize",
                    },
                    outlined: {
                        borderWidth: "2px !important",
                    },
                },
                /*MuiAutocomplete: {
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
                },*/
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
                MuiToolbar: {
                    root: {
                        minHeight: "56px !important",
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
                /*MuiAlert: {
                    root: {
                        borderRadius: 8,
                        width: "100%",
                    },
                },*/
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
            },
            props: {
                MuiButton: {
                    variant: "contained",
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
    useEffect(() => setMounted(true), []);
    useEffect(() => {
        //router.
        console.log(router.pathname);
        
    }, [router.pathname]);
    return (
        <>
            <Head>
                <link rel="stylesheet" href={fontFamily} />
            </Head>
            {!mounted ? <div /> : (
                <Theme theme={muiTheme}>
                    <CssBaseline />
                    {children}
                </Theme>
            )}
        </>
    );
}
export default ({ Component, pageProps }: AppProps) => {
    const
        [session, loading] = useSession(),
        snack = useRef();
    useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    return (
        <Redux store={store}>
            <Auth session={pageProps.session}>
                <Pickers utils={DateUtils}>
                    <Snackbar
                        ref={snack}
                        action={key => (
                            <IconButton size="small" onClick={() => (snack.current as ProviderContext).closeSnackbar(key)}>
                                <Icon path={mdiClose} />
                            </IconButton>
                        )}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                    >
                        <Head>
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                            <meta charSet="utf-8" />
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
            </Auth>
        </Redux>
    );
}