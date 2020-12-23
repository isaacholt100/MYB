import { TextField } from "@material-ui/core";
import { startCase } from "lodash";
import { useEffect, useState } from "react";
import { usePut } from "../../hooks/useRequest";
import LoadBtn from "../LoadBtn";

export default function FieldSettings({ name, limit, route, initial }: { name: "quote" | "name", limit: number, route: string, initial: string }) {
    const [val, setVal] = useState(initial);
    const [put, loading] = usePut();
    const error = val?.length > limit || val?.split(" ").some(w => w.length >= 40);
    const updateQuote = e => {
        e.preventDefault();
        if (!loading) {
            put(route + name, {
                setLoading: true,
                failedMsg: "changing your " + name,
                body: {
                    [name]: val,
                },
                doneMsg: startCase(name) + " updated",
            })
        }
    }
    useEffect(() => {
        setVal(initial);
    }, [initial]);
    return (
        <div className={"mb_16"}>
            <form onSubmit={updateQuote}>
                <TextField
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    label={startCase(name)}
                    multiline={name === "quote"}
                    fullWidth
                    helperText={error ? startCase(name) + " too long" : " "}
                    error={error}
                />
                <LoadBtn label={"Update " + name} loading={loading} disabled={error} />
            </form>
        </div>
    );
}