import useLanguage from '../../Component/language';
import ResellerLayout from '../../Layouts/ResellerLayout';
import Head from 'next/head'

import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faMoneyCheckDollar, } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import Axios from '../api/Axios';
import { useState } from 'react';



export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session || session.userRole != "Reseller") {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        }

    }




    return {
        props: {
        }
    }
}



const Reseller = ({ }) => {


    const session = useSession()
    const router = useRouter()
    const l = useLanguage();
    const [resellerBal, setResellerBal] = useState('')

    useEffect(() => {
        if (session.status == "authenticated") {

            const Reseller = async () => {

                const res = await Axios.get(`users/detail/${session?.data.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data.Token}`
                        }

                    }

                )
                setResellerBal(res.data.userDetail.TotalBals)

            }
            Reseller()
        }
    }, [session.status])


    if (session.status === "loading") {
        return <div className="flex justify-center items-center h-screen">
            <Head>
                <title >{l.reseler}</title>
            </Head>
            <div className="">
                {l.loading}
            </div>
        </div>
    }

    if (session.status === "unauthenticated") {
        return router.push("/")
    }

    if (session.status === "authenticated") {
        return (


            <div className="" >
                <Head>
                    <title >{l.reseler}</title>
                </Head>
                <div className='flex justify-end pb-20  mx-10'>
                    <div className="p-5 border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%] max-w-screen-xl min-w-[250px]">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.balance}</div>
                                <div className="text-2xl font-bold ">${resellerBal || " 0"}</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-2xl" />

                                </div>
                            </div>

                        </div>
                    </div>
                </div>





            </div>
        );
    }
}

Reseller.Layout = ResellerLayout;
export default Reseller;



