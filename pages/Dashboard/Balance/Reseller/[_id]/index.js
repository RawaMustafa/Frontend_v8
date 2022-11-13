
// import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
// import { faSearch, } from '@fortawesome/free-solid-svg-icons';
// import useLanguage from '../../../../../Component/language';
// import { useMemo, useState } from 'react';
// import Head from 'next/head'
// import Link from 'next/link';
// import Image from 'next/image';
// import { useRouter } from 'next/router';

// import AdminLayout from '../../../../../Layouts/AdminLayout';
// import axios from 'axios';
// import Axios, { baseURL } from '../../../../api/Axios';


// import ImageGallery from 'react-image-gallery';

// import { InView } from 'react-intersection-observer';

// import { getSession,useSession } from "next-auth/react";




// export async function getServerSideProps({ req, query }) {

//     const session = await getSession({ req })

//     if (!session || session?.userRole !== "Admin") {
//         return {
//             redirect: {
//                 destination: "/",
//                 permanent: false,
//             },
//         }
//     }

//     return {
//         props: {
//             initQuery: query
//         }
//     }
// }


// const Details = ({ initQuery }) => {

//     const l = useLanguage();

//     const router = useRouter()

//     const [data, setData] = useState()
//     const [Search, setSearch] = useState("");
//     const [Page, setPage] = useState(1);
//     const [Limit, setLimit] = useState(4);
//     const [NoCars, setNoCars] = useState(false);




//     useMemo(() => {


//         const GetCars = async () => {
//             try {
//                 const res = await Axios.get(`/reseller/${initQuery._id}?search=${Search}&page=${Page}&limit=${Limit}`, {
//     headers: {
//         "Content-Type": "application/json",
//         'Authorization': `Bearer ${session?.data?.Token}`
//     }
// },);
//                 setNoCars(false)
//                 const data = await res.data;
//                 setData(data)

//             } catch (e) {

//                 e.response.status == 404 &&
//                     setNoCars(true)

//             }

//         }
//         GetCars()

//     }, [Search, Page, Limit, initQuery._id])



//     const renderVideo = (item) => {

//         return (
//             <div>
//                 <Image width={1600} height={1040}
//                     alt='Cars'
//                     // objectFit='contain'
//                     // lazyBoundary='20px'
//                     quality={'1'}
//                     className='image-gallery-image  '
//                     // crossOrigin="anonymous"
//                     src={item.original} />
//             </div >
//         );

//     }



//     return (

//         <div className="container mx-auto ">

//             <Head>
//                 <title >{l.allcars}</title>
//             </Head>

//             <div className="pt-5  mb-32">


//                 <div className="   z-30  mx-5   ">

//                     <label className="relative block max-w-[150px] lg:max-w-[300px] ">
//                         <span className="sr-only">Search</span>
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                             <FontAwesomeIcon icon={faSearch} />
//                         </span>
//                         <input onChange={(s) => { setSearch(s.target.value) }} className="placeholder:italic placeholder:text-slate-400 block  bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder={l.search} type="text" name="search" />
//                     </label>



//                 </div>
//             </div>


//             <>
//                 {
//                     NoCars &&
//                     <div className="text-center   ">
//                         < Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} clasName="" />
//                     </div>
//                 }

//                 {
//                     !NoCars &&
//                     <>


//                         <div className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-40  justify-self-center ">
//                             {
//                                 data?.carList?.map((e, idx) => {
//                                     const dataa = []

//                                     e.pictureandvideorepair?.map((img, index) => {
//                                         img.mimetype != "video/mp4" && dataa.push({
//                                             "original": `${baseURL}/${img.filename}`,
//                                             "thumbnail": `/uploads/${img.filename}`,
//                                             "renderItem": renderVideo


//                                         })
//                                     })
//                                     e.pictureandvideodamage?.map((img, index) => {
//                                         img.mimetype != "video/mp4" && dataa.push({
//                                             "original": `${baseURL}/${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
//                                             "renderItem": renderVideo,
//                                         })
//                                     })
//                                     e.carDamage?.map((img, index) => {
//                                         img.mimetype != "video/mp4" && dataa.push({
//                                             "original": `${baseURL}/${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
//                                             "renderItem": renderVideo,
//                                         })
//                                     })




//                                     //
//                                     return (





//                                         <div className="card   max-w-[400px] min-w-[300px]    bg-base-300 shadow-xl  " key={idx}>



//                                             <figure className="  h-48 overflow-hidden scrollbar-hide  ">

