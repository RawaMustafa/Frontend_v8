
import useLanguage from '../../../../../Component/language';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ToastContainer, toast, } from 'react-toastify';
import AdminLayout from '../../../../../Layouts/AdminLayout';
import axios from 'axios';
import Axios from '../../../../api/Axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faCalendarCheck, faFileDownload, faBan, faSave, faCheck, faTimes, faMoneyCheckDollar, faCar, faSearch, faEye, faHandHoldingDollar, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { faAmazonPay } from "@fortawesome/free-brands-svg-icons"
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import { useEffect, useMemo, useRef, forwardRef, useState } from 'react';
import { getSession, useSession } from "next-auth/react";
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';


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


    const COLUMNS =
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

            <div className="container mx-auto">

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
                    <CarsTable COLUMNS={COLUMNS} initQuery={router.query._id} AllProducts={AllQarz} />
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



const TableQarz = ({ COLUMNS, ID, AllQarz }) => {

    const session = useSession();
    const router = useRouter();

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [PageS, setPageS] = useState(Math.ceil(AllQarz / Limit));
    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2500-01-01");



    const [DataTable, setDataTable] = useState([]);

    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
    const [Paystate, setPaystate] = useState(null);
    const [Data, setData] = useState({
        userId: ID,
        isPaid: "",
        amount: 0,
    });

    const [DataUpdate, setDataUpdate] = useState({
        userId: ID,
        isPaid: "",
        amount: 0,
    });


    const l = useLanguage();

    const [ReNewData, setReNewData] = useState(false);


    const [AFocus, setAFocus] = useState(false);
    const [IPFocus, setIPFocus] = useState(false);
    const [DEFocus, setDEFocus] = useState(false);


    const [AValid, setAValid] = useState(false)
    const [IPValid, setIPValid] = useState(false)
    const [DValid, setDValid] = useState(false)

    const ARef = useRef();
    const IPRef = useRef();
    const DERef = useRef();
    const inputRef = useRef();


    const handleSaveQarzData = (event) => {
        const savename = event.target.getAttribute('name')
        const savevalue = event.target.value;
        const type = event.target.getAttribute('type')




        if (savename == "isPaid") {

            savevalue = event.target.value.match(IsPaid_regex)?.[0];
            savevalue?.match(IsPaid_regex) == null || savevalue.match(IsPaid_regex)[0] != savevalue ? setIPValid(false) : setIPValid(true);

        }

        if (savename == "amount") {


            savevalue = event.target.value.match(Amount_regex)?.[0];
            savevalue?.match(Amount_regex) == null || savevalue.match(Amount_regex)[0] != savevalue ? setAValid(false) : setAValid(true);



        }

        // if (savename == "date") {
        //     savevalue?.match(date_regex) == null || savevalue.match(date_regex)[0] != savevalue ? setIPValid(false) : setIPValid(true);
        //     savevalue = event.target.value.match(date_regex)?.map(String)[0];
        // }



        const newdata = { ...Data }
        newdata[savename] = savevalue;
        setData(newdata);


    }


    let count = 0



    useEffect(() => {


        ARef.current?.value?.match(Amount_regex) == null || ARef.current.value?.match(Amount_regex)[0] != ARef.current.value ? setAValid(false) : setAValid(true);


        IPRef.current?.value?.match(IsPaid_regex) == null || IPRef.current.value?.match(IsPaid_regex)[0] != IPRef.current.value ? setIPValid(false) : setIPValid(true);




        const newdataUpdate = { ...DataUpdate }


        newdataUpdate.amount = ARef.current?.value.match(Amount_regex)?.map(String)[0];


        newdataUpdate.isPaid = IPRef.current?.value.match(IsPaid_regex)?.map(String)[0];





        setDataUpdate(newdataUpdate);





    }, [ARef.current?.value, IPRef.current?.value, count])


    const handlePay = async (Pay) => {

        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }

        const UDetails = await Axios.get(`/users/detail/${session?.data.id}`, auth)
        const DataBalance = UDetails.data.userDetail.TotalBals

        const Qarz = await Axios.get(`/users/detail/${ID}`, auth)
        const QarzBalance = Qarz.data.userDetail.TotalBals


        if (Pay == false) {
            try {

                await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": Math.floor(DataBalance) + Math.floor(Paystate?.[2]) }, auth)
                await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance + Math.floor(Paystate?.[2]) }, auth)

                toast.success("Your Balance Now= " + (Math.floor(DataBalance) + Math.floor(Paystate?.[2])) + " $");


                await Axios.post("/bal/",
                    {
                        amount: Math.floor(Paystate?.[2]),
                        action: "Loan",
                        isPaid: false,
                        note: "Borrow",
                        userId: router.query._id,
                    }, auth)


                await Axios.patch(`/qarz/${Paystate?.[0]}`,
                    { isPaid: false }
                    , auth)

                toast.success("Data Updated Successfully")

                setPaystate(null);
                setReNewData(true)
            } catch {
                toast.error("Something went wrong  *")
            }

        }
        if (Pay == true) {
            if (DataBalance >= Paystate?.[2]) {
                try {

                    await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": Math.floor(DataBalance) - Math.floor(Paystate?.[2]) }, auth)
                    await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance - Math.floor(Paystate?.[2]) }, auth)

                    toast.success("Your Balance Now= " + (Math.floor(DataBalance) - Math.floor(Paystate?.[2])) + " $");


                    await Axios.post("/bal/",
                        {
                            amount: -Math.floor(Paystate?.[2]),
                            action: "Loan",
                            isPaid: true,
                            note: "Repayment",
                            userId: router.query._id,
                        }, auth)


                    await Axios.patch(`/qarz/${Paystate?.[0]}`,
                        { isPaid: true }
                        , auth)

                    toast.success("Data Updated Successfully")

                    setPaystate(null)
                    setReNewData(true)
                } catch {
                    toast.error("Something went wrong  *")
                }
            } else {

                toast.error("You don't have enough balance")

            }
        }
    }


    const handleUpdatQarz = async () => {
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }
        const UDetails = await Axios.get(`/users/detail/${session?.data.id}`, auth)
        const DataBalance = UDetails.data.userDetail.TotalBals

        const Qarz = await Axios.get(`/users/detail/${ID}`, auth)
        const QarzBalance = Qarz.data.userDetail.TotalBals


        if (DataUpdate.isPaid == "true" && Idofrow?.[1] == false) {
            const donebalance = Math.floor(DataUpdate.amount) + Math.floor(Idofrow?.[2])
            try {
                if (donebalance <= DataBalance) {

                    await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": Math.floor(DataBalance) - Math.floor(donebalance) }, auth)
                    await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance - Math.floor(donebalance) }, auth)

                    toast.success("Your Balance Now= " + (Math.floor(DataBalance) - Math.floor(donebalance)) + " $");


                    await Axios.post("/bal/",
                        {
                            amount: donebalance,
                            action: "Loan",
                            isPaid: true,
                            note: "Repayment",
                            userId: router.query._id,
                        }, auth)


                    await Axios.patch(`/qarz/${Idofrow?.[0]}`, DataUpdate, auth)

                    toast.success("Data Updated Successfully")

                    setIdofrow(null);
                    setDeletestate(null);
                    setData({
                        userId: ID,
                        isPaid: "",
                        amount: 0,
                    });
                    setReNewData(true)


                }
                else {

                    toast.error("Your Balance is not enough");
                }

            } catch {
                toast.error("Something went wrong  *")
            }


        }
        if (DataUpdate.isPaid == "false" && Idofrow?.[1] == true) {

            const donebalance = Math.floor(DataUpdate.amount) + Idofrow?.[2]
            try {


                await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": Math.floor(DataBalance) + Math.floor(donebalance) }, auth)
                await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance + Math.floor(donebalance) }, auth)
                toast.success("Your Balance Now= " + (Math.floor(DataBalance) + Math.floor(donebalance)) + " $");


                await Axios.post("/bal/",
                    {
                        amount: -donebalance,
                        action: "Loan",
                        isPaid: false,
                        note: "Repayment",
                        userId: router.query._id,
                    }, auth)


                await Axios.patch(`/qarz/${Idofrow?.[0]}`, DataUpdate, auth)

                toast.success("Data Updated Successfully")

                setIdofrow(null);
                setDeletestate(null);
                setData({
                    userId: ID,
                    isPaid: "",
                    amount: 0,
                });
                setReNewData(true)



            } catch {

                toast.error("Something went wrong  *")


            }


        }

        if (DataUpdate.isPaid == "false" && Idofrow?.[1] == false) {

            const donebalance = Math.floor(DataUpdate.amount) - Idofrow?.[2]
            try {


                await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": Math.floor(DataBalance) + Math.floor(donebalance) }, auth)
                await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance + Math.floor(donebalance) }, auth)
                toast.success("Your Balance Now= " + (Math.floor(DataBalance) + Math.floor(donebalance)) + " $");


                await Axios.post("/bal/",
                    {
                        amount: -donebalance,
                        action: "Loan",
                        isPaid: false,
                        note: "Repayment",
                        userId: router.query._id,
                    }, auth)


                await Axios.patch(`/qarz/${Idofrow?.[0]}`, DataUpdate, auth)

                toast.success("Data Updated Successfully")

                setIdofrow(null);
                setDeletestate(null);
                setData({
                    userId: ID,
                    isPaid: "",
                    amount: 0,
                });
                setReNewData(true)



            } catch {

                toast.error("Something went wrong  *")


            }


        }

        if (DataUpdate.isPaid == "true" && Idofrow?.[1] == true) {

            const donebalance = Math.floor(DataUpdate.amount) - Idofrow?.[2]
            try {


                await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": Math.floor(DataBalance) - Math.floor(donebalance) }, auth)
                await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance - Math.floor(donebalance) }, auth)
                toast.success("Your Balance Now= " + (Math.floor(DataBalance) - Math.floor(donebalance)) + " $");


                await Axios.post("/bal/",
                    {
                        amount: donebalance,
                        action: "Loan",
                        isPaid: true,
                        note: "Repayment",
                        userId: router.query._id,
                    }, auth)


                await Axios.patch(`/qarz/${Idofrow?.[0]}`, DataUpdate, auth)

                toast.success("Data Updated Successfully")

                setIdofrow(null);
                setDeletestate(null);
                setData({
                    userId: ID,
                    isPaid: "",
                    amount: 0,
                });
                setReNewData(true)



            } catch {
                toast.error("Something went wrong  *")
            }


        }
        // else if (DataUpdate.isPaid == "false" && Idofrow?.[1] == true) {


        //     try {


        //         const UDetails = await Axios.get(`/users/detail/${session?.data.id}`, {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 'Authorization': `Bearer ${session?.data?.Token}`
        //             }
        //         },)

        //         const DataBalance = Math.floor(UDetails.data.userDetail.TotalBals)




        //         await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": DataBalance + Math.floor(DataUpdate.amount) }, {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 'Authorization': `Bearer ${session?.data?.Token}`
        //             }
        //         },)

        //         toast.success("Your Balance Now= " + (DataBalance + Math.floor(DataUpdate.amount)) + " $");




        //         await Axios.post("/bal/",
        //             {
        //                 amount: DataUpdate.amount,
        //                 action: "Loan",
        //                 userId: router.query._id,
        //             }, {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 'Authorization': `Bearer ${session?.data?.Token}`
        //             }
        //         },)

        //         try {

        //             await Axios.patch(`/qarz/${Idofrow?.[0]}`, DataUpdate, {
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     'Authorization': `Bearer ${session?.data?.Token}`
        //                 }
        //             },)
        //             toast.success("Data Updated Successfully")
        //         } catch (error) {

        //             toast.error("Something Went Wrong *")
        //         } finally {

        //             setIdofrow(null);
        //             setDeletestate(null);
        //             setData({
        //                 userId: ID,
        //                 isPaid: "",
        //                 amount: 0,
        //             });
        //             // getQarzData()
        //             setReNewData(true)

        //         }












        //     } catch {

        //         toast.error("Something Went Wrong with Admin balance *")


        //     }



        // }


        // else if (DataUpdate.isPaid == Idofrow?.[1]) {



        //     try {

        //         await Axios.patch(`/qarz/${Idofrow?.[0]}`, DataUpdate, {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 'Authorization': `Bearer ${session?.data?.Token}`
        //             }
        //         },)
        //         toast.success("Data Updated Successfully")
        //     } catch (error) {

        //         toast.error("Something Went Wrong *")
        //     } finally {

        //         setIdofrow(null);
        //         setDeletestate(null);
        //         setData({
        //             userId: ID,
        //             isPaid: "",
        //             amount: 0,
        //         });
        //         // getQarzData()
        //         setReNewData(true)

        //     }
        // }



    }

    const handledeleteQarzData = async () => {
        const auth =
        {
            headers: {
                "Content-Type": "application/json",

                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }

        const UDetails = await Axios.get(`/users/detail/${session?.data.id}`, auth)
        const DataBalance = UDetails.data.userDetail.TotalBals

        const Qarz = await Axios.get(`/users/detail/${ID}`, auth)
        const QarzBalance = Qarz.data.userDetail.TotalBals


        if (Deletestate?.[1] == false) {
            if (DataBalance >= Deletestate?.[2]) {
                await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": DataBalance - Math.floor(Deletestate?.[2]) }, auth)
                await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance - Math.floor(Deletestate?.[2]) }, auth)

                await Axios.post("/bal/", {
                    amount: -Deletestate?.[2],
                    action: "Loan",
                    userId: ID,
                    note: "Deleted",
                    isPaid: true,
                }, auth)
                await Axios.delete(`/qarz/${Deletestate?.[0]}`, auth)

                setIdofrow(null);
                setDeletestate(null)
                setReNewData(true)

            }
            else {
                toast.error("don't have enough balance")
            }
        }
        if (Deletestate?.[1] == true) {

            try {
                await Axios.delete(`/qarz/${Deletestate?.[0]}`, auth)
                await Axios.post("/bal/", {
                    amount: 0,
                    action: "Loan",
                    userId: ID,
                    note: "Deleted",
                    isPaid: true,
                }, auth)
                toast.warn("Data Deleted Successfully")

            } catch (error) {
                toast.error("Something Went Wrong *")
            } finally {
                setIdofrow(null);
                setDeletestate(null);
                setReNewData(true)
            }

        }

    }





    const addQarz = async () => {

        const auth =
        {
            headers: {
                "Content-Type": "application/json",

                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }


        const UDetails = await Axios.get(`/users/detail/${session?.data.id}`, auth)

        const DataBalance = UDetails.data.userDetail.TotalBals
        const Qarz = await Axios.get(`/users/detail/${ID}`, auth)

        const QarzBalance = Qarz.data.userDetail.TotalBals
        if (Data?.isPaid == 'false') {
            try {
                await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": DataBalance + Math.floor(Data.amount) }, auth)
                await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance + Math.floor(Data.amount) }, auth)

                await Axios.post("/qarz/", {
                    amount: Data?.amount,
                    isPaid: Data?.isPaid,
                    userId: ID

                }, auth)

                await Axios.post("/bal/", {
                    amount: Data.amount,
                    action: "Loan",
                    userId: ID,
                    isPaid: true

                }, auth)

                toast.success("Data Adeed Successfully");


            } catch (error) {
                toast.error("Data Not Added *");
            }
            setReNewData(true)


        }


        if (Data?.isPaid == 'true') {



            if (DataBalance >= Data.amount) {
                try {
                    await Axios.patch(`/users/${session?.data.id}`, { "TotalBals": DataBalance - Math.floor(Data.amount) }, auth)
                    await Axios.patch(`/users/${ID}`, { "TotalBals": QarzBalance - Math.floor(Data.amount) }, auth)

                    await Axios.post("/qarz/", {
                        amount: Data?.amount,
                        isPaid: Data?.isPaid,
                        userId: ID

                    }, auth)

                    await Axios.post("/bal/", {
                        amount: -Data.amount,
                        action: "Loan",
                        userId: ID,
                        isPaid: true

                    }, auth)

                    toast.success("Data Adeed Successfully");


                } catch (error) {
                    toast.error("Data Not Added *");
                }
                setReNewData(true)

            } else {
                toast.error("You don't have enough money")

            }
        }
    }



    useEffect(() => {

        if (session.status === 'authenticated') {

            const getQarzData = async () => {
                // ${StartDate}/${EndDate}?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate}&edate=${EndDate}
                const res = await Axios.get(`/qarz/amount/${ID}/?&page=${Page}&limit=${Limit}&sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2500-01-01"}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                const data = await res.data.qarzList.map((e) => { return e.id }).length
                setDataTable(res.data.qarzList)

                setPageS(1)


            }
            getQarzData()
            setReNewData(false)

        }

    }, [Search, Page, Limit, StartDate, EndDate, ID, ReNewData, session?.data?.Token])








    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{Hawbir}`, 95, 10);

        doc.autoTable({


            head: [["", `Amount`, " pay for", "Date"]],
            body: table_td
        });


        doc.save("Table.pdf");
    };



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
        page,
        setPageSize,
        prepareRow,

    } = useTable({

        columns: COLUMNS,
        data: DataTable,

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    const { globalFilter } = state;
    const { pageIndex, pageSize } = state


    return (
        <div className=" ">



            {/* //?    Heade */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-2xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

                    <label htmlFor="my-modal" className="p-2 px-3 flex justify-center items-center hover:cursor-pointer ">
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-2xl active:scale-90 " />
                    </label>
                    <input type="search" placeholder={`${l.search} ...`} className="input input-bordered    w-full    focus:outline-0   h-9 "
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>
                <div className="dropdown rtl:dropdown-right ltr:dropdown-left ltr:ml-8  rtl:mr-8 ">
                    <label tabIndex="0" className="active:scale-9 m-1  ">
                        <FontAwesomeIcon icon={CALLENDER} tabIndex="0" className="active:scale-90 text-2xl hover:cursor-pointer text-blue-500  " />
                    </label>

                    <ul tabIndex="0" className="dropdown-content bg-base-100 rounded-box w-52 flex justify-center shadow">
                        <li className=" py-2">

                            <div className="space-y-1">
                                <h1>{l.from}</h1><input className="input input-bordered input-info focus:outline-0 "
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                    }}
                                    type="date"
                                />
                                <h1>{l.to}</h1>
                                <input className="input input-bordered input-info focus:outline-0"
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                    }}
                                    type="date"
                                />
                            </div>
                        </li>
                    </ul>
                </div>




            </div>
            <div>


                <input type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box space-y-12">

                        <div>{l.owee}</div>
                        <div>
                            <label htmlFor="date">{l.amount}</label>

                            <input
                                required name='amount' type="number" placeholder={l.amount}
                                onClick={(event) => { handleSaveQarzData(event) }}
                                onChange={(event) => { handleSaveQarzData(event) }}
                                onFocus={() => { setAFocus(true) }}
                                onBlur={() => { setAFocus(false) }}

                                className="input input-bordered input-info w-full max-w-xl mt-5 dark:placeholder:text-white dark:color-white"
                            />
                            <p id="password-error" className={`bg-rose-700 rounded m-1 text-sm p-2 text-black  ${!AValid && !AFocus && Data.amount != "" ? "block" : "hidden"}`}>
                                {l.incorrect}
                                <br />
                                {l.number7}


                            </p>

                        </div>
                        <div>
                            <label htmlFor="ispaid">{l.ispaid}</label>
                            <select
                                id="ispaid"
                                onChange={(event) => { handleSaveQarzData(event) }}
                                onClick={(event) => { handleSaveQarzData(event) }}
                                onFocus={() => { setAFocus(true) }}
                                onBlur={() => { setAFocus(false) }}
                                name='isPaid' className="input input-bordered input-info  w-full max-w-xl " >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>

                            <p id="password-error" className={`bg-rose-700 rounded m-1 text-sm p-2 text-black  ${!IPValid && !IPFocus && Data.isPaid != "" ? "block" : "hidden"}`}>
                                {l.incorrect}
                                <br />
                                {l.charecter416}


                            </p>

                        </div>


                        <div className="modal-action">
                            <div></div>
                            <label htmlFor="my-modal" className="btn btn-error"  >{l.cancel}</label>
                            <label htmlFor="my-modal" onSubmit={(e) => { e.click() }}   >
                                <input type="submit" className="btn btn-success" disabled={IPValid && AValid ? false : true} onClick={addQarz} value={l.add} />
                            </label>

                        </div>

                    </div>
                </div>
            </div>
            {/* //?    Heade */}

            <div className="text-center  container mx-auto overflow-auto  scrollbar-hide  bg-white dark:bg-[#181A1B] rounded-b-xl shadow-xl">

                <table id="table-to-xls" className="table table-compact text-center font-normal my-10    min-w-[650px]  " {...getTableProps()}>

                    <thead className="  ">
                        {headerGroups.map((headerGroups, idx) => (
                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>
                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className="p-4 m-44  w-[380px] py-3 font-normal  normal-case " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? " ↑ " : " 🡓 ") : ""}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        )
                        )
                        }
                    </thead >
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, idx) => {

                            prepareRow(row)
                            return (
                                <tr key={idx}  {...row.getRowProps()} >
                                    <td className='hidden'></td>

                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className="dark:bg-[#181a1b]  text-center   py-2" {...cell.getCellProps()}>


                                                {cell.column.id === 'isPaid' && row.original._id !== Idofrow?.[0] && (

                                                    cell.value === true ? <div className="text-green-700" >Yes</div> : <div className="text-red-700" >No</div>
                                                )}
                                                {cell.column.id === 'Pay' && row.original._id !== Idofrow?.[0] && (

                                                    row.original.isPaid ? <label htmlFor="Borrow-Mod" className="btn btn-error p-2" onClick={() => { setPaystate([row.original._id, row.original.isPaid, row.original.qarAmount]) }}>{l.borrowing}
                                                    </label> : <label htmlFor="Pay-Mod" className="btn btn-accent p-2" onClick={() => { setPaystate([row.original._id, row.original.isPaid, row.original.qarAmount]) }}>{l.pay}
                                                    </label>
                                                )
                                                }


                                                {
                                                    cell.column.id !== "Delete" &&
                                                        cell.column.id !== "Edit" &&
                                                        row.original._id == Idofrow?.[0] ?
                                                        <>

                                                            {cell.column.id == "qarAmount" && <input defaultValue={row.original.qarAmount}
                                                                ref={ARef}
                                                                onChange={(event) => { handleSaveQarzData(event) }}
                                                                onClick={(event) => { handleSaveQarzData(event) }}
                                                                onFocus={() => { setAFocus(true) }}
                                                                onBlur={() => { setAFocus(false) }}

                                                                type="number" placeholder={cell.column.id} name='cost' className="input input-bordered input-warning w-full max-w-xs" />}

                                                            {cell.column.id == "isPaid" &&
                                                                <select defaultValue={row.original.isPaid}
                                                                    ref={IPRef}
                                                                    onChange={(event) => { handleSaveQarzData(event) }}
                                                                    onClick={(event) => { handleSaveQarzData(event) }}
                                                                    onFocus={() => { setAFocus(true) }}
                                                                    onBlur={() => { setAFocus(false) }}
                                                                    name='isPaid' className="input input-bordered input-warning w-full max-w-xs" >
                                                                    <option value="true">Yes</option>
                                                                    <option value="false">No</option>
                                                                </select>}
                                                            {cell.column.id == "dates" && <input
                                                                disabled
                                                                defaultValue={row.original.dates}
                                                                onChange={(event) => { handleSaveQarzData(event) }}
                                                                onClick={(event) => { handleSaveQarzData(event) }}
                                                                onFocus={() => { setIPFocus(true) }}
                                                                onBlur={() => { setIPFocus(false) }}

                                                                name='date' type="date" placeholder={l.date} className="input input-warning   w-full max-w-xl  " />}


                                                        </>

                                                        :
                                                        cell.render('Cell')

                                                }



                                                {
                                                    row.original._id !== Idofrow?.[0] ?
                                                        cell.column.id === "Edit" &&
                                                        <button ref={inputRef} onClick={() => { setIdofrow([row.original._id, row.original.isPaid, row.original.qarAmount]) }} aria-label="upload picture"   ><FontAwesomeIcon icon={faEdit} className="text-2xl cursor-pointer text-blue-500" /></button>

                                                        :
                                                        <div className=" space-x-3">
                                                            {cell.column.id === "Edit" && <button type='submit' className="btn btn-accent" disabled={AValid && IPValid ? false : true} onClick={handleUpdatQarz} > <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                            {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                        </div>


                                                }
                                                {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate([row.original._id, row.original.isPaid, row.original.qarAmount]) }}><FontAwesomeIcon icon={faTrash} className="text-2xl cursor-pointer text-red-700" /></label>}


                                            </td>

                                        )
                                    })}

                                </tr>
                            )
                        }

                        )}

                    </tbody>


                </table>

                {/* //?    botom */}
                <div className="container text-sm  scale-90  ">

                    <div className=" flex justify-between container mx-auto items-center rounded-xl mb-5  px-1  min-w-[700px] text-sm  ">


                        <div className=" flex items-center justify-around mx-5 bg-center space-x-2">

                            <div></div>
                            <FontAwesomeIcon icon={faAnglesLeft} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer "
                                onClick={() => Page > 1 && setPage(1)}
                                disabled={Page == 1 ? true : false} />

                            <FontAwesomeIcon icon={faChevronLeft} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page > 1 && setPage(Page - 1)}
                                disabled={Page == 1 ? true : false} />



                            <span className="px-20 py-2 rounded bg-slate-100 dark:bg-gray-700">
                                {Page}/{PageS}
                            </span>



                            <FontAwesomeIcon icon={faChevronRight} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(Page + 1))}
                                disabled={Page >= PageS ? true : false} />

                            <FontAwesomeIcon icon={faAnglesRight} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(PageS))}
                                disabled={Page >= PageS ? true : false} />


                            <div>
                                <select className="select  select-sm w-20 focus:outline-0 input-sm dark:bg-gray-700   max-w-xs text-sm"
                                    onChange={(e) => {
                                        setLimit((e.target.value))
                                        setPageSize(Number(e.target.value)
                                        )
                                        setPage(1)
                                    }}

                                    value={pageSize}>
                                    {[1, 5, 10, 25, 50, 100, 100000].map((pageSize, idx) => (
                                        <option className='text-end' key={idx} value={pageSize}>
                                            {(pageSize !== 100000) ? pageSize : l.all}
                                        </option>))
                                    }

                                </select>
                            </div>

                            <FontAwesomeIcon icon={PDF} onClick={table_2_pdf} className="md:mx-5 px-10 text-blue-400 active:scale-9 m-auto mx-10 text-2xl transition ease-in-out hover:cursor-pointer" />

                            <ReactHTMLTableToExcel
                                id="test-table-xls-button "
                                className="text-2xl active:scale-90"
                                table="table-to-xls"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="📋"
                                icon={PDF}
                            />



                        </div>



                        <div className="scrollbar-hide inline-flex space-x-3 overflow-auto">
                            <div></div>



                        </div>



                    </div>



                </div >
                {/* //?    botom */}



                {/* //?    modal */}

                <div>

                    <input name="error_btn" type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <div className="text-lg font-bold text-center"><FontAwesomeIcon icon={faBan} className="text-7xl text-red-700  " /> </div>
                            <p className="py-10 text-start">{l.deletemsg}</p>
                            <div className="space-x-10 ">
                                <label htmlFor="my-modal-3" className="btn btn-error " onClick={handledeleteQarzData}>{l.yes}</label>
                                <label htmlFor="my-modal-3" className="btn btn-accent " onClick={() => { setDeletestate(null) }} >{l.no}</label>
                            </div>
                        </div>
                    </div>


                    <input name="error_btn" type="checkbox" id="Pay-Mod" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="Pay-Mod" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <div className="text-lg font-bold text-center"><FontAwesomeIcon icon={faAmazonPay} className="text-7xl text-green-700  " /> </div>
                            <p className="py-10 text-start">{l.paymsg}</p>
                            <div className="text-end">
                                <label htmlFor="Pay-Mod" className="btn  btn-accent mx-10" onClick={() => handlePay(true)}>{l.yes}</label>
                                <label htmlFor="Pay-Mod" className="btn btn-error " onClick={() => { setPaystate(null) }} >{l.no}</label>
                            </div>
                        </div>
                    </div>

                    <input name="error_btn" type="checkbox" id="Borrow-Mod" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="Borrow-Mod" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <div className="text-lg font-bold text-center"><FontAwesomeIcon icon={faHandHoldingDollar} className="text-7xl text-red-700  " /> </div>
                            <p className="py-10 text-start ">{l.borrowmsg}</p>
                            <div className="text-end">
                                <label htmlFor="Borrow-Mod" className="btn  btn-accent mx-10" onClick={() => handlePay(false)}>{l.yes}</label>
                                <label htmlFor="Borrow-Mod" className="btn btn-error " onClick={() => { setPaystate(null) }} >{l.no}</label>
                            </div>
                        </div>
                    </div>
                </div>



                <ToastContainer
                    draggablePercent={60}
                />
            </div >
        </div >

    );


}


