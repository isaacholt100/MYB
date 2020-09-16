import IAction from "../../types/action";

export default (state = {
    email: 'getCookie("email")',
    name: 'getCookie("name")',
    icon: 'getCookie("icon")',
    _id: 'getCookie("user_id")',
    role: 'getCookie("role")',
}, action: IAction) => {
    switch (action.type) {
        case "/user/info/update":
            return {
                ...state,
                ...action.payload
            };
        case "UPLOAD_DATA":
            return {
                ...state,
                ...action.payload.userInfo,
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