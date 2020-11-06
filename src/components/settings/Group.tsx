import { Typography } from "@material-ui/core";
import { mutate } from "swr";
import useGroup from "../../hooks/useGroup";
import { usePut } from "../../hooks/useRequest";
import LoadBtn from "../LoadBtn";
import FieldSettings from "./FieldSettings";

export default function Group() {
    const group = useGroup();
    const [put, loading] = usePut();
    return (
        <div className="mb_8">
            <Typography variant="h4" gutterBottom>Group Settings</Typography>
            <FieldSettings name="name" limit={50} route="/group/" initial={group.name} />
            <img src={group.pic} height={256} />
            <div className="ml_8">
                <input
                    accept="image/*"
                    className={"display_none"}
                    id="group-image"
                    type="file"
                    onChange={e => {
                        const form = new FormData();
                        form.append("file", e.target.files[0]);
                        put("/group/pic", {
                            file: true,
                            setLoading: true,
                            failedMsg: "uploading this image",
                            done(data: any) {
                                mutate("/api/group", {
                                    ...group,
                                    pic: data.name,
                                }, true);
                            },
                            body: form,
                        });
                    }}
                />
                <label htmlFor="group-image">
                    <LoadBtn loading={loading} label="Change Picture" disabled={false} component="span" />
                </label>
            </div>
            <br />
        </div>
    );
}