import { useDispatch } from "react-redux";

export default () => {
    const dispatch = useDispatch();
    return (msg, fn) => dispatch({
        type: "OPEN_CONFIRM_DIALOG",
        payload: {
            msg, fn,
        },
    });
}