const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef()
        const resolvedRef = ref || defaultRef
        const l = useLanguage();
        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return <div className="w-full    " >

            <label className="cursor-pointer label my-2 ">
                {l.all}
                <input type="checkbox" className="toggle toggle-accent focus:outline-0  " ref={resolvedRef}  {...rest} />

            </label>
            <hr />
        </div >
    }
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'





const CarsTable = ({ COLUMNS, AllProducts, initQuery }) => {

    const session = useSession()
    const router = useRouter()
    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);
    const [PageS, setPageS] = useState(Math.ceil(AllProducts / Limit));
    const [DataTable, setDataTable] = useState([]);
    const [TotalCars, setTotalCars] = useState(AllProducts);
    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2500-01-01");
    const l = useLanguage();



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
                    const one = `/qarz/${initQuery}/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2200-01-01"}`


                    const response1 = await Axios.get(one, Auth).then((res) => {
                        return res
                    }).catch(() => {
                    });


                    await axios.all([response1]).then(

                        axios.spread((...responses) => {
                            setDataTable(responses?.[0]?.data.qarzList || [])
                            setPageS(Math.ceil(responses?.[0]?.data.total / Limit))

                        })).catch((e) => {
                            setDataTable([])
                        })



                } catch {


                    setDataTable([])


                }

            }


            GetCars()
        }

    }, [Search, Page, Limit, initQuery._id, session.status, StartDate, EndDate])




    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')

        let TH = []
        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (TH.push(th.children?.[0].innerText != "Details" ? th.children?.[0].innerText : ""))))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        const doc = new jsPDF("p", "mm", "a2");



        doc.autoTable({
            head: [TH],
            body: table_td,

        })


        doc.save("Table_Cars.pdf");
    };





    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
        allColumns,
        getToggleHideAllColumnsProps,
        page,
        setPageSize,
        prepareRow,

    } = useTable({

        columns: COLUMNS,
        data: DataTable,
        // defaultColumn: { Filter: DefaultColumnFilter },

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    // const { globalFilter } = state;
    const { pageIndex, pageSize } = state

    return (
        <div className="  ">

            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

                    <a href="#my-modal-2" className=" flex  mx-2" ><FontAwesomeIcon className='text-2xl hover:scale-90 mx-1' icon={faBars} /></a>
                    <input type="search" placeholder={`${l.search} ...`} className="input input-bordered    w-full    focus:outline-0   h-9 "
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>
                <div className="dropdown rtl:dropdown-right ltr:dropdown-left ltr:ml-8  rtl:mr-8 ">
                    <label tabIndex="0" className="active:scale-9 m-1  ">
                        <FontAwesomeIcon icon={CALLENDER} tabIndex="0" className="active:scale-90 text-2xl hover:cursor-pointer text-blue-500  " />
                    </label>

                    <ul tabIndex="0" className="dropdown-content bg-base-100 rounded-box w-52 flex justify-center shadow">
                        <li className=" py-2">

                            <div className="space-y-1">
                                <h1>{l.from}</h1><input className="input input-bordered input-info focus:outline-0 "
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                    }}
                                    type="date"
                                />
                                <h1>{l.to}</h1>
                                <input className="input input-bordered input-info focus:outline-0"
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                    }}
                                    type="date"
                                />
                            </div>
                        </li>
                    </ul>
                </div>


                <div className="modal" id="my-modal-2">
                    <div className="modal-box m-2">
                        <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />
                        <div className="max-h-80 scrollbar-hide space-y-2 overflow-auto text-lg font-bold">
                            {allColumns.map(column => (
                                <div key={column.id}>
                                    <div className=" w-full rounded-lg">
                                        <label className="label cursor-pointer">
                                            {column.id}
                                            <input type="checkbox" className="toggle toggle-accent focus:outline-0 " {...column.getToggleHiddenProps()} />

                                        </label>
                                    </div>


                                </div>
                            ))}


                        </div>

                        <div className="modal-action">
                            <a href="#" className="btn">{l.don}</a>
                        </div>
                    </div>
                </div>

            </div>
            {/* //?   Header  */}


            <div className=" overflow-auto bg-white dark:bg-[#181A1B] rounded-b-xl shadow-xl ">



                <table id="table-to-xls" className="table w-full    my-10 text-center font-normal normal-case  " {...getTableProps()}>


                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>

                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className={` ${true && "min-w-[100px]"} `} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                        <span className='normal-case   '>{column.render('Header')}</span>
                                        <span  >
                                            {column.isSorted ? (column.isSortedDesc ? "<" : ">") : ""}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        )
                        )
                        }
                    </thead >
                    <tbody {...getTableBodyProps()}>

                        {page.map((row, idx) => {

                            prepareRow(row)
                            return (
                                <tr key={idx}   {...row.getRowProps()} >
                                    <td className='hidden'></td>
                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className=" text-center  py-2 dark:bg-[#181A1B] " {...cell.getCellProps()}>


                                                {(cell.column.id != 'carId') && cell.render('Cell')}

                                                {cell.column.id === 'carId' && (

                                                    <>
                                                        <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original?.carId?.id}?Qarz=${row.original.id}`}><a>{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'model' && (

                                                    <>
                                                        <span className="">{row.original.carId?.model}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'tocar' && (

                                                    <>
                                                        <span className="">{row.original.carId?.tocar}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'price' && (

                                                    <>
                                                        <span className="">{row.original.carId?.price}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'isSold' && (


                                                    row.original.carId?.isSold === true ?
                                                        <span className="text-green-700">Yes</span>
                                                        :
                                                        <span className="text-red-700">No</span>


                                                )
                                                }


                                                {cell.column.id === 'isPaid' && (

                                                    cell.value === true ?
                                                        <span className="text-green-700">Yes</span>
                                                        :
                                                        <span className="text-red-700">No</span>

                                                )}
                                                {cell.column.id === "Details" &&

                                                    <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original?.carId?.id}?Qarz=${row.original?.id}`}><a  >
                                                        <label>
                                                            <FontAwesomeIcon icon={faEye} className="text-2xl cursor-pointer text-blue-800 " />
                                                        </label>
                                                    </a>
                                                    </Link>

                                                }



                                            </td>

                                        )
                                    })}

                                </tr>
                            )
                        }

                        )}

                    </tbody>


                </table>


                {/* //?    botom */}
                <div className="text-sm  scale-90  ">

                    <div className=" flex justify-between container mx-auto items-center rounded-xl mb-5  px-1  min-w-[700px] text-sm  ">


                        <div className=" flex items-center justify-around mx-5 bg-center space-x-2">

                            <div></div>
                            <FontAwesomeIcon icon={faAnglesLeft} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer "
                                onClick={() => Page > 1 && setPage(1)}
                                disabled={Page == 1 ? true : false} />

                            <FontAwesomeIcon icon={faChevronLeft} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page > 1 && setPage(Page - 1)}
                                disabled={Page == 1 ? true : false} />



                            <span className="px-20 py-2 rounded bg-slate-100 dark:bg-gray-700">
                                {Page}/{PageS}
                            </span>



                            <FontAwesomeIcon icon={faChevronRight} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(Page + 1))}
                                disabled={Page >= PageS ? true : false} />

                            <FontAwesomeIcon icon={faAnglesRight} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(PageS))}
                                disabled={Page >= PageS ? true : false} />


                            <div>
                                <select className="select  select-sm w-20 focus:outline-0 input-sm dark:bg-gray-700   max-w-xs text-sm"
                                    onChange={(e) => {
                                        setLimit((e.target.value))
                                        setPageSize(Number(e.target.value)
                                        )
                                        setPage(1)
                                    }}

                                    value={pageSize}>
                                    {[1, 5, 10, 25, 50, 100, 100000].map((pageSize, idx) => (
                                        <option className='text-end' key={idx} value={pageSize}>
                                            {(pageSize !== 100000) ? pageSize : l.all}
                                        </option>))
                                    }

                                </select>
                            </div>

                            <FontAwesomeIcon icon={PDF} onClick={table_2_pdf} className="md:mx-5 px-10 text-blue-400 active:scale-9 m-auto mx-10 text-2xl transition ease-in-out hover:cursor-pointer" />

                            <ReactHTMLTableToExcel
                                id="test-table-xls-button "
                                className="text-2xl active:scale-90"
                                table="table-to-xls"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="📋"
                                icon={PDF}
                            />



                        </div>



                        <div className="scrollbar-hide inline-flex space-x-3 overflow-auto">
                            <div></div>



                        </div>



                    </div>



                </div >
                {/* //?    botom */}



            </div >
        </div >

    );


}



