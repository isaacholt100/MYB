import IAction from "../../types/action";

export default function carouselView(state = false, action: IAction) {
    switch (action.type) {
        case "/user/carouselView":
            return Boolean(action.payload);
        case "UPLOAD_DATA":
            return Boolean(action.payload.carouselView);
        default:
            return state;
    }
}