import { createContext, ReactChild, useContext, useState } from "react";
import useSWR from "swr";
import defaultTheme from "../json/defaultTheme.json";
interface ITheme {
    fontFamily: string;
    primary: string;
    secondary: string;
    type: "light" | "dark";
}
export const ThemeContext = createContext({});
export default function Theme({ children }: { children: ReactChild }) {
    const
        [theme, setTheme] = useState(typeof(localStorage) !== "undefined" ? {
            primary: localStorage.getItem("theme-primary") || defaultTheme.primary,
            secondary: localStorage.getItem("theme-secondary") || defaultTheme.secondary,
            type: localStorage.getItem("theme-type") as "light" | "dark" || defaultTheme.type,
            fontFamily: localStorage.getItem("theme-fontFamily") || defaultTheme.fontFamily,
        } : defaultTheme),
        dispatch = (t: Partial<ITheme>) => {
            const newTheme = t ? {
                ...theme,
                ...t,
            } : defaultTheme;
            setTheme(newTheme);
            if (t) {
                for (let key in t) {
                    localStorage.setItem("theme-" + key, t[key]);
                }
            } else {
                localStorage.removeItem("theme-primary");
                localStorage.removeItem("theme-secondary");
                localStorage.removeItem("theme-type");
                localStorage.removeItem("theme-fontFamily");
            }
        };
    return (
        <ThemeContext.Provider value={[theme, dispatch]}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = (): [ITheme, (theme: Partial<ITheme>) => void] => useContext(ThemeContext) as any;