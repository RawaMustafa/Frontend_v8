import useLanguage from '../../../../../Component/language';
import AdminLayout from '../../../../../Layouts/AdminLayout';
import { useMemo, useState, } from 'react';
import Head from 'next/head'
import Axios from "../../../../api/Axios"
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Image from 'next/image';

import ResellerCars from './ResellerCars';
import ResellerBal from './ResellerBal';

export const getServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req })


    if (!session || session?.userRole !== "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }


    let data = 1
    try {
        const res = await Axios.get(`/reseller/${query._id}/?search=&page=1&limit=10`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.Token}`
            }
        },)
        data = res.data.total
    } catch {
        data = 1
    }


    return {
        props: {

            AllProducts: data,
            initQuery: query
        }
    }
}



const Reseller = ({ AllProducts, initQuery }) => {

    const router = useRouter()
    const session = useSession();
    const [page, setPage] = useState(1);


    const ResellerCarsColumn =
        useMemo(() =>
            [
                {
                    Header: "Image",
                    disableFilters: true,
                    accessor: 'Image',
                },

                {
                    Header: "Name",
                    disableFilters: true,
                    accessor: 'modeName',
                },

                {
                    Header: "Sell Price",

                    disableFilters: true,

                    accessor: 'price',


                },
                {
                    Header: "Color",

                    disableFilters: true,

                    accessor: 'color',


                },

                {
                    Header: "Sold",

                    disableFilters: true,

                    accessor: 'isSold',


                },
                {
                    Header: "Mileage",

                    disableFilters: true,

                    accessor: 'mileage',


                },

                {
                    Header: "Model Year",

                    disableFilters: true,

                    accessor: 'model',


                },


                {
                    Header: "Balance Type",

                    disableFilters: true,

                    accessor: 'tobalance',


                },


                {
                    Header: "Car Type",

                    disableFilters: true,

                    accessor: 'tocar',


                },

                {
                    Header: "Wheel Drive",

                    disableFilters: true,

                    accessor: 'wheelDriveType',


                },

                {
                    Header: "Details",
                    disableFilters: true,

                },



            ], [AllProducts]
        )
    const ResellerrBalColumn =
        useMemo(() =>
            [


                {
                    Header: "Amount",

                    disableFilters: true,

                    accessor: 'amount',


                },

                {
                    Header: "Action",

                    accessor: 'action',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },

                {
                    Header: "Car ",
                    accessor: 'carId',
                    disableFilters: true,

                },


                {
                    Header: "Note",

                    accessor: 'note',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },

                {
                    Header: "Date",
                    accessor: 'actionDate',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },




            ], [AllProducts]
        )
    const l = useLanguage();

    if (session.status === "loading") {
        return (
            <div className=" text-center">
                <Head>
                    <title>{l.reseler}</title>
                </Head>
                {l.loading}
            </div>
        )
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


                <div className=" flex justify-end ">

                    <select
                        onChange={(e) => {
                            setPage(e.target.value)
                        }}
                        className="select select-info lg:w-80    focus:outline-0  ">
                        <option value="1">{l.car}</option>
                        <option value="2">{l.mybalance}</option>
                    </select>

                </div>


                {page == 1 && (AllProducts ?
                    <ResellerCars COLUMNS={ResellerCarsColumn} AllProducts={AllProducts} initQuery={initQuery} />


                    : <div className="m-auto top-[50%] -translate-y-[50%] absolute -translate-x-[50%] left-[50%] lg:left-[60%] ">
                        < Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                    </div>)
                }

                {page == 2 &&
                    <ResellerBal COLUMNS={ResellerrBalColumn} SessionID={session?.data.id} AllUsers={1} />

                }



            </div>
        );
    }
}



Reseller.Layout = AdminLayout;

export default Reseller;











