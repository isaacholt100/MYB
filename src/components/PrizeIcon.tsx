import { mdiTrophy } from "@mdi/js";
import prizeIcons from "../lib/prizeIcons";
import Icon from "./Icon";
import { IconProps } from "@mdi/react/dist/IconProps";

export default function PrizeIcon(props: IconProps) {
    return (
        <Icon path={prizeIcons[props.path] || mdiTrophy} />
    )
}