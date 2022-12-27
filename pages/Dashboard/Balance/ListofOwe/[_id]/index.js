import useLanguage from '../../../../../Component/language';
import Head from 'next/head'
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../Layouts/AdminLayout';
import axios from 'axios';
import Axios, { baseURL } from '../../../../api/Axios';
import { useEffect, useMemo, useState } from 'react';
import { getSession, useSession } from "next-auth/react";


import TableQarz from './TableQarz'
import TableBal from './TableBal'
import CarsTable from './CarsTable'

const Amount_regex = /^[0-9]{0,12}/;
const IsPaid_regex = /^[a-zA-Z]{0,7}/;



export async function getServerSideProps({ req, query }) {

    const session = await getSession({ req })

    if (!session || session?.userRole !== "Admin") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }


    let data = 1
    // try {
    //     const res = await Axios.get(`/qarz/amount/${query._id}/?search=&page=1&limit=10`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': `Bearer ${session?.Token}`
    //         }
    //     },)
    //     data = await res.data.qarzList.map((e) => { return e.id }).length

    // } catch {
    //     data = 1
    // }


    return {
        props: {
            initQuery: query,
            AllQarz: data,

        }
    }
}


const Details = ({ initQuery, AllQarz }) => {

    const session = useSession();
    const [dataQarz, setDataQarz] = useState()
    const [data, setData] = useState()
    const [dataQarzID, setdataQarzID] = useState("")
    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [PageQarz, setPageQarz] = useState(1);
    const [Limit, setLimit] = useState(14);
    const [NoCars, setNoCars] = useState(false);

    const l = useLanguage();

    const router = useRouter()



    useEffect(() => {

        if (session.status === 'authenticated') {
            const GetCars = async () => {

                try {

                    const Auth = {

                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`

                        }
                    }
                    const one = `/qarz/${initQuery._id}/?search=${Search}&page=${Page}&limit=${Limit}`
                    const tow = `/qarz/amount/${initQuery._id}`
                    const response1 = await Axios.get(one, Auth).then((res) => {

                        return res
                    }).catch(() => {
                        setNoCars(true)

                    });
                    const response2 = await Axios.get(tow, Auth).then((res) => {
                        return res

                    }).catch(() => {

                    });


                    await axios.all([response1, response2]).then(

                        axios.spread((...responses) => {

                            setData(responses?.[0]?.data.qarzList)
                            setDataQarz(responses?.[1]?.data.qarzList)

                            responses?.[0]?.data && setNoCars(false)

                        })).catch(() => {

                        })



                } catch (e) {


                    setNoCars(true)

                }

            }


            GetCars()
        }

    }, [Search, Page, Limit, initQuery._id, session.status])




    let AllQarzAmount = 0
    dataQarz?.map((item, index) => {
        item.isPaid || (AllQarzAmount += item.qarAmount)

    })


    const COLUMNSCars =
        // useMemo(() =>
        [
            {
                Header: () => {
                    return (

                        "Image"
                    )
                },

                disableFilters: true,
                accessor: 'Image',

            },

            {
                Header: () => {
                    return (

                        // l.amount
                        "Name"

                    )
                },


                accessor: 'Name',


            },


            {
                Header: () => {
                    return (

                        // l.amount
                        "Model Year"

                    )
                },

                disableFilters: true,

                accessor: 'Model Year',


            },
            {
                Header: () => {
                    return (
                        "Color"
                    )
                },

                disableFilters: true,

                accessor: 'Color',


            },
            {
                Header: () => {
                    return (
                        "VIN"
                    )
                },

                // disableFilters: true,

                accessor: 'VIN',


            },

            {
                Header: () => {
                    return (

                        // l.amount
                        "Car Type"

                    )
                },

                disableFilters: true,

                accessor: 'Car Type',


            },

            {
                Header: () => {
                    return (

                        // l.amount
                        "Sold"

                    )
                },

                disableFilters: true,

                accessor: 'Sold',


            },


            {
                Header: () => {
                    return (
                        "Price Paid"
                    )
                },

                disableFilters: true,

                accessor: 'Price Paid',
                Footer: info => {
                    // Only calculate total visits if rows change
                    const total = useMemo(

                        () => {
                            let T = 0
                            info.rows.map((row, idx) => {
                                T += (
                                    row.original.carCost.pricePaidbid +
                                    row.original.carCost.feesinAmericaCopartorIAAfee +
                                    row.original.carCost.feesinAmericaStoragefee +
                                    row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost +
                                    row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost

                                )

                            })

                            return T
                        }, [info.rows]
                    )

                    return <>{total} $</>
                },

            },




            {
                Header: () => {
                    return (

                        // l.ispaid
                        "Paid"
                    )
                },

                accessor: 'Paid',
                disableFilters: true,


            },
            {
                Header: () => {

                    // return l.date;
                    return "Date"
                },

                accessor: 'Date',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },

            {
                Header: () => {

                    // return l.detail;
                    return "Detail"
                },

                accessor: 'Details',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },






        ]
    // )
    const COLUMN =
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

            {
                Header: () => {

                    return "Pay";
                },

                accessor: 'Pay',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },
            {
                Header: () => {

                    return "Edit";
                },

                accessor: 'Edit',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },
            {
                Header: () => {

                    return "Delete";
                },

                accessor: 'Delete',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },





        ]
    // )

    const COLUMNSBal =
        useMemo(() =>
            [


                {
                    Header: () => {
                        return (

                            // l.amount
                            "Amount"
                        )
                    },

                    disableFilters: true,

                    accessor: 'amount',


                },




                {
                    Header: () => {

                        // return l.action;
                        return "Action"
                    },

                    accessor: 'action',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },

                {
                    Header: () => {
                        return (

                            "Car "
                        )
                    },

                    accessor: 'carId',
                    disableFilters: true,


                },

                {
                    Header: () => {
                        return (

                            "Is Paid "
                        )
                    },

                    accessor: 'isPaid',
                    disableFilters: true,


                },
                {
                    Header: () => {

                        // return l.date;
                        return "Note";
                    },

                    accessor: 'note',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },

                {
                    Header: () => {

                        // return l.date;
                        return "Date";
                    },

                    accessor: 'actionDate',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },




            ], [initQuery]
        )

    if (session.status === "unauthenticated") {
        return router.push('/')
    }

    if (session.status === "loading") {
        return (<>
            <Head>
                <title >{l.owee}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>
            <div className="text-center">
                {l.loading}
            </div>
        </>)

    }

    if (session.status === "authenticated") {
        return (

            <div className="">

                <Head>
                    <title >{l.loan}</title>
                </Head>
                <div className='  flex justify-end py-10'>
                    <select defaultValue={1} onChange={(e) => { setPageQarz(e.target.value) }} className="select select-info w-full max-w-xs   ">
                        <option value={1}>{l.listofcars}</option>
                        <option value={2}>{l.listofloan}</option>
                        <option value={3}>{l.mybalance}</option>
                    </select>
                </div>



                {PageQarz == 1 &&
                    <CarsTable COLUMNS={COLUMNSCars} initQuery={router.query._id} AllProducts={AllQarz} />
                }


                {PageQarz == 2 && <div>
                    <TableQarz COLUMNS={COLUMN} ID={router.query._id} AllQarz={AllQarz} />

                </div>}

                {PageQarz == 3 && <div>
                    <TableBal COLUMNS={COLUMNSBal} ID={router.query._id} AllQarz={AllQarz} />

                </div>}



            </div >
        );
    }


}

Details.Layout = AdminLayout;
export default Details;








