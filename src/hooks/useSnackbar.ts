import { useSnackbar as useSnack } from "notistack";
import { ReactNode } from "react";

export default function useSnackbar() {
    const { enqueueSnackbar, closeSnackbar } = useSnack();
    return {
        open: enqueueSnackbar,
        close: closeSnackbar,
        error(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "error" });
        },
        info(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "info" });
        },
        success(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "success" });
        },
        warn(msg: ReactNode) {
            enqueueSnackbar(msg, { variant: "warning" });
        }
    }
}