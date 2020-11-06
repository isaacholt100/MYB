import { useDelete } from "../hooks/useRequest";
import Cookies from "js-cookie";
import { Button, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { mutate } from "swr";
import useUser from "../hooks/useUser";
import CopyToClipboard from "react-copy-to-clipboard";
import useGroup from "../hooks/useGroup";

export default function Dashboard() {
    const user = useUser();
    const group = useGroup();
    return (
        <div>
            <div className={"flex flex_wrap align_items_center mb_8"}>
                <img src={group.pic || "/images/default_school.png"} height={128} width={128} style={{borderRadius: "50%"}} />
                <Typography variant="h4" className={"ml_16"}>{group.name}</Typography>
            </div>
            <Typography>Invite people from your year to join: <Typography color="secondary" component="span">{process.browser && (window.location.origin + "/signup?id=" + user.group_id)}</Typography></Typography>
            
            <CopyToClipboard text={process.browser && (window.location.origin + "/signup?id=" + user.group_id)}>
                <Button color="secondary">Copy Link</Button>
            </CopyToClipboard>
        </div>
    );
}