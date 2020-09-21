import IAction from "../../types/action";

export default (state = false, action: IAction) => action.type === "AJAX_LOADING"
    ? action.payload
    : action.type === "CLOSE_CONFIRM_DIALOG" || action.type === "URL_CHANGE"
        ? false : state;