import React, { memo } from "react";
import useRequest from "../../hooks/useRequest";
import { useSelector } from "react-redux";
import useThemeUpdate from "../../hooks/useThemeUpdate";
import { Typography, TextField } from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import MarginDivider from "../MarginDivider";
//import socket from "../../api/socket";
import fonts from "../../json/googleFonts.json";
import { useTheme } from "../../context/Theme";

export default memo(() => {
    const
        request = useRequest(),
        [{ fontFamily }, setTheme] = useTheme(),
        //fontFamily = useSelector(s => s.theme.fontFamily),
        //updateTheme = useThemeUpdate(),
        updateFontFamily = (f: string) => {
            if (f && fonts.some(i => i.toLowerCase() === f.toLowerCase().trim())) {
                setTheme({ fontFamily: f.trim() });
                request.put("/user/theme", {
                    failedMsg: "updating the theme",
                    body: {
                        path: "theme.fontFamily",
                        val: f,
                    },
                    done: () => {} //socket.emit("user message", "/theme", { fontFamily: f.trim() })
                });
                /*request("/user/theme", "PUT", false, () => {
                    socket.emit("user message", "/theme", { fontFamily: f.trim() });
                }, "updating the theme", {
                    path: "theme.fontFamily",
                    val: f,
                });*/
            }
        };
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Font
            </Typography>
            <Autocomplete
                options={fonts}
                value={fontFamily}
                onChange={(e, newValue) => updateFontFamily(newValue || "")}
                filterOptions={createFilterOptions({
                    limit: 16,
                    trim: true,
                })}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Font family"
                        placeholder="Search for 900 fonts from Google Fonts (try: 'Roboto Slab')"
                        margin="normal"
                        fullWidth
                        onKeyDown={e => e.key === "Enter" && updateFontFamily((e.target as any).value)}
                        onBlur={e => updateFontFamily(e.target.value)}
                    />
                )}
            />
            <MarginDivider />
        </>
    );
});