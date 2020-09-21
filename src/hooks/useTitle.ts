import { useDispatch } from "react-redux";
export default () => {
    const dispatch = useDispatch();
    return name => {
        dispatch({
            type: "CHANGE_PAGE_TITLE",
            payload: name,
        });
        document.title = name;
    };
}