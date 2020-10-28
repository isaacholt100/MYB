import Dashboard from "../components/Dashboard";
import LandingPage from "../components/LandingPage";
import useIsLoggedIn from "../hooks/useIsLoggedIn";

export default function Home() {
    const isLoggedIn = useIsLoggedIn();
    return isLoggedIn ? <Dashboard /> : <LandingPage />;
}