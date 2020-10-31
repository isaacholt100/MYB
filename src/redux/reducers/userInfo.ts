import Cookies from "js-cookie";
import IAction from "../../types/action";

export default function userInfo(state = {
    _id: Cookies.get("user_id"),
}, action: IAction) {
    switch (action.type) {
        case "/user/info/update":
            return {
                ...state,
                ...action.payload
            };
        case "UPLOAD_DATA":
            return {
                email: action.payload.email,
                name: action.payload.name,
                icon: action.payload.icon,
                _id: action.payload._id,
                role: action.payload.role,
            };
        case "LOGOUT":
            return {
                email: "",
                name: "",
                icon: "",
                _id: "",
                role: "",
            };
        default:
            return state;
    }
}