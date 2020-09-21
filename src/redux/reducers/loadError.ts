import IAction from "../../types/action";

export default (state = "", action: IAction) => action.type === "LOAD_ERROR"
    ? action.payload : action.type === "URL_CHANGE"
        ? "" : state;