import NProgress from "nprogress";
import { withStyles } from "@material-ui/core/styles";

NProgress.configure({
    template: `<div class="nprogress-bar" role="bar"></div>`,
    showSpinner: false,
});
export default withStyles(({ palette }) => ({
    "@global": {
        "#nprogress": {
            direction: "ltr",
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: palette.background.default,//Color(palette.primary.main).lighten(0.75).toString(),
            "& .nprogress-bar": {
                backgroundColor: palette.primary.main,
                height: 4,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            },
        },
    },
}), { flip: false, name: "MuiNProgressBar" })(() => null);