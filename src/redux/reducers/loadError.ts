import IAction from "../../types/action";

export default function loadError(state = "", action: IAction) {
    return action.type === "LOAD_ERROR"
    ? action.payload : action.type === "URL_CHANGE"
        ? "" : state;
}