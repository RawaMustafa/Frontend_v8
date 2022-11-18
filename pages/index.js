import { getSession } from 'next-auth/react'


export async function getServerSideProps({ req, res }) {

  const session = await getSession({ req })

  if (session && session?.userRole == "Reseller") {
    return {
      redirect: {
        destination: '/Reseller',
        permanent: false,
      }

    }
  }
  if (session && session?.userRole == "Admin") {
    return {
      redirect: {
        destination: '/Dashboard',
        permanent: false,
      }

    }
  }
  if (session && session?.userRole == "Qarz") {
    return {
      redirect: {
        destination: '/Qarz',
        permanent: false,
      }

    }
  }
  if (!session || session?.userRole == "") {
    return {
      redirect: {
        destination: '/Login',
        permanent: false,
      }

    }
  }

  return {
    props: {}
  }

}


export default function Home() {

  return (
    <>
    </>
  )
}
