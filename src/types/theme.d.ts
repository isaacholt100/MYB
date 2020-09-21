import { CSSProperties } from "react";

declare module "@material-ui/core/styles/createMuiTheme" {
    interface Theme {
        background: {
            level1: CSSProperties["color"]
        }
    }
}