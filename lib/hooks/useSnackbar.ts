import { useSnackbar } from "notistack";
import { ReactNode } from "react";

export default () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return {
        open: enqueueSnackbar,
        close: closeSnackbar,
        error(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "error" });
        },
        info(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "error" });
        },
        success(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "success" });
        },
        warn(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "warning" });
        }
    }
}