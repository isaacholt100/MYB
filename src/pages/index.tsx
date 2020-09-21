import DashBoard from "../components/DashBoard";
import LandingPage from "../components/LandingPage";
import useIsLoggedIn from "../hooks/useIsLoggedIn";

export default () => {
    const isLoggedIn = useIsLoggedIn();
    return isLoggedIn ? <DashBoard /> : <LandingPage />;
}