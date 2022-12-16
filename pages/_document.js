import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(props) {


    return (
        <Html >
            <Head >

                <link rel="manifest" href='/manifest.json' />
                <link rel="apple-touch-icon" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="1024x1024" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="384x384" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="256x256" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="128x128" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="96x96" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="64x64" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="32x32" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="16x16" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/IconCar.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/IconCar.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <meta name="apple-mobile-web-app-title" content="Alwand" />
                <meta name="msapplication-TileImage" content="/IconCar.png" />
                {/* <meta name="msapplication-TileColor" content="#181a1b" />
                <meta name="theme-color" content="#181a1b" />
                <meta name="msapplication-navbutton-color" content="#181a1b" />
                <meta name="apple-mobile-web-app-status-bar-style" content="#181a1b" /> */}
                <meta name="msapplication-starturl" content="/" />
                {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
                <meta name="description" content="Alwand" />
                <meta name="keywords" content="Alwand" />
                <meta name="author" content="Alwand" />

                {/* //? full screen mobile */}
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                {/* //? full screen mobile */}


                <link rel="icon" href="/fav/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&display=swap" rel="stylesheet" />


                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap" rel="stylesheet" />














            </Head>
            <body  >

                <Main />
                <NextScript />

            </body>
        </Html>
    )
}