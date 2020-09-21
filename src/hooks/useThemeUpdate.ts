import { useDispatch } from "react-redux";

export default () => {
    const dispatch = useDispatch();
    return t => dispatch({
        type: "/theme",
        payload: t,
    });
}