import IAction from "../../types/action";

export default function usersDialog(state = null, action: IAction) {
    return action.type === "USERS_DIALOG" ? action.payload : state;
}