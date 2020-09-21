import initialTheme from "../../json/defaultTheme.json";
import IAction from "../../types/action";

export default (state = {
    ...initialTheme,
    //...(getCookie("theme") && getCookie("refresh") !== "" ? JSON.parse(getCookie("theme")) : {})
}, action: IAction) => {
    switch (action.type) {
        case "/theme":
            return {
                ...state,
                ...action.payload,
            };
        case "UPLOAD_DATA":
            return {...initialTheme, ...action.payload.theme};
        case "CHANGE_THEME":
            return {...initialTheme, ...action.payload};
        case "CHANGE_PRIMARY":
            return {
                ...state,
                primary: action.payload,
            };
        case "CHANGE_SECONDARY":
            return {
                ...state,
                secondary: action.payload,
            };
        case "CHANGE_THEME_TYPE":
            return {
                ...state,
                type: action.payload,
            };
        case "CHANGE_FONT_FAMILY":
            return {
                ...state,
                fontFamily: action.payload,
            }
        case "/theme/reset":
            return initialTheme;
        case "LOGOUT":
            return initialTheme;
        default:
            return state;
    };
};
