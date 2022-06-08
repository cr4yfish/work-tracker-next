import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@nextui-org/react';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [<>{initialProps.styles}</>]
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
        {CssBaseline.flush()}
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name='application-name' content='Closed[in] Blog' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Closed[in] Blog' />
        <meta name='description' content='Tech and Maths Blog' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/icons/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#f8cd86' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content='#f8cd86' />

        <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/icons/touch-icon-ipad.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/icons/touch-icon-iphone-retina.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='/icons/touch-icon-ipad-retina.png' />

        <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#f8cd86' />
        <link rel='shortcut icon' href='/favicon.ico' />
            
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:url' content='https://close-up-blog.vercel.app/' />
        <meta name='twitter:title' content='Closed[in] Blog' />
        <meta name='twitter:description' content='Tech and Maths Blog ' />
        <meta name='twitter:image' content='https://close-up-blog.vercel.app/icons/android-chrome-192x192.png' />
        <meta name='twitter:creator' content='@Cr4yfish' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Closed[in] Blog' />
        <meta property='og:description' content='Tech and Maths Blog ' />
        <meta property='og:site_name' content='Closed[in] Blog' />
        <meta property='og:url' content='https://close-up-blog.vercel.app' />
        <meta property='og:image' content='https://close-up-blog.vercel.app/icons/apple-touch-icon.png' />
        
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
