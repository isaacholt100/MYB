import IAction from "../../types/action";

export default (state = null, action: IAction) => action.type === "OPEN_HELP_DIALOG" ? action.payload : state;