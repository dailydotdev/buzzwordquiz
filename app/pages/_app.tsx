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
        <meta name="theme-color" content="#151618" />
        <meta name="msapplication-navbutton-color" content="#151618" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#151618" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('load', () => { window.windowLoaded = true; }, {
      once: true,
    });`,
          }}
        />
      </Head>
      <DefaultSeo {...Seo} />
      <Global styles={globalStyle} />
      <Component {...pageProps} />
    </>
  );
}
