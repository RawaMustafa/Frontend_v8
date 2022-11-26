import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from './refreshTokenHandler';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
  }


}



function MyApp({ Component, pageProps }) {

  const router = useRouter()

  useEffect(() => {





    if (localStorage.getItem("language") === "ku") {
      router.locale = 'ku'
      router.push(router.asPath, router.asPath, { locale: 'ku' })
      document.body.dir = "rtl";
    }

    else if (localStorage.getItem("language") === "en") {
      router.locale = 'en'
      router.push(router.asPath, router.asPath, { locale: 'en' })
      document.body.dir = "ltr";

    }


  }, [router.locale])



  const [interval, setInterval] = useState(0);
  const Layout = Component.Layout || EmptyLayout
  return (
    <SessionProvider session={pageProps.session} refetchInterval={interval}>
      <ThemeProvider   >
        <Layout  >
          <Component   {...pageProps} />
          <RefreshTokenHandler setInterval={setInterval} />
        </Layout>
      </ThemeProvider >
    </SessionProvider>
  )
}
const EmptyLayout = ({ children }) => <>{children}</>
export default MyApp


