import useAuthRedirect from "../hooks/useAuthRedirect";

export default ({Page, ...other}: {Page: (props?: object) => JSX.Element, [key: string]: any}) => {
    const isLoggedIn = useAuthRedirect();
    return isLoggedIn ? null : <Page {...other} />;
}