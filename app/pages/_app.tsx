if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at top-level.
  require('preact/debug');
}

import React, { ReactElement } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'focus-visible';
import { DefaultSeo } from 'next-seo';
import Seo from '../next-seo';
import globalStyle from '../styles/globalStyle';
import { Global } from '@emotion/react';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#0E1217" />
        <meta name="msapplication-navbutton-color" content="#0E1217" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#0E1217" />

        <meta name="application-name" content="Buzzword Quiz" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Buzzword Quiz" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0E1217" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />

        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "49f88fe44f854e3bacf246f0c4d02344", "spa": true}'
        />
      </Head>
      <DefaultSeo {...Seo} />
      <Global styles={globalStyle} />
      <Component {...pageProps} />
    </>
  );
}
