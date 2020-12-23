import { mutate } from "swr";
import useGroup from "../../hooks/useGroup";
import { usePut } from "../../hooks/useRequest";
import LoadBtn from "../LoadBtn";
import Loader from "../Loader";
import FieldSettings from "./FieldSettings";
import Pic from "./Pic";

export default function Group() {
    const [group, groupLoading] = useGroup();
    const [put, loading] = usePut();
    const changeVote = e => {
        e.preventDefault();
        put("/group", {
            setLoading: true,
            body: {
                can_vote: !group.can_vote,
            },
            done() {
                mutate("/api/group", {...group, can_vote: !group.can_vote}, true);
            },
            failedMsg: "updating group settings",
        });
    }
    return groupLoading ? <Loader /> : (
        <div className="mt_16">
            <FieldSettings name="name" limit={50} route="/group/" initial={group.name} />
            <Pic route="/group/pic" done={(data: any) => {
                mutate("/api/group", {
                    ...group,
                    pic: data.name,
                }, false);
            }} pic={group.pic} />
            <form onSubmit={changeVote}>
                <LoadBtn color="secondary" className={"mt_8"} label={group.can_vote ? "Disable Voting" : "Enable Voting"} loading={loading} disabled={false} />
            </form>
        </div>
    );
}