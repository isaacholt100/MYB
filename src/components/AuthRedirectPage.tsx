import useAuthRedirect from "../hooks/useAuthRedirect";

export default function AuthRedirectPage ({Page, ...other}: {Page: (props?: object) => JSX.Element, [key: string]: any}) {
    const isLoggedIn = useAuthRedirect();
    return isLoggedIn ? null : <Page {...other} />;
}