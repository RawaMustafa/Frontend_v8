import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from './refreshTokenHandler';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';



if (typeof document !== "undefined") {

  if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

  }

  else if (localStorage.getItem("theme") === "light") {

    document.body.classList.remove("dark");
  }


  else if (localStorage.getItem("theme") == null) {
    localStorage.setItem("theme", "dark")
    document.body.classList.add("dark");
  }


  if (localStorage.getItem("language") === "ku") {

    document.body.dir = "rtl";

  }
  else if (localStorage.getItem("language") === "en") {

    document.body.dir = "ltr";
  }


  else if (localStorage.getItem("language") == null) {
    localStorage.setItem("language", "en")
    document.body.dir = "ltr";
  }


}



function MyApp({ Component, pageProps }) {

  const router = useRouter()

  const c = 0

  useEffect(() => {

    localStorage.getItem("language") == "ku" ? (router.locale = 'ku', document.body.dir = "rtl", router.push(router.asPath, router.asPath, { locale: 'ku' })) : (router.locale = 'en', document.body.dir = "ltr", router.push(router.asPath, router.asPath, { locale: 'en' }))

  }, [c])



  const [interval, setInterval] = useState(0);
  const Layout = Component.Layout || EmptyLayout
  return (
    <>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />



      </Head>


      <SessionProvider session={pageProps.session} refetchInterval={interval}>
        <ThemeProvider   >
          <Layout  >
            <Component   {...pageProps} />
            <RefreshTokenHandler setInterval={setInterval} />
          </Layout>
        </ThemeProvider >
      </SessionProvider>
    </>
  )
}
const EmptyLayout = ({ children }) => <>{children}</>
export default MyApp


