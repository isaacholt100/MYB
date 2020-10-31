import IAction from "../../types/action";
import defaultTimetable from "../../json/defaultTimetable.json";

export default function timetable(state = defaultTimetable, action: IAction) {
    switch (action.type) {
        case "UPLOAD_DATA":
            return action.payload.timetable ? {
                periods: action.payload.timetable.periods,
                lessons: action.payload.timetable.lessons.filter(l => l),
            } : defaultTimetable;
        case "/timetable/upload":
            return action.payload || defaultTimetable;
        case "/timetable/sat":
            return {
                periods: state.periods,
                lessons: action.payload
                    ? [...state.lessons, Array(state.periods.length).fill({
                        s: "",
                        t: "",
                        r: ""
                    })]
                    : state.lessons.filter((x, i) => i < 5),
            }
        case "/timetable/update":
            return {
                ...state,
                lessons: state.lessons.map((x, i) => i !== action.payload.day ? x : x.map((y, j) => j !== action.payload.period ? y : {...y, [action.payload.key]: action.payload.value}))
            };
        default:
            return state;
    }
}