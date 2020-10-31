import IAction from "../../types/action";

export default function moreActions(state = { open: false, actions: [] }, action: IAction) {
    switch (action.type) {
        case "/moreActions/close":
            return {
                ...state,
                open: false,
            };
        case "/moreActions":
            return {
                open: false,
                actions: action.payload
            };
        case "/moreActions/open":
            return {
                ...state,
                open: true,
            };
        default:
            return state;
    }
}