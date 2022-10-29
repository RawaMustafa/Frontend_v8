import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faSearch, faMoneyCheckDollar, faCar } from '@fortawesome/free-solid-svg-icons';
import useLanguage from '../../../../../Component/language';
import { useMemo, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import AdminLayout from '../../../../../Layouts/AdminLayout';
import axios from 'axios';
import Axios, { baseURL } from '../../../../api/Axios';


import ImageGallery from 'react-image-gallery';

import { InView } from 'react-intersection-observer';

import { getSession } from "next-auth/react";



export async function getServerSideProps({ req, query }) {

    const session = await getSession({ req })

    if (!session || !session?.userRole == "Admin") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }

    return {
        props: {
            initQuery: query
        }
    }
}


const Details = ({ initQuery }) => {

    const [dataQarz, setDataQarz] = useState()
    const [data, setData] = useState()
    const [dataQarzID, setdataQarzID] = useState("")
    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [PageQarz, setPageQarz] = useState(1);
    const [Limit, setLimit] = useState(40);
    const [NoCars, setNoCars] = useState(false);

    const l = useLanguage();

    const router = useRouter()



    useMemo(() => {

        const GetCars = async () => {
            try {
                const res = await Axios.get(`/qarz/${initQuery._id}/?search=${Search}&page=${Page}&limit=${Limit}`);
                const res2 = await Axios.get(`/qarz/amount/${initQuery._id}`);

                const data = await res.data;
                const dataQarzList = await res2.data.qarzList

                if (data) {

                }
                setData(data)
                setDataQarz(dataQarzList)
                setNoCars(false)
            } catch (e) {

                e.response.status == 404 &&
                    setNoCars(true)

            }

        }


        GetCars()

    }, [Search, Page, Limit, initQuery._id])



    const renderVideo = (item) => {

        return (
            <div>
                <Image width={1600} height={1040}
                    alt='Cars'
                    // objectFit='contain'
                    // lazyBoundary='20px'
                    quality={'1'}
                    className='image-gallery-image  '
                    // crossOrigin="anonymous"
                    src={item.original} />
            </div >
        );

    }

    let AllQarz = 0

    dataQarz?.map((item, index) => {
        AllQarz += item.qarAmount;

    })


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


            {
                Header: "Edit",
                disableFilters: true,



            },
            {
                Header: "Delete",

                disableFilters: true,



            },



        ]
    // )


    return (

        <div className="container mx-auto">

            <Head>
                <title >{l.allcars}</title>
            </Head>

            <div className="pt-5  mb-32 grid grid-cols-1 md:grid-cols-2 gap-10  ">


                <div className="   z-30  mx-5   ">

                    <label className="relative block max-w-[150px] lg:max-w-[300px] ">
                        <span className="sr-only">Search</span>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input onChange={(s) => { setSearch(s.target.value) }} className="placeholder:italic placeholder:text-slate-400 block  bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder={l.search} type="text" name="search" />
                    </label>

                </div>


                <div onClick={() => {
                    PageQarz == 1 && setPageQarz(2)
                    PageQarz == 2 && setPageQarz(1)
                }}
                    className="p-5 cursor-pointer  justify-self-end border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg  w-64   active:scale-[98%] hover:scale-[99%]   z-30  mx-5 ">
                    <div className="flex items-center  justify-around  ">

                        <div>
                            <div className="">{l.owee}</div>
                            <div className="text-2xl font-bold ">{AllQarz}</div>
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


            {PageQarz == 1 && <div >
                {
                    NoCars &&
                    <div className="text-center  ">
                        < Image alt="No_Car" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                    </div>
                }

                {
                    !NoCars &&
                    <>

                        <div className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-40   ">
                            {
                                data?.qarzList?.map((e, idx) => {
                                    if (!e.carId) {
                                        return ""
                                    }

                                    const dataa = []

                                    e.carId.pictureandvideorepair?.map((img, index) => {
                                        img.mimetype != "video/mp4" && dataa.push({
                                            "original": `${baseURL}${img.filename}`,
                                            "thumbnail": `/uploads/${img.filename}`,
                                            "renderItem": renderVideo


                                        })
                                    })
                                    e.carId.pictureandvideodamage?.map((img, index) => {
                                        img.mimetype != "video/mp4" && dataa.push({
                                            "original": `${baseURL}${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
                                            "renderItem": renderVideo,
                                        })
                                    })
                                    e.carId.carDamage?.map((img, index) => {
                                        img.mimetype != "video/mp4" && dataa.push({
                                            "original": `${baseURL}${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
                                            "renderItem": renderVideo,
                                        })
                                    })



                                    return (

                                        <div className="card   max-w-[400px] min-w-[300px]    bg-base-300 shadow-xl justify-self-center  " key={idx}>

                                            <figure className="  h-48 overflow-hidden scrollbar-hide  "

                                                onClick={() => {
                                                    setdataQarzID(e._id)
                                                }}
                                            >

                                                < ImageGallery
                                                    width={100}
                                                    onErrorImageURL="/Video.svg"
                                                    slideInterval={100000}
                                                    showThumbnails={false}
                                                    autoPlay={true}
                                                    lazyLoad={true}
                                                    showFullscreenButton={false}
                                                    showPlayButton={false}
                                                    items={dataa}
                                                    className="bg-base-content "
                                                />

                                            </figure>

                                            <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${e.carId.id}?Qarz=${e.id}`} key={e.carId.id}><a><div>

                                                <div className="card-body z-50">
                                                    <div className="flex justify-between  modal-middle card-title">
                                                        <h1 >{e.carId.modeName}</h1>

                                                        <div id="new_car" className=" text-info text-xs p-3">{`${l.price} ` + ":"}<label className="text-xl text-accent "> {e.carId.price}$</label> </div>

                                                    </div>

                                                    <div className="text-xl text-opacity-10">
                                                        <span className='text-xs' >VIN :</span> {e.carId.VINNumber}
                                                    </div>

                                                    <div className="card-actions justify-end">
                                                    </div>
                                                </div>

                                            </div></a></Link>
                                        </div>



                                    )

                                })










                            }
                        </div >
                        {data?.qarzList.length >= Limit &&
                            <InView rootMargin='300px'
                                as="div" onChange={(inView, entry) => {

                                    inView && setLimit(Limit + 4)
                                }} className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-20  ">


                                <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>

                                <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>

                                <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>

                                <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>



                            </InView >
                        }

                    </ >
                }




            </div>}











            {PageQarz == 2 && <div>


                <Table COLUMNS={COLUMNS} ID={router.query._id} />



            </div>}




















        </div >
    );



}

Details.Layout = AdminLayout;
export default Details;
























// import useLanguage from '../../../Component/language';
// import AdminLayout from '../../../Layouts/AdminLayout';

import { useEffect, useRef } from 'react';


// import {  DefaultColumnFilter, DateRangeColumnFilter } from '../Balance/Filter';


import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
// import { GlobalFilter } from '../Balance/GlobalFilter';

import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';



import { ToastContainer, toast, } from 'react-toastify';

import { faCalendarPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faCalendarCheck, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';





const Amount_regex = /^[0-9]{0,8}$/;
const date_regex = /^\d{4}-\d{2}-\d{2}$/;
const IsPaid_regex = /^[a-zA-Z]{0,5}$/;



const Table = ({ COLUMNS, ID }) => {

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [StartDate, setStartDate] = useState("2000-1-1");
    const [EndDate, setEndDate] = useState("2100-1-1");



    const [DataTable, setDataTable] = useState([]);

    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
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

        if (type == "number") {
            savevalue?.match(Amount_regex) == null || savevalue.match(Amount_regex)[0] != savevalue ? setAValid(false) : setAValid(true);
            savevalue = event.target.value.match(Amount_regex)?.map(Number)[0];

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

    //  inputRef?.current





    const handleUpdatQarz = async () => {



        try {


            await Axios.patch(`/qarz/${Idofrow}`, DataUpdate)
            toast.success("Data Updated Successfully")
        } catch (error) {


            error.response.status == 403 || error.response.status == 409 || error.response.status == 404 || error.response.status == 401 &&

                toast.error("Something Went Wrong")
        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                userId: ID,
                isPaid: "",
                amount: 0,
            });
            // getQarzData()
            setReNewData(true)

        }



    }

    const handledeleteQarzData = async () => {

        try {
            await Axios.delete(`/qarz/${Deletestate}`)

            toast.warn("Data Deleted Successfully")

        } catch (error) {


            error.response.status == 403 || error.response.status == 409 || error.response.status == 404 || error.response.status == 401 &&

                toast.error("Something Went Wrong")

        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                userId: "",
                isPaid: "",
                amount: 0,
            });
            // getQarzData()
            setReNewData(true)
        }



    }





    const addQarz = async () => {


        try {

            await Axios.post("/qarz/", Data)

            toast.success("Data Adeed Successfully");

        } catch (error) {
            (error.request.status === 409 || error.request.status === 403 || error.request.status === 404 || error.request.status === 401) &&
                toast.error("Data Not Added");

            // 
        } finally {

            setData({
                userId: "",
                isPaid: "",
                amount: 0,
            });
            // getQarzData()
            setReNewData(true)
        }

    }



    useEffect(() => {
        const getQarzData = async () => {
            // ${StartDate}/${EndDate}?search=${Search}&page=${Page}&limit=${Limit}
            const res = await Axios.get(`/qarz/amount/${ID}`)

            setDataTable(res.data.qarzList)
        }
        getQarzData()
        setReNewData(false)


    }, [Search, Page, Limit, StartDate, EndDate, ID, ReNewData])







    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({


            head: [[`Amount`, " pay for", "Date"]],
            body: table_td
        });


        doc.save("Table.pdf");
    };

    const table_All_pdff = () => {



        var obj = JSON.parse(JSON.stringify(DataTable))
        var res = [];
        //
        for (var i in obj)
            res.push(obj[i]);


        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({
            head: [[`Amount`, " pay for", "Date"]],
            body: res.map((d) => [d.OtherCost, d.DescCost, d.actionDate])
        });
        doc.save("ALL(Data).pdf");





    };



    const {



        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        state,
        setGlobalFilter,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        page,
        nextPage,
        previousPage,
        setPageSize,
        prepareRow,

    } = useTable({

        columns: COLUMNS,
        data: DataTable,
        // defaultColumn: { Filter: DefaultColumnFilter },

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    const { globalFilter } = state;
    const { pageIndex, pageSize } = state


    return (
        <div className="  ml-1 ">



            <div className=" flex justify-between border rounded-lg container mx-auto items-center p-2  ">

                <div>

                    <label htmlFor="my-modal" className="btn modal-button flex justify-center items-center ">
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-xl  " />
                    </label>

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
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!AValid && !AFocus && Data.amount != "" ? "block" : "hidden"}`}>
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

                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!IPValid && !IPFocus && Data.isPaid != "" ? "block" : "hidden"}`}>
                                    {l.incorrect}
                                    <br />
                                    {l.charecter416}


                                </p>

                            </div>

                            {/* 
                            <div>
                                <label htmlFor="date">{l.date}</label>
                                <input name='date' type="date" placeholder={l.date}
                                    id="date"
                                    onClick={(event) => { handleSaveQarzData(event) }}
                                    onChange={(event) => { handleSaveQarzData(event) }}
                                    onFocus={() => { setIPFocus(true) }}
                                    onBlur={() => { setIPFocus(false) }}
                                    className="input input-bordered input-info w-full max-w-xl  dark:placeholder:text-white dark:color-white" />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!IPValid && !IPFocus && Data.date != "" ? "block" : "hidden"}`}>
                                    {l.incorrect}
                                    <br />
                                </p>
                            </div> */}


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


                <div className="flex justify-center items-center lg:space-x-4">
                    <input type="search" placeholder="Search ..." className="input   input-primary  w-full max-w-xs"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />

                    <div className="dropdown dropdown-end active:scale-95">
                        <label tabIndex="0" className=" m-1">
                            <FontAwesomeIcon icon={faCalendarCheck} tabIndex="0" className="w-8 h-8 " />
                        </label>

                        <ul tabIndex="0" className="dropdown-content  shadow bg-base-100 rounded-box w-52 flex justify-center   ">
                            <li className="  py-2">

                                <div className="space-y-1">
                                    <h1>{l.from}</h1><input className="input input-bordered input-info "
                                        onChange={(e) => {
                                            setStartDate(e.target.value)
                                        }}
                                        type="date"
                                    />
                                    <h1>{l.to}</h1>
                                    <input className="input input-bordered input-info "
                                        onChange={(e) => {
                                            setEndDate(e.target.value)
                                        }}
                                        type="date"
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left ">
                        <label tabIndex="0" className=" m-1  " >
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-90 active:rotate-180 ease-in-out  transition" />
                        </label>

                        <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 flex justify-center space-y-2 ">
                            <li>  <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="btn btn-outline download-table-xls-button"
                                table="table-to-xls"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="XLSX" />  </li>

                            <li><button className='btn btn-outline ' onClick={table_2_pdf}>PDF</button> </li>
                            <li><button className='btn btn-outline' onClick={table_All_pdff}>ALL_PDF</button> </li>
                        </ul>
                    </div>


                </div>


            </div>



            <div className="flex justify-center  py-2    ">




                <table id="table-to-xls" className=" ml-1  overflow-auto inline-block   " {...getTableProps()}>


                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className="p-4 m-44      w-80   " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

                                        <span>
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
                                <tr key={idx}  {...row.getRowProps()} >
                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>


                                                {cell.column.id === 'isPaid' && row.original._id !== Idofrow && (

                                                    cell.value === true ? <FontAwesomeIcon icon={faCheck} className="text-green-500" /> : <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                                                )}
                                                { }

                                                {
                                                    cell.column.id !== "Delete" &&
                                                        cell.column.id !== "Edit" &&
                                                        row.original._id == Idofrow ?
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



                                                {row.original._id !== Idofrow ?
                                                    cell.column.id === "Edit" &&
                                                    <button ref={inputRef} onClick={() => { setIdofrow(row.original._id) }} aria-label="upload picture"   ><FontAwesomeIcon icon={faEdit} className="text-2xl cursor-pointer text-blue-500" /></button>

                                                    :
                                                    <div className=" space-x-3">
                                                        {cell.column.id === "Edit" && <button type='submit' className="btn btn-accent" disabled={AValid && IPValid ? false : true} onClick={handleUpdatQarz} > <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                        {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                    </div>


                                                }
                                                {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate(row.original._id) }}><FontAwesomeIcon icon={faTrash} className="text-2xl cursor-pointer text-red-700" /></label>}


                                            </td>

                                        )
                                    })}

                                </tr>
                            )
                        }

                        )}

                    </tbody>


                </table>
            </div >

            <div className="botom_Of_Table" >

                <div className=" flex justify-between container mx-auto items-center border rounded-xl p-3  px-1 mb-20 ">



                    <div className=" flex  space-x-5 mx-5 text-lg items-center     ">

                        <div>

                            {l.page}{""}
                            <span>
                                {pageIndex + 1}{l.of}{pageOptions.length}
                            </span>
                        </div>

                        <div>

                            <select className="select select-primary  w-full max-w-xs"
                                onChange={(e) => {
                                    setLimit((e.target.value) * 2)
                                    setPageSize(Number(e.target.value)
                                    )
                                }}

                                value={pageSize}>
                                {[1, 5, 10, 25, 50, 100, 100000].map((pageSize, idx) => (
                                    <option key={idx} value={pageSize}>
                                        {l.show} ({(pageSize !== 100000) ? pageSize : l.all})
                                    </option>))
                                }

                            </select>
                        </div>
                    </div>




                    <div className="space-x-2  overflow-auto inline-flex  scrollbar-hide ">
                        <div></div>
                        <button className="btn w-2 h-2 btn-primary   " onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"} </button>
                        <button className="btn w-2 h-2 btn-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"} </button>
                        <button className="btn w-2 h-2 btn-primary" onClick={() => nextPage()} disabled={!canNextPage}>{">"} </button>
                        <button className="btn w-2 h-2 btn-primary " onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"} </button>
                    </div>

                </div>

            </div>

            <input name="error_btn" type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
            <div className="modal  ">
                <div className="modal-box relative ">
                    <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                    <div className="text-lg font-bold text-center"><FontAwesomeIcon icon={faBan} className="text-7xl text-red-700  " /> </div>
                    <p className="py-4 ">{l.deletemsg}</p>
                    <div className="space-x-10 ">
                        <label htmlFor="my-modal-3" className="btn btn-error " onClick={handledeleteQarzData}>{l.yes}</label>
                        <label htmlFor="my-modal-3" className="btn btn-accent " onClick={() => { setDeletestate(null) }} >{l.no}</label>
                    </div>
                </div>
            </div>

        </div >

    );


}










