import { Button, Paper, Typography } from "@material-ui/core";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DashBoard from "../components/DashBoard";
import LandingPage from "../components/LandingPage";
import useIsLoggedIn from "../hooks/useIsLoggedIn";

export default () => {
    const isLoggedIn = useIsLoggedIn();
    return isLoggedIn ? <DashBoard /> : <LandingPage />;
}