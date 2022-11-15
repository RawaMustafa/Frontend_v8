import useLanguage from '../../../../Component/language';
import AdminLayout from '../../../../Layouts/AdminLayout';
import { useMemo, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Axios from '../../../api/Axios';
import Image from 'next/image';
import { InView } from 'react-intersection-observer';

import { getSession, useSession } from "next-auth/react";





export const getServerSideProps = async ({ req }) => {
    const session = await getSession({ req })



    if (!session || session?.userRole !== "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }
    return {
        props: {


        }
    }
}


const Reseller = () => {

    const session = useSession()

    const [Data, setData] = useState([]);
    const l = useLanguage();

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(4);
    const [NoCars, setNoCars] = useState(false);



    useMemo(() => {

        const getReseller = async () => {
            try {
                const res = await Axios.get(`users/Reseller/?search=${Search}&page=${Page}&limit=${Limit}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)
                setData(res.data.userDetail)

            } catch (err) {

                setData([])
            }


        }
        getReseller();
    }, [Search, Page, Limit])



    return (


        <div className="container mx-auto">
            <Head>
                <title >{l.reseler}</title>
            </Head>

            <div className="pt-5  mb-32">


                <div className="   z-30  mx-5   ">

                    <label className="relative block max-w-[150px] lg:max-w-[300px] ">
                        <span className="sr-only">Search</span>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            {/* <FontAwesomeIcon icon={faSearch} /> */}
                        </span>
                        <input
                            onChange={(s) => { setSearch(s.target.value) }}

                            className="placeholder:italic placeholder:text-slate-400 block  bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder={l.search} type="text" name="search" />
                    </label>



                </div>
            </div>
            {
                (NoCars || Data.length == '0') &&

                <div className="m-auto top-[50%] -translate-y-[50%] absolute -translate-x-[50%] left-[50%] lg:left-[60%]  ">
                    < Image alt="NoData" src="/NoData.svg" width={200} height={200} quality={'1'} />
                </div>


            }

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-10 ">
                {Data.map((item, key) => {
                    return (
                        <Link key={key} as={`/Dashboard/Balance/Reseller/${item._id}`} href={`/Dashboard/Balance/Reseller/[_id]`}><a>
                            <div className=" rounded-2xl light:bg-red-600  bg-slate-600 dark:bg-gray-900 bg- text-neutral-content h-56 max:w-96">
                                <div className=" pt-6 text-center  space-y-2">
                                    <Image width={50} height={50} className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="/logo.png" alt="users" />

                                    <h2 className=" first-line:">{item.userName}</h2>
                                    <h2 className=" first-line:">{item.email}</h2>
                                </div>
                                <div className="p-8 flex justify-between">
                                    <div> {l.balance} : {item.TotalBals}</div>
                                    {/* <div> {l.cars} : {item.TotalBals}</div> */}
                                </div>
                            </div>
                        </a>
                        </Link>

                    )
                })}

            </div>
            {Data?.length >= Limit &&
                <InView rootMargin='500px'
                    as="div" onChange={(inView, entry) => {

                        inView && setLimit(Limit + 4)
                    }} className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 my-20  ">


                    <div role="status" className="p-4 max-w-md   border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl    ">
                        <div className="flex justify-center rounded-full items-center mb-6 w-16 h-16 bg-gray-300  dark:bg-gray-700  mx-auto   ">
                            <svg className="w-6 h-6   text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>

                        <div className="flex justify-center ">
                            <div className="h-2 flex bg-gray-200 rounded-full dark:bg-gray-700 mb-4 w-24 text-center ">  </div>
                        </div>
                        <div className="flex justify-center ">
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-12 w-40"></div>
                        </div>

                        <div className="flex  justify-between ">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>


                    <div role="status" className="p-4 max-w-md    border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl    ">
                        <div className="flex justify-center rounded-full items-center mb-6 w-16 h-16 bg-gray-300  dark:bg-gray-700  mx-auto   ">
                            <svg className="w-6 h-6   text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>

                        <div className="flex justify-center ">
                            <div className="h-2 flex bg-gray-200 rounded-full dark:bg-gray-700 mb-4 w-24 text-center ">  </div>
                        </div>
                        <div className="flex justify-center ">
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-12 w-40"></div>
                        </div>

                        <div className="flex  justify-between ">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>



                    <div role="status" className="p-4 max-w-md    border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl    ">
                        <div className="flex justify-center rounded-full items-center mb-6 w-16 h-16 bg-gray-300  dark:bg-gray-700  mx-auto   ">
                            <svg className="w-6 h-6   text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>

                        <div className="flex justify-center ">
                            <div className="h-2 flex bg-gray-200 rounded-full dark:bg-gray-700 mb-4 w-24 text-center ">  </div>
                        </div>
                        <div className="flex justify-center ">
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-12 w-40"></div>
                        </div>

                        <div className="flex  justify-between ">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>


                    <div role="status" className="p-4 max-w-md    border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl    ">
                        <div className="flex justify-center rounded-full items-center mb-6 w-16 h-16 bg-gray-300  dark:bg-gray-700  mx-auto   ">
                            <svg className="w-6 h-6   text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>

                        <div className="flex justify-center ">
                            <div className="h-2 flex bg-gray-200 rounded-full dark:bg-gray-700 mb-4 w-24 text-center ">  </div>
                        </div>
                        <div className="flex justify-center ">
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-12 w-40"></div>
                        </div>

                        <div className="flex  justify-between ">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>




                </InView >
            }





        </div>
    );
}



Reseller.Layout = AdminLayout;



export default Reseller;