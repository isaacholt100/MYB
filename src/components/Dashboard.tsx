import { useDelete } from "../hooks/useRequest";
import Cookies from "js-cookie";
import { Button, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { mutate } from "swr";
import useUser from "../hooks/useUser";
import CopyToClipboard from "react-copy-to-clipboard";

export default function Dashboard() {
    const user = useUser();
    return (
        <div>
            <Typography>Invite people from your year to join: </Typography>
            <Typography color="secondary">{process.browser && (window.location.origin + "/signup?id=" + user.group_id)}</Typography>
            <CopyToClipboard text={process.browser && (window.location.origin + "/signup?id=" + user.group_id)}>
                <Button>Copy</Button>
            </CopyToClipboard>
        </div>
    );
}