import React from "react";
import Document, {
    Html, Main, NextScript, Head
} from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";

const
    APP_NAME = "Squool",
    APP_DESC = "<Description Here>",
    APP_URL = "https://squool.vercel.app",
    APP_COLOR = "#000000";

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="application-name" content={APP_NAME} />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content={APP_NAME} />
                    <meta name="description" content={APP_DESC} />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-config" content="/browserconfig.xml" />
                    <meta name="msapplication-TileColor" content="#000000" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content={APP_COLOR} />
                            
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/favicons/apple-icon-180x180.png" color="#000000" />
                    <link rel="shortcut icon" href="/favicons/favicon.ico" />

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content={APP_URL} />
                    <meta name="twitter:title" content={APP_NAME} />
                    <meta name="twitter:description" content={APP_DESC} />
                    <meta name="twitter:image" content={APP_URL + "/favicons/android-icon-192x192.png"} />
                    {/*<meta name="twitter:creator" content="@DavidWShadow" />*/}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={APP_NAME} />
                    <meta property="og:description" content={APP_DESC} />
                    <meta property="og:site_name" content={APP_NAME} />
                    <meta property="og:url" content={APP_URL} />
                    <meta property="og:image" content={APP_URL + "/favicons/apple-icon.png"} />
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
                    <meta name="keywords" content="<Keywords here>" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
MyDocument.getInitialProps = async ctx => {
    console.log(ctx);
    
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
    });
    const initialProps = await Document.getInitialProps(ctx);
    return {
        ...initialProps,
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};