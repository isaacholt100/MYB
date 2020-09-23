import { createContext, ReactChild, ReactChildren, useContext, useReducer, useState } from "react";
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
export default function Theme({ children }: { children: ReactChild }) {
    const
        [theme, setTheme] = useState(defaultTheme as ITheme),
        dispatch = (t: ITheme) => {
            setTheme({
                ...theme,
                ...t,
            });
        };
    return (
        <ThemeContext.Provider value={[theme, dispatch]}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = (): [ITheme, (theme: ITheme) => void] => useContext(ThemeContext) as any;