import { useDispatch } from "react-redux";
const getPosition = e => {
    if (!e) {
        e = window.event;
    }
    if (e.pageX || e.pageY) {
        return [
            e.pageX,
            e.pageY
        ];
    } else if (e.clientX || e.clientY) {
        return [
            e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        ];
    }
    return [0, 0];
};
export default function useContextMenu() {
    const dispatch = useDispatch();
    return items => e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
            type: "OPEN_CONTEXT_MENU",
            payload: {
                mouse: getPosition(e),
                items,
            }
        });
    }
}