import { Button, Paper, Typography } from "@material-ui/core";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        localStorage.setItem("hi", "value");
    }, []);
    
    return (
        <>
            <Paper>
                <Typography variant="h1">Hello World!</Typography>
            </Paper>
            <Link href="/page"><a>Page</a></Link>
            
        </>
    );
}