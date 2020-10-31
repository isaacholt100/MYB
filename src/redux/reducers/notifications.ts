import IAction from "../../types/action";

export default function notifications(state = [], action: IAction) {
    if (!action.notify) {
        return state;
    }
    switch (action.type) {
        default:
            return state;
    }
};