import { useTheme } from "@material-ui/core";

export default function useContrastText() {
    return useTheme().palette.getContrastText;
}