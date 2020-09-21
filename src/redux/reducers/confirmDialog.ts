import IAction from "../../types/action";

export default (state = { msg: null, fn: () => {} }, action: IAction) => {
    switch (action.type) {
        case "CLOSE_CONFIRM_DIALOG":
            return {
                msg: null,
                fn: () => {},
            };
        case "OPEN_CONFIRM_DIALOG":
            return action.payload;
        default:
            return state;
    }
}