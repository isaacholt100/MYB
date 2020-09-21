import IAction from "../../types/action";

export default (state = "Loading...", action: IAction) => action.type === "CHANGE_PAGE_TITLE" && action.payload !== undefined ? action.payload : state;