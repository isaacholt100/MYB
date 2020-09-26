/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useEffect } from "react";
import useRequest, { usePut } from "../../hooks/useRequest";
import { useSelector, useDispatch } from "react-redux";
//import socket from "../../api/socket";
import { FormControlLabel, Switch, Grid, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import FontSettings from "./Font";
import ColorPicker from "./ColorPicker";
import { shades, colors } from "../../json/colors";
//import useSocket from "../../hooks/useSocket";
import { useTheme } from "../../context/Theme";
type Intent = "primary" | "secondary";
export default memo(() => {
    const
        [put] = usePut(),
        //socket = useSocket(),
        [theme, setTheme] = useTheme(),
        huesAndShades = (col: string, intent: Intent) => {
            const hue = Object.keys(colors).find(key => Object.values(colors[key]).includes(col));
            return {
                [intent + "Hue"]: hue,
                [intent + "Shade"]: Object.keys(colors[hue]).find(key => colors[hue][key] === col),
            };
        },
        [themeState, setThemeState] = useState(() => ({
            ...huesAndShades(theme.primary, "primary"),
            ...huesAndShades(theme.secondary, "secondary")
        })),
        dispatch = useDispatch(),
        //carouselView = useSelector(s => s.carouselView),
        handleChangeHue = (name: Intent) => e => {
            setThemeState({
                ...themeState,
                [name + "Hue"]: e.target.value,
            });
            const payload = colors[e.target.value][themeState[`${name}Shade`]];
            setTheme({ [name]: payload });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: `theme.${name}`,
                    val: payload,
                },
                done: () => {}//socket.emit("user message", "/theme", { [name]: payload }),
            });
        },
        handleChangeShade = (name: Intent) => (e, shade) => {
            setThemeState({
                ...themeState,
                [`${name}Shade`]: shades[shade],
            });
        },
        endChangeShade = (name: Intent) => (e: React.ChangeEvent<{}>, shade: number) => {
            const payload = colors[themeState[name + "Hue"]][shades[shade]];
            setTheme({ [name]: payload });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: `theme.${name}`,
                    val: payload,
                },
                done: () => {}//socket.emit("user message", "/theme", { [name]: payload }),
            });
        },
        resetTheme = () => {
            dispatch({
                type: "/theme/reset",
            });
            setThemeState({
                primaryShade: "500",
                secondaryShade: "500",
                primaryHue: "indigo",
                secondaryHue: "indigo",
            });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: `theme`,
                    val: {},
                },
                done: () => {}//socket.emit("user message", "/theme/reset")
            });
        },
        changeCarouselView = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            dispatch({
                type: "/user/carouselView",
                payload: checked,
            });
            put("/user/carouselView", {
                failedMsg: "updating the theme",
                body: {
                    carouselView: checked,
                },
                done: () => {}//socket.emit("user message", "/user/carouselView", checked)
            });
        },
        handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            const type = checked ? "dark" : "light";
            setTheme({ type });
            put("/user/settings/theme", {
                failedMsg: "updating the theme",
                body: {
                    path: "theme.type",
                    val: type,
                },
                done: () => {}//socket.emit("user message", "/theme", { type })
            });
        };
    useEffect(() => {
        /*socket.on("/theme/reset", () => setThemeState({
            primaryShade: "500",
            secondaryShade: "500",
            primaryHue: "indigo",
            secondaryHue: "indigo",
        }));
        socket.on("/theme", obj => {
            if (obj.primary) {
                setThemeState({
                    ...themeState,
                    ...huesAndShades(obj.primary, "primary"),
                });
            }
            if (obj.secondary) {
                setThemeState({
                    ...themeState,
                    ...huesAndShades(obj.secondary, "secondary"),
                });
            }
        });*/
    }, []);
    return (
        <>
            <FormControlLabel
                control={
                    <Switch
                        checked={theme.type === "dark"}
                        onChange={handleTypeChange}
                        value="Theme"
                    />
                }
                label="Dark Theme"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={false}//carouselView}
                        onChange={changeCarouselView}
                        value="checked"
                    />
                }
                label="Condensed view"
            />
            <MarginDivider />
            <Grid container spacing={1}>
                <ColorPicker intent="primary" shade={themeState.primaryShade} hue={themeState.primaryHue} handleChangeHue={handleChangeHue} handleChangeShade={handleChangeShade} endChangeShade={endChangeShade} />
                <ColorPicker intent="secondary" shade={themeState.secondaryShade} hue={themeState.secondaryHue} handleChangeHue={handleChangeHue} handleChangeShade={handleChangeShade} endChangeShade={endChangeShade} />
            </Grid>
            <MarginDivider />
            <FontSettings />
            <Button color="secondary" onClick={resetTheme}>
                Reset Theme
            </Button>
        </>
    );
});