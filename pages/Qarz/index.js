import { InView } from 'react-intersection-observer';
import useLanguage from '../../Component/language';
import ResellerLayout from '../../Layouts/ResellerLayout';

import { useEffect, useMemo, useState, useRef } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import axios from 'axios';
import Axios, { baseURL } from '../api/Axios';

import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ImageGallery from 'react-image-gallery';

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faCalendarCheck, faFileDownload, faBan, faSave, faCheck, faTimes, faMoneyCheckDollar, faCar, faSearch } from '@fortawesome/free-solid-svg-icons';

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
    return {
        props: {
            initQuery: session.id
        }
    }
}







import Image from 'next/image';

const Qarz = ({ initQuery }) => {


    const { data: session, status } = useSession()

    const l = useLanguage();
    const [PageQarz, setPageQarz] = useState(1)
    const router = useRouter()
    const [dataQarz, setData] = useState()
    const [DataQarzAmount, setDataQarzAmount] = useState()
    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);
    const [NoCars, setNoCars] = useState(false);




    useMemo(() => {

        if (status === 'authenticated') {
            const GetCars = async () => {
                try {

                    const res = await Axios.get(`/qarz/${initQuery}/?search=${Search}&page=${Page}&limit=${Limit}`, {

                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.Token}`
                        }
                    },);



                    setNoCars(false)
                    const dataFetch = await res.data;

                    setData(dataFetch)



                } catch (e) {
                    setNoCars(true)
                    setNoCars(true)
                }

                try {
                    const res2 = await Axios.get(`/qarz/amount/${initQuery}`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.Token}`
                        }
                    },);





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

                {PageQarz == 1 &&

                    <>
                        {
                            NoCars &&
                            <div className="text-center  p-[100px]  ">
                                < Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                            </div>
                        }

                        {
                            !NoCars &&
                            <>


                                <div className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-40  ">
                                    {
                                        dataQarz?.qarzList?.map((e, idx) => {
                                            if (!e.carId) {
                                                return null;
                                            }

                                            const dataImage = []

                                            e.carId.pictureandvideorepair?.map((img, index) => {
                                                img.mimetype != "video/mp4" && dataImage.push({
                                                    "original": `${baseURL}/${img.filename}`,
                                                    "thumbnail": `/uploads/${img.filename}`,
                                                    "renderItem": renderVideo


                                                })
                                            })
                                            e.carId.pictureandvideodamage?.map((img, index) => {
                                                img.mimetype != "video/mp4" && dataImage.push({
                                                    "original": `${baseURL}/${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
                                                    "renderItem": renderVideo,
                                                })
                                            })
                                            e.carId.carDamage?.map((img, index) => {
                                                img.mimetype != "video/mp4" && dataImage.push({
                                                    "original": `${baseURL}/${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
                                                    "renderItem": renderVideo,
                                                })
                                            })

                                            return (

                                                <div className="card   max-w-[400px] min-w-[300px]    bg-base-300 shadow-xl  " key={idx}>
                                                    <figure className="  h-48 overflow-hidden scrollbar-hide  ">
                                                        < ImageGallery
                                                            width={100}
                                                            onErrorImageURL="/Video.svg"
                                                            slideInterval={100000}
                                                            showThumbnails={false}
                                                            autoPlay={true}
                                                            lazyLoad={true}
                                                            showFullscreenButton={false}
                                                            showPlayButton={false}
                                                            items={dataImage}
                                                            className="bg-base-content "
                                                        />

                                                    </figure>
                                                    <Link href={`/Qarz/details/${e.carId._id}`} ><a><div>

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
                                {dataQarz?.qarzList.length >= Limit &&
                                    <InView rootMargin='300px'
                                        as="div" onChange={(inView, entry) => {

                                            inView && setLimit(Limit + 4)
                                        }} className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-20  ">


                                        <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
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

                                        <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
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

                                        <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
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

                                        <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
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
                    </ >
                }
                {PageQarz == 2 && <div>

                    <TableQarz COLUMNS={COLUMNS} ID={initQuery} />


                </div>}


            </div >
        );

    }

}

Qarz.Layout = ResellerLayout;
export default Qarz;





const TableQarz = ({ COLUMNS, ID }) => {

    const session = useSession();
    const router = useRouter();

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [StartDate, setStartDate] = useState("2000-10-10");
    const [EndDate, setEndDate] = useState("3000-10-10");


    const [DataTable, setDataTable] = useState([]);

    const l = useLanguage();

    const [ReNewData, setReNewData] = useState(false);




    useEffect(() => {

        if (session.status === 'authenticated') {

            const getQarzData = async () => {
                // ${StartDate}/${EndDate}?search=${Search}&page=${Page}&limit=${Limit}
                const res = await Axios.get(`/qarz/amount/${ID}?${StartDate}/${EndDate}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)


                setDataTable(res.data.qarzList)
            }
            getQarzData()
            setReNewData(false)
        }

    }, [Search, Page, Limit, StartDate, EndDate, ID, ReNewData, session.status])







    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{Hawbir}`, 95, 10);

        doc.autoTable({

            head: [[`Amount`, " pay for", "Date"]],
            body: table_td
        });


        doc.save("Table.pdf");
    };





    const {



        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
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
        // defaultColumn: {Filter: DefaultColumnFilter },

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    const { globalFilter } = state;
    const { pageIndex, pageSize } = state


    return (
        <>
            <div className=" flex justify-end     p-2   ">

                <div className='flex z-[500]   '>

                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left mx-5 lg:mx-5  ">

                        <label tabIndex="0" className=" m-1   ">
                            <FontAwesomeIcon icon={faCalendarCheck} tabIndex="0" className="text-3xl  m-auto md:mx-5 active:scale-90   ease-in-out" />
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


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left mx-2 lg:mx-10">
                        <label tabIndex="0" className=" m-1  " >
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-90   ease-in-out  " />
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
                        </ul>
                    </div>

                </div>


            </div>


            <div className="  container mx-auto overflow-auto">


                <table id="table-to-xls" className=" my-10  inline-block min-w-[1000px]  " {...getTableProps()}>


                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className="p-4 m-44      w-[380px]  " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

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
                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>


                                                {cell.column.id === 'isPaid' && (

                                                    cell.value === true ? <div className="text-green-500" >Yes</div> : <div className="text-red-500" >No</div>
                                                )}


                                                {

                                                    cell.render('Cell')

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

                <div className="botom_Of_Table" >

                    <div className=" flex justify-between container mx-auto items-center    px-1 mb-20  min-w-[700px] ">



                        <div className=" flex  space-x-5 mx-5 text-lg items-center     ">

                            <div>

                                {l.page}
                                <span>
                                    {""}{pageIndex + 1}/{pageOptions.length}{""}
                                </span>
                            </div>

                            <div>

                                <select className="select select-info  w-full max-w-xs"
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
                            <button className="btn w-2 h-2 btn-info   " onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"} </button>
                            <button className="btn w-2 h-2 btn-info" onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"} </button>
                            <button className="btn w-2 h-2 btn-info" onClick={() => nextPage()} disabled={!canNextPage}>{">"} </button>
                            <button className="btn w-2 h-2 btn-info " onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"} </button>
                        </div>

                    </div>

                </div>



            </div >
        </>
    );


}