const TableBal = ({ COLUMNS, AllBal }) => {
    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);
    const router = useRouter()

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);
    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2500-01-01");
    const [PageS, setPageS] = useState(Math.ceil(AllBal / Limit));
    const [DataTable, setDataTable] = useState([]);


    const l = useLanguage();




    useEffect(() => {

        if (session.status === "authenticated") {
            const getQarzData = async () => {
                try {
                    const res = await Axios.get(`/bal/${router.query._id}/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || '2000-01-01'}&edate${EndDate || "2500-01-01"}`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)



                    setDataTable(res.data.History)
                    setPageS(Math.ceil(res.data.total / Limit))
                } catch (e) {

                    setDataTable([])
                }
            }
            getQarzData()
            setReNewData(false)
        }
    }, [Search, Page, Limit, StartDate, EndDate, ReNewData, session.status])








    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({


            head: [["", `Amount`, " User Id", "Action", "Note", "Date"]],
            body: table_td
        });


        doc.save("Table.pdf");
    };





    const {


        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
        page,
        setPageSize,
        prepareRow,

    } = useTable({

        columns: COLUMNS,
        data: DataTable,
        // defaultColumn: { Filter: DefaultColumnFilter },

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    // const { globalFilter } = state;
    const { pageIndex, pageSize } = state


    return (
        <div className=" ">
            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

                    <input type="search" placeholder={`${l.search} ...`} className="input input-bordered    w-full    focus:outline-0   h-9 "
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>
                <div className="dropdown rtl:dropdown-right ltr:dropdown-left ltr:ml-8  rtl:mr-8 ">
                    <label tabIndex="0" className="active:scale-9 m-1  ">
                        <FontAwesomeIcon icon={CALLENDER} tabIndex="0" className="active:scale-90 text-2xl hover:cursor-pointer text-blue-500  " />
                    </label>

                    <ul tabIndex="0" className="dropdown-content bg-base-100 rounded-box w-52 flex justify-center shadow">
                        <li className=" py-2">

                            <div className="space-y-1">
                                <h1>{l.from}</h1><input className="input input-bordered input-info focus:outline-0 "
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                    }}
                                    type="date"
                                />
                                <h1>{l.to}</h1>
                                <input className="input input-bordered input-info focus:outline-0"
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                    }}
                                    type="date"
                                />
                            </div>
                        </li>
                    </ul>
                </div>


            </div>
            {/* //?   Header  */}


            <div className="overflow-auto bg-white  dark:bg-[#181A1B] rounded-b-xl shadow-xl  ">

                <table id="table-to-xls" className="table w-full my-10 text-sm text-center font-normal  " {...getTableProps()}>
                    <thead className="  ">
                        {headerGroups.map((headerGroups, idx) => (
                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>
                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className=" min-w-[120px] normal-case py-2 " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? " ↑ " : " 🡓 ") : ""}

                                        </span>



                                    </th>



                                ))}

                            </tr>

                        )
                        )


                        }

                    </thead >


                    <tbody {...getTableBodyProps()}>

                        {page.map((row, idx) => {
                            prepareRow(row)
                            return (
                                <tr key={idx}   {...row.getRowProps()} >
                                    <td className='hidden'></td>

                                    {row.cells.map((cell, idx) => {
                                        return (

                                            <td key={idx} className="dark:bg-[#181a1b]  text-center   py-3 overflow-auto" {...cell.getCellProps()}>



                                                {cell.column.id === 'amount' && (
                                                    <>
                                                        {cell.value * -1 >= 0 ? <div className="text-green-700">{cell.value * -1}</div> : <div className="text-red-700">{cell.value * -1}</div>
                                                        } </>
                                                )}

                                                {cell.column.id === 'isPaid' && (
                                                    <>


                                                        {cell.value == true ?
                                                            <div className="text-green-700">Yes</div> : cell.value == false ? <div className="text-red-700">No</div> : null}




                                                    </>

                                                )}

                                                {cell.column.id === 'carId' && (
                                                    <>

                                                        <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}`}><a className="text-orange-700">{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
                                                    </>

                                                )
                                                }
                                                {
                                                    (cell.column.id === 'amount' || cell.column.id === 'carId') || cell.render('Cell')
                                                }


                                            </td>

                                        )
                                    })}

                                </tr>
                            )
                        }

                        )}

                    </tbody>


                </table>

                {/* //?    botom */}
                <div className="container text-sm  scale-90  ">

                    <div className=" flex justify-between container mx-auto items-center rounded-xl mb-5  px-1  min-w-[700px] text-sm  ">


                        <div className=" flex items-center justify-around mx-5 bg-center space-x-2">

                            <div></div>
                            <FontAwesomeIcon icon={faAnglesLeft} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer "
                                onClick={() => Page > 1 && setPage(1)}
                                disabled={Page == 1 ? true : false} />

                            <FontAwesomeIcon icon={faChevronLeft} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page > 1 && setPage(Page - 1)}
                                disabled={Page == 1 ? true : false} />



                            <span className="px-20 py-2 rounded bg-slate-100 dark:bg-gray-700">
                                {Page}/{PageS}
                            </span>



                            <FontAwesomeIcon icon={faChevronRight} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(Page + 1))}
                                disabled={Page >= PageS ? true : false} />

                            <FontAwesomeIcon icon={faAnglesRight} className=" bg-slate-100 dark:bg-gray-700 px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(PageS))}
                                disabled={Page >= PageS ? true : false} />


                            <div>
                                <select className="select  select-sm w-20 focus:outline-0 input-sm dark:bg-gray-700   max-w-xs text-sm"
                                    onChange={(e) => {
                                        setLimit((e.target.value))
                                        setPageSize(Number(e.target.value)
                                        )
                                        setPage(1)
                                    }}

                                    value={pageSize}>
                                    {[1, 5, 10, 25, 50, 100, 100000].map((pageSize, idx) => (
                                        <option className='text-end' key={idx} value={pageSize}>
                                            {(pageSize !== 100000) ? pageSize : l.all}
                                        </option>))
                                    }

                                </select>
                            </div>

                            <FontAwesomeIcon icon={PDF} onClick={table_2_pdf} className="md:mx-5 px-10 text-blue-400 active:scale-9 m-auto mx-10 text-2xl transition ease-in-out hover:cursor-pointer" />

                            <ReactHTMLTableToExcel
                                id="test-table-xls-button "
                                className="text-2xl active:scale-90"
                                table="table-to-xls"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="📋"
                                icon={PDF}
                            />



                        </div>



                        <div className="scrollbar-hide inline-flex space-x-3 overflow-auto">
                            <div></div>



                        </div>



                    </div>



                </div >
                {/* //?    botom */}



            </div >
        </div >

    );


}



