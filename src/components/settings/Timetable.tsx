import React, { memo } from "react";
import useRequest from "../../hooks/useRequest";
import { useSelector } from "react-redux";
//import { dispatchEmit } from "../../api/socketDispatch";
import { Box, FormControlLabel, Switch, Button } from "@material-ui/core";
import MarginDivider from "../MarginDivider";
import Link from "next/link";
export default memo(() => {
    const
        request = useRequest(),
        periodsLength = 5,//useSelector(s => s.timetable.periods.length),
        sat = false,//useSelector(s => s.timetable.lessons.length === 6),
        change = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            request.put("/timetable/sat", {
                failedMsg: "updating your timetable",
                body: {
                    sat: checked,
                    length: periodsLength,
                },
                done: () => {}//dispatchEmit("/timetable/sat", checked),
            });
            /*request("/timetable/sat", "PUT", false, () => {
                dispatchEmit("/timetable/sat", checked);
            }, "updating your timetable", {
                sat: checked,
                length: periodsLength,
            });*/
        };
    return (
        <>
            <div className={"full_width mb_8"}>
                <FormControlLabel
                    //disabled={periodsLength === 0}
                    control={
                        <Switch
                            checked={sat}
                            onChange={change}
                            value="checked"
                        />
                    }
                    label="Saturday on timetable"
                />
            </div>
            <Link href="/timetable/search">
                <Button component="a" color="secondary">
                    Change Template
                </Button>
            </Link>
            <MarginDivider />
        </>
    );
});