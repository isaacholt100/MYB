import Dashboard from "../components/Dashboard";
import LandingPage from "../components/LandingPage";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import Cookies from "js-cookie";

export default () => {
    const isLoggedIn = useIsLoggedIn();
    return isLoggedIn ? <Dashboard /> : <LandingPage />;
}