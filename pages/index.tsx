import { Typography } from "@material-ui/core";
import { GetStaticProps } from "next";
import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
                <meta name="description" content="<Description Here>" />
                <meta name="keywords" content="<Keywords here>" />
                <link rel="manifest" href="/manifest.json" />
                <link href="/favicons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
                <link href="/favicons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
                <link rel="apple-touch-icon" href="/favicons/apple-icon.png"></link>
                <meta name="theme-color" content="#317EFB" />
                <title>Squool</title>
            </Head>
            <Typography variant="h1">Hello World!</Typography>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {

        }
    }
}