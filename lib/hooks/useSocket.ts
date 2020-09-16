import { useDispatch } from "react-redux";
import socket from "../api/socket";

export default () => {
    const dispatch = useDispatch();
    return {
        ...socket,
        dispatchEmit(type, payload) {
            dispatch({
                type,
                payload,
            });
            socket.emit("user message", type, payload);
        },
        dispatchOn(type) {
            socket.on(type, (payload, notify) => dispatch({
                type,
                payload,
                notify,
            }));
        },
        notifyOn(type) {
            socket.on("/notify/" + type, payload => dispatch({
                type,
                payload,
                notify: true,
            }));
        }
    }
}