//                                                 < ImageGallery
//                                                     width={100}
//                                                     onErrorImageURL="/Video.svg"
//                                                     slideInterval={100000}
//                                                     showThumbnails={false}
//                                                     autoPlay={true}
//                                                     lazyLoad={true}
//                                                     showFullscreenButton={false}
//                                                     showPlayButton={false}
//                                                     items={dataa}
//                                                     className="bg-base-content "
//                                                 />

//                                             </figure>
//                                             <Link href={`/Dashboard/Balance/Reseller/${router.query._id}/details/${e._id}`} key={e._id}><a><div>

//                                                 <div className="card-body z-50">
//                                                     <div className="flex justify-between  modal-middle card-title">
//                                                         <h1 >{e.modeName}</h1>

//                                                         <div id="new_car" className=" text-info text-xs p-3">{`${l.price} ` + ":"}<label className="text-xl text-accent "> {e.price}$</label> </div>

//                                                     </div>

//                                                     <div className="text-xl text-opacity-10">
//                                                         <span className='text-xs' >VIN :</span> {e.VINNumber}
//                                                     </div>

//                                                     <div className="card-actions justify-end">
//                                                     </div>
//                                                 </div>

//                                             </div></a></Link>
//                                         </div>



//                                     )

//                                 })










//                             }
//                         </div >
//                         {data?.carList.length >= Limit &&
//                             <InView rootMargin='300px'
//                                 as="div" onChange={(inView, entry) => {

//                                     inView && setLimit(Limit + 4)
//                                 }} className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-20  ">


//                                 <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
//                                     <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
//                                         <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
//                                     </div>
//                                     <div className="flex  justify-between mb-6">
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                     </div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

//                                     <span className="sr-only">Loading...</span>
//                                 </div>

//                                 <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
//                                     <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
//                                         <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
//                                     </div>
//                                     <div className="flex  justify-between mb-6">
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                     </div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

//                                     <span className="sr-only">Loading...</span>
//                                 </div>

//                                 <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
//                                     <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
//                                         <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
//                                     </div>
//                                     <div className="flex  justify-between mb-6">
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                     </div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

//                                     <span className="sr-only">Loading...</span>
//                                 </div>

//                                 <div role="status" className="p-4 max-w-sm  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
//                                     <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
//                                         <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
//                                     </div>
//                                     <div className="flex  justify-between mb-6">
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                         <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
//                                     </div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
//                                     <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

//                                     <span className="sr-only">Loading...</span>
//                                 </div>



//                             </InView >
//                         }

//                     </ >
//                 }




//             </ >

//         </div >
//     );



// }

// Details.Layout = AdminLayout;
// export default Details;




import useLanguage from '../../../../../Component/language';
import AdminLayout from '../../../../../Layouts/AdminLayout';

import { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import Head from 'next/head'


// import { Filter, DefaultColumnFilter, dateBetweenFilterFn, DateRangeColumnFilter } from '../Balance/Filter';


import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
// import { GlobalFilter } from '../Balance/GlobalFilter';

import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


import axios from "axios"
import Axios from "../../../../api/Axios"

import { ToastContainer, toast, } from 'react-toastify';

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faTimes, faCheck, faSave, faEye, faBan, faFileDownload, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';


import { getSession, useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/router';

import Image from 'next/image';


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
    let data = "1"
    // try {
    //     const res = await Axios.get(`/reseller/${query._id}/?search=&page=1&limit=10`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': `Bearer ${session?.data?.Token}`
    //         }
    //     },)
    //     data = res.data.total
    // } catch {
    //     data = ""
    // }




    return {
        props: {

            AllProducts: data,
            initQuery: query
        }
    }
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




const ResellerTable = ({ COLUMNS, AllProducts, initQuery }) => {
    const session = useSession()

    const router = useRouter()
    const [ReNewData, setReNewData] = useState(false);

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [PageS, setPageS] = useState(Math.ceil(AllProducts / Limit));

    const [DataTable, setDataTable] = useState([]);
    const [TotalCars, setTotalCars] = useState(AllProducts);



    const [StartDate, setStartDate] = useState("2000-1-1");
    const [EndDate, setEndDate] = useState("2100-1-1");







    const l = useLanguage();

    useEffect(() => {
        const getResellerData = async () => {

            try {
                const res = await Axios.get(`/reseller/${initQuery._id}?search=${Search}&page=${Page}&limit=${Limit}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)
                const data = await res.data.carList

                setDataTable(data)
                setTotalCars(res.data.total)

            } catch (err) {

                err?.response?.status == 404 && setDataTable([])
                setPageS(1)
            }
        }
        setPageS(Math.ceil(TotalCars / Limit))
        getResellerData()
        setReNewData(false)
    }, [Search, Page, Limit, StartDate, EndDate, ReNewData])






    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent != "Details") ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        const doc = new jsPDF("p", "mm", "a2");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({


            head: [[`Price`, " Color", "Date", "Is Sold", "Mileage", "Name of Car", "Tire", "Type of Balance", "Type of Car", "Wheel Drive Type"]],
            body: table_td
        });


        doc.save("Table_Cars.pdf");
    };

    // const table_All_pdff = () => {



    //     var obj = JSON.parse(JSON.stringify(DataTable))
    //     var res = [];
    //     //
    //     for (var i in obj)
    //         res.push(obj[i]);


    //     const doc = new jsPDF("p", "mm", "a3");
    //     doc.text(`Data{ Hawbir }`, 95, 10);

    //     doc.autoTable({
    //         head: [[`Price`, " Color", "Date", "Is Sold", "Mileage", "Name of Car", "Tire", "Type of Balance", "Type of Car", "Wheel Drive Type"]],
    //         body: res.map((d) => [d.amount, d.userId, d.action, d.actionDate])
    //     });
    //     doc.save("ALL(Data).pdf");





    // };







    const {



        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        state,
        setGlobalFilter,
        allColumns,
        getToggleHideAllColumnsProps,
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

    // const { globalFilter } = state;
    const { pageIndex, pageSize } = state

    return (
        <div className="container mx-auto overflow-auto scrollbar-hide ">



            <div className=" flex justify-between  rounded-lg  items-center p-2 min-w-[700px] ">


                <input type="search" placeholder={`${l.search} ...`} className="input  input-info  w-full max-w-xs  focus:outline-0"
                    onChange={e =>
                        setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                    }
                />

                <a href="#my-modal-2" className="btn btn-outline">{l.filter}</a>
                <div className="modal" id="my-modal-2">
                    <div className="modal-box m-2">
                        <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />
                        <div className="font-bold text-lg overflow-auto max-h-52 scrollbar-hide space-y-2 ">
                            {allColumns.map(column => (
                                <div key={column.id}>
                                    <div className=" w-full  rounded-lg   ">
                                        <label className="cursor-pointer label">
                                            {column.id}
                                            <input type="checkbox" className="toggle toggle-accent focus:outline-0 " {...column.getToggleHiddenProps()} />

                                        </label>
                                    </div>
                                    {/* <input type="checkbox" {...column.getToggleHiddenProps()} />{' '} */}


                                </div>
                            ))}


                        </div>

                        <div className="modal-action">
                            <a href="#" className="btn">{l.don}</a>
                        </div>
                    </div>
                </div>





                <div className="flex justify-end ">

                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left">
                        <label tabIndex="0" className=" m-1 active:scale-9  ">
                            <FontAwesomeIcon icon={faCalendarCheck} tabIndex="0" className="w-8 h-8 active:scale-9 " />
                        </label>

                        <ul tabIndex="0" className="dropdown-content  shadow bg-base-100 rounded-box w-52 flex justify-center  ">
                            <li className="  py-2">

                                <div className="space-y-1">
                                    <h1>{l.from}</h1><input className="input input-bordered input-info  focus:outline-0 "
                                        onChange={(e) => {
                                            setStartDate(e.target.value)
                                        }}
                                        type="date"
                                    />
                                    <h1>{l.to}</h1>
                                    <input className="input input-bordered input-info  focus:outline-0"
                                        onChange={(e) => {
                                            setEndDate(e.target.value)
                                        }}
                                        type="date"
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>




                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left px-5 ">
                        <label tabIndex="0" className=" m-1  " >
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-9   ease-in-out  transition" />
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
                            {/* <li><button className='btn btn-outline' onClick={table_All_pdff}>ALL_PDF</button> </li> */}
                        </ul>
                    </div>

                </div>


            </div>




            <table id="table-to-xls" className="ml-1 my-10   " {...getTableProps()}>


                <thead className="  ">

                    {headerGroups.map((headerGroups, idx) => (

                        <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                            {headerGroups.headers.map((column, idx) => (

                                < th key={idx} className={`p-4 m-44 ${true && "min-w-[200px]"} `} {...column.getHeaderProps(column.getSortByToggleProps())} > {column.render('Header')}
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
                                {row.cells.map((cell, idx) => {
                                    return (


                                        <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>


                                            {cell.render('Cell')}



                                            {cell.column.id === 'isSold' && (

                                                cell.value === true ?
                                                    // <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                    <span className="text-green-500">Yes</span>
                                                    :
                                                    // <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                                                    <span className="text-red-500">No</span>

                                            )}

                                            {cell.column.id === "Details" &&
                                                <Link href={`/Dashboard/Balance/Reseller/${router.query._id}/details/${row.original._id}`}><a><label htmlFor="my-modal-3" className="m-0" >
                                                    <FontAwesomeIcon icon={faEye} className="text-2xl cursor-pointer text-blue-700" />
                                                </label></a></Link>

                                            }

                                            {cell.column.id === "123" &&
                                                <div>{Math.floor(cell.row.id) + 1}</div>
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
            {/* </div > */}

            {/* <div className="botom_Of_Table" > */}

            <div className=" flex justify-between container mx-auto items-center rounded-xl p-3  px-1 mb-20  min-w-[700px]">


                <div className=" flex   justify-around mx-5 text-lg items-center     ">


                    <span className="px-3">
                        {l.page}{" " + Page}/{PageS}
                    </span>




                    <div>
                        <select className="select select-info  w-full max-w-xs focus:outline-0"
                            onChange={(e) => {
                                setLimit((e.target.value))
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




                <div className="space-x-3  overflow-auto inline-flex  scrollbar-hide ">
                    <div></div>



                    <button className="btn w-2 h-2 btn-info border-0  " onClick={() =>
                        setPage(1)
                    }
                        disabled={
                            Page == 1 ? true : false
                        }
                    >{"<<"} </button>


                    <button className="btn w-2 h-2 btn-info" onClick={() =>
                        setPage(Page - 1)
                    }
                        disabled={
                            Page <= 1 ? true : false

                        }
                    >{"<"}
                    </button>


                    <button className="btn w-2 h-2 btn-info" onClick={() =>
                        Page >= 1 && setPage(Page + 1)
                    }
                        disabled={
                            Page >= PageS ? true : false
                        }
                    >{">"} </button>


                    <button className="btn w-2 h-2 btn-info "
                        onClick={() =>
                            Page >= 1 && setPage(PageS)
                        }
                        disabled={
                            Page >= PageS ? true : false
                        }
                    >{">>"} </button>



                </div>



            </div>

            {/* </div> */}



        </div >

    );


}




const Reseller = ({ AllProducts, initQuery }) => {

    const router = useRouter()
    const session = useSession();

    const COLUMNS =
        useMemo(() =>
            [


                // {
                //     Header: "123",

                //     disableFilters: true,


                // },
                {
                    Header: () => {
                        return (

                            l.price
                        )
                    },

                    disableFilters: true,

                    accessor: 'price',


                },
                {
                    Header: () => {
                        return (

                            l.color
                        )
                    },

                    disableFilters: true,

                    accessor: 'color',


                },
                // {
                //     Header: () => {
                //         return (

                //             l.date
                //         )
                //     },

                //     disableFilters: true,

                //     accessor: 'date',


                // },
                {
                    Header: () => {
                        return (

                            l.isSold
                        )
                    },

                    disableFilters: true,

                    accessor: 'isSold',


                },
                {
                    Header: () => {
                        return (

                            l.mileage
                        )
                    },

                    disableFilters: true,

                    accessor: 'mileage',


                },
                {
                    Header: () => {
                        return (

                            l.namecar
                        )
                    },

                    disableFilters: true,

                    accessor: 'modeName',


                },
                {
                    Header: () => {
                        return (

                            l.modelyear
                        )
                    },

                    disableFilters: true,

                    accessor: 'model',


                },



                {
                    Header: () => {
                        return (

                            l.tire
                        )
                    },

                    disableFilters: true,

                    accessor: 'tire',


                },

                {
                    Header: () => {
                        return (

                            l.tobalance
                        )
                    },

                    disableFilters: true,

                    accessor: 'tobalance',


                },


                {
                    Header: () => {
                        return (

                            l.tocar
                        )
                    },

                    disableFilters: true,

                    accessor: 'tocar',


                },

                {
                    Header: () => {
                        return (

                            l.wheeldrivetype
                        )
                    },

                    disableFilters: true,

                    accessor: 'wheelDriveType',


                },








                {
                    Header: "Details",

                    disableFilters: true,


                },



            ], [AllProducts]
        )

    const l = useLanguage();

    if (session.status === "loading") {
        return (
            <div className=" flex justify-center items-center h-screen text-center">
                <Head>
                    <title>{l.loading}</title>
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

                {AllProducts ?
                    <ResellerTable COLUMNS={COLUMNS} AllProducts={AllProducts} initQuery={initQuery} />


                    : <div className="m-auto top-[50%] -translate-y-[50%] absolute -translate-x-[50%] left-[50%] lg:left-[60%] ">
                        < Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                    </div>
                }



                <ToastContainer
                    draggablePercent={60}
                />


            </div>
        );
    }
}



Reseller.Layout = AdminLayout;

export default Reseller;











