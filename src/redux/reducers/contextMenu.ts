import IAction from "../../types/action";

export default (state = {mouse: [null, null], items: []}, action: IAction) => {
    switch (action.type) {
        case "OPEN_CONTEXT_MENU":
            return action.payload;
        case "CLOSE_CONTEXT_MENU":
            return {
                ...state,
                mouse: [null, null],
            };
        default:
            return state;
    }
}