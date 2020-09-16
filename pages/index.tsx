import { Typography } from "@material-ui/core";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        localStorage.setItem("hi", "value");
    }, []);
    
    return (
        <>
            <Typography variant="h1">Hello World!</Typography>
        </>
    );
}