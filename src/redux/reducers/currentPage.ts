import IAction from "../../types/action";

export default function currentPage(state = "Loading...", action: IAction) {
    return action.type === "CHANGE_PAGE_TITLE" && action.payload !== undefined ? action.payload : state;
}