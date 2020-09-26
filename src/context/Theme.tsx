import { IDBPDatabase, openDB } from "idb";
import { createContext, ReactChild, ReactChildren, useContext, useEffect, useReducer, useState } from "react";
import useSWR from "swr";
import defaultTheme from "../json/defaultTheme.json";
interface ITheme {
    fontFamily: string;
    primary: string;
    secondary: string;
    type: "light" | "dark";
}
export const ThemeContext = createContext({});
function reducer(state: ITheme, action: { type: string; payload: ITheme }) {
    switch (action.type) {
        case "/theme":
            return {
                ...state,
                ...action.payload,
            }
        default:
            throw new Error("Unrecognised action type for theme reducer");
    }
}
const useDB = async () => {
    return openDB("data", 1, {
        upgrade(db) {
            db.createObjectStore("user");
        }
    });
}
export default function Theme({ children }: { children: ReactChild }) {
    const
        { data, error, mutate } = useSWR("/api/user/settings/theme", url => fetch(url).then(res => res.json()), {
            refreshInterval: 1000
        }),
        [theme, setTheme] = useState(typeof(localStorage) !== "undefined" ? {
            primary: localStorage.getItem("theme-primary") || defaultTheme.primary,
            secondary: localStorage.getItem("theme-secondary") || defaultTheme.secondary,
            type: localStorage.getItem("theme-type") as "light" | "dark" || defaultTheme.type,
            fontFamily: localStorage.getItem("theme-fontFamily") || defaultTheme.fontFamily,
        } : defaultTheme),
        dispatch = (t: Partial<ITheme>) => {
            const newTheme = {
                ...theme,
                ...(t || defaultTheme),
            }
            mutate(newTheme, false);
            setTheme(newTheme);
            for (let key in t) {
                localStorage.setItem("theme-" + key, t[key]);
            }
        };
        console.log({data});
        
    return (
        <ThemeContext.Provider value={[data?.theme || theme, dispatch]}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = (): [ITheme, (theme: Partial<ITheme>) => void] => useContext(ThemeContext) as any;