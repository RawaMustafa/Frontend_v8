import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(props) {

    return (
        <Html
        //  lang={props.locale}
        >
            <Head  >
                <link rel="icon" href="/fav/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&display=swap" rel="stylesheet" />


                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap" rel="stylesheet" />

                <meta name="Cars" />
                <link rel="apple-touch-icon" href="/logo.png"></link>
                {/* <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></Script> */}



                {/* 
                <Script src="https://unpkg.com/flowbite@1.5.3/dist/datepicker.js"></Script>
                <Script src="../path/to/flowbite/dist/datepicker.js"></Script> */}


            </Head>
            {/* dir={props.locale == "ku" ? 'rtl' : 'ltr'}  */}

            <body dir=''  >

                <Main />
                <NextScript />

            </body>
        </Html>
    )
}