import useCookies from "./useCookies"

export default () => {
    const cookies = useCookies();
    return cookies.exists("accessToken") && cookies.exists("refreshToken");
}