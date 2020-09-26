import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useIsLoggedIn from "../hooks/useIsLoggedIn";
import useRedirect from "../hooks/useRedirect";

export default function Page() {
    const isLoggedIn = useRedirect();
    return isLoggedIn ? <h1>Hello</h1> : null;
}