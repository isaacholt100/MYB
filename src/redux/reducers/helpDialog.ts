import IAction from "../../types/action";

export default function helpDialog(state = null, action: IAction) {
    return action.type === "OPEN_HELP_DIALOG" ? action.payload : state;
}