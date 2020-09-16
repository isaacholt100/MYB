import IAction from "../../types/action";

export default (state = { msg: "", options: {} }, action: IAction) => {
    switch (action.type) {
        case "/snackbar":
            return {
                msg: action.payload.msg,
                options: action.payload.options,
            };
        default:
            return state;
    }
};