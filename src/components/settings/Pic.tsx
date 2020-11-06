import { usePut } from "../../hooks/useRequest";
import LoadBtn from "../LoadBtn";

export default function Pic({ route, done, pic }: { route: string, done: (data: any) => void, pic: string }) {
    const [put, loading] = usePut();
    return (
        <div className="flex align_items_center">
            <img src={pic} height={64} width={64} style={{borderRadius: "50%"}} />
            <div className="ml_8">
                <input
                    accept="image/*"
                    className={"display_none"}
                    id="contained-button-file"
                    type="file"
                    onChange={e => {
                        const form = new FormData();
                        form.append("file", e.target.files[0]);
                        put(route, {
                            file: true,
                            setLoading: true,
                            failedMsg: "uploading this image",
                            done(data: any) {
                                done(data);
                            },
                            body: form,
                        });
                    }}
                />
                <label htmlFor="contained-button-file">
                    <LoadBtn loading={loading} label="Change Picture" disabled={false} component="span" />
                </label>
            </div>
        </div>
    );
}