import MdiIcon from "@mdi/react"
import { IconProps } from "@mdi/react/dist/IconProps"
export default function Icon(props: IconProps) {
    return <MdiIcon color="currentColor" size="24px" {...props} />
}