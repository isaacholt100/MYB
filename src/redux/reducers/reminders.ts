//import { ObjectId } from "mongodb";
import IAction from "../../types/action";

export default function reminders(state = [], action: IAction) {
    switch(action.type) {
        case "/reminder/create":
            return [action.payload, ...state];
        //case "/reminder/undo":
            //return [...state.filter(r => new ObjectId(r._id) > new ObjectId(action.payload._id)), action.payload, ...state.filter(r => new ObjectId(r._id) < new ObjectId(action.payload._id))];
        case "/reminder/delete":
            return state.filter(x => x._id !== action.payload);
        case "/reminder/update":
            return state.map(r => r._id === action.payload._id ? action.payload : r);
        case "/reminders/upload":
            return action.payload;
        case "UPLOAD_DATA":
            return action.payload.reminders;
        default:
            return state;
    }
}