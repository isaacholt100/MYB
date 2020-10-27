import { useState } from "react";
import { useDispatch } from "react-redux";
import ConfirmDialog from "../components/ConfirmDialog";

interface State {
    msg: string;
    fn: () => void;
}

export default (loading: boolean): [JSX.Element, (msg: string, fn: () => void) => void] => {
    const [{ msg, fn }, setState] = useState({ msg: "", fn: null });
    const Dialog = <ConfirmDialog loading={loading} msg={msg} fn={fn} close={() => setState({ msg: "", fn: null })} />;
    const confirm = (msg: string, fn: () => void) => {
        setState({ msg, fn });
    }
    return [Dialog, confirm];
}