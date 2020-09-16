import IAction from "../../types/action";

export default (state = localStorage.getItem("carouselView") === "1", action: IAction) => {
    switch (action.type) {
        case "/user/carouselView":
            return Boolean(action.payload);
        case "UPLOAD_DATA":
            return Boolean(action.payload.carouselView);
        default:
            return state;
    }
}