import React from "react";
import { CircularProgress, CircularProgressProps, } from "@material-ui/core";

export default (props: CircularProgressProps) => (
    <div className={"flex flex_1 align_items_center justify_content_center full_width"}>
        <CircularProgress disableShrink {...props}  />
    </div>
);