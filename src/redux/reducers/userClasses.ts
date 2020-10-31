import { pick } from "lodash";
import IAction from "../../types/action";

export default function userClasses(state = [], action: IAction) {
    switch (action.type) {
        case "UPLOAD_DATA":
            return action.payload.classes;
        case "UPDATE_CLASSES":
            return action.payload;
        case "/classes/delete":
            return state.filter(x => x._id !== action.payload);
        case "/classes/create":
            if (!state.find(x => x._id === action.payload.class_id)) {
                return [...state, action.payload];
            }
            return state;
        case "/classes/member/join":
            return state.map(c => c._id === action.payload._id ? {
                ...c,
                member_ids: [...state[c._id].member_ids, {
                    ...pick(action.payload, ["email", "icon", "name"]),
                    _id: action.payload.user_id
                }]
            } : c);
        default:
            if (action.type === "/classes/member/leave" || action.type === "/classes/member/remove") {
                return state.map(c => c._id === action.payload._id ? {
                    ...c,
                    member_ids: [...state[c._id].member_ids, action.payload.user_id]
                } : c);
            }
            return state;
    }
};