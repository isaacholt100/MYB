import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

export default function useConfirm(loading: boolean): [JSX.Element, (msg: string, fn: () => void) => void] {
    const [{ msg, fn }, setState] = useState({ msg: "", fn: null });
    const Dialog = <ConfirmDialog loading={loading} msg={msg} fn={fn} close={() => setState({ msg: "", fn: null })} />;
    const confirm = (msg: string, fn: () => void) => {
        setState({ msg, fn });
    }
    return [Dialog, confirm];
}