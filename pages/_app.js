import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from './refreshTokenHandler';


if (typeof window !== 'undefined') {
  // const session = getSession()
  // axios.defaults.baseURL = "http://localhost:4000"
  // axios.defaults.headers.common['Authorization'] = + document.cookie.split('; ')

  // Axios.defaults.headers.common['Authorization'] = `Bearer ${session?.Token}`;

  //   .find((row) => row.startsWith('Token='))
  //   ?.split('=')[1]
  // axios.defaults.headers.common['Content-Type'] = 'application/json'


  //   //   .find((row) => row.startsWith('Token='))
  //   //   ?.split('=')[1])

}




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





  if (localStorage.getItem("language") == 'en') {
    localStorage.setItem("language", "en")

  }

  else if (localStorage.getItem("language") == 'ku') {
    localStorage.setItem("language", "ku")
  }
  else if (localStorage.getItem("language") == null) {
    localStorage.setItem("language", "en")
  }

}






function MyApp({ Component, pageProps }) {

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


