import IAction from "../../types/action";

export default (state = null, action: IAction) => action.type === "USERS_DIALOG" ? action.payload : state;