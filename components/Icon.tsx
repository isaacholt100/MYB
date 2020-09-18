import Icon from "@mdi/react"

export default ({ path, ...other }: { path: string, other?: object }) => {
    return <Icon path={path} color="currentColor" size="24px" {...other} />
}