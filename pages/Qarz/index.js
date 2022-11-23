import useLanguage from '../../Component/language';
import QarzLayout from '../../Layouts/QarzLayout';
import { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import axios from 'axios';
import Axios, { baseURL } from '../api/Axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faCalendarCheck, faFileDownload, faMoneyCheckDollar, faCar, } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";





export async function getServerSideProps({ req, query }) {
    const session = await getSession({ req })
    if (!session || session.userRole != "Qarz") {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        }

    }


    let data
    try {
        const res = await Axios.get(`/qarz/amount/${query._id}/?&page=1&limit=1`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.Token}`
            }
        },)
        data = await res.data.qarzList.map((e) => { return e.id }).length


    } catch {
        data = 4
    }

    console.log(data)

    return {
        props: {
            initQuery: session.id,
            AllQarz: data,

        }
    }



}








const Qarz = ({ initQuery, AllQarz }) => {


    const { data: session, status } = useSession()

    const l = useLanguage();
    const [PageQarz, setPageQarz] = useState(1)
    const router = useRouter()
    const [dataQarz, setData] = useState()
    const [DataQarzAmount, setDataQarzAmount] = useState()
    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);




    useMemo(() => {
        if (status === 'authenticated') {
            const GetCars = async () => {
                try {

                    const res = await Axios.get(`/qarz/${initQuery}?search=${Search}&page=${Page}&limit=${Limit}`, {

                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.Token}`
                        }
                    },);

                    const dataFetch = await res.data;

                    setData(dataFetch)
                } catch (e) {
                }

                try {
                    const res2 = await Axios.get(`/qarz/amount/${initQuery}`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.Token}`
                        }
                    },);



                    console.log(res2.data)

                    // const dataQarzList = await res2.data

                    setDataQarzAmount(res2?.data.qarzList)


                } catch {

                }

            }
            GetCars()

        }

    }, [Search, Page, Limit, initQuery, status])



    let AllQarzAmount = 0

    DataQarzAmount?.map((item, index) => {
        AllQarzAmount += item.qarAmount;


    })


    if (status == "unauthenticated") {
        router.push('/');
    }


    if (status == "loading") {

        return (<>
            <Head>
                <title >{l.locan}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>
            <div className="text-center">
                {l.loading}
            </div>
        </>)
    }

    const COLUMNS =
        // useMemo(() =>
        [


            {
                Header: () => {
                    return (

                        l.amount
                    )
                },

                disableFilters: true,

                accessor: 'qarAmount',


            },


            {
                Header: () => {
                    return (

                        l.ispaid
                    )
                },

                accessor: 'isPaid',
                disableFilters: true,


            },
            {
                Header: () => {

                    return l.date;
                },

                accessor: 'dates',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },


            // {
            //     Header: "Edit",
            //     disableFilters: true,



            // },
            // {
            //     Header: "Delete",

            //     disableFilters: true,



            // },



        ]
    // )
    const COLUMN =
        // useMemo(() =>
        [


            {
                Header: () => {
                    return (

                        // l.amount
                        "Name of Car"

                    )
                },

                disableFilters: true,

                accessor: 'carId',


            },

            {
                Header: () => {
                    return (

                        // l.amount
                        "IsSold"

                    )
                },

                disableFilters: true,

                accessor: 'isSold',


            },
            {
                Header: () => {
                    return (

                        // l.amount
                        "Model"

                    )
                },

                disableFilters: true,

                accessor: 'model',


            },
            {
                Header: () => {
                    return (

                        // l.amount
                        "Price"

                    )
                },

                disableFilters: true,

                accessor: 'price',


            },
            {
                Header: () => {
                    return (

                        // l.amount
                        "Type of Car"

                    )
                },

                disableFilters: true,

                accessor: 'tocar',


            },




            {
                Header: () => {
                    return (

                        l.ispaid
                    )
                },

                accessor: 'isPaid',
                disableFilters: true,


            },
            {
                Header: () => {

                    return l.date;
                },

                accessor: 'dates',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },

            {
                Header: () => {

                    return l.detail;
                },

                accessor: 'Details',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },






        ]
    // )
    if (status == "authenticated") {




        return (

            <div className="container mx-auto  footer-center ">

                <Head>
                    <title >{l.loan}</title>
                </Head>

                <div className="pt-5  mb-20 flex justify-end">




                    <div onClick={() => {
                        PageQarz == 1 && setPageQarz(2)
                        PageQarz == 2 && setPageQarz(1)
                    }}
                        className="p-5 cursor-pointer scale-75 lg:scale-100  justify-self-end border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg  w-64      z-30    ">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.owee}</div>
                                <div className="text-2xl font-bold ">{AllQarzAmount}</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                    {PageQarz == 2 && <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-2xl" />}
                                    {PageQarz == 1 && <FontAwesomeIcon icon={faCar} className="text-2xl" />}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>




            </div >
        );

    }

}

Qarz.Layout = QarzLayout;
export default Qarz;






