import { mutate } from "swr";
import useGroup from "../../hooks/useGroup";
import FieldSettings from "./FieldSettings";
import Pic from "./Pic";

export default function Group() {
    const group = useGroup();
    return (
        <div className="mt_16">
            <FieldSettings name="name" limit={50} route="/group/" initial={group.name} />
            <Pic route="/group/pic" done={(data: any) => {
                mutate("/api/group", {
                    ...group,
                    pic: data.name,
                }, false);
            }} pic={group.pic} />
            <br />
        </div>
    );
}