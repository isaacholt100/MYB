import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
        console.log("jss");
        
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

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
      <ThemeProvider theme={createMuiTheme()}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}