import useLanguage from '../../Component/language';
import ResellerLayout from '../../Layouts/ResellerLayout';
import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Axios, { baseURL } from '../api/Axios';
import Image from 'next/image';
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { faFilePdf as PDF, faCalendarCheck as CALLENDER, faCircleXmark, } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faFileDownload, faCalendarCheck, faAnglesLeft, faChevronRight, faAnglesRight, faChevronLeft, faBars, faStar, } from '@fortawesome/free-solid-svg-icons';



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

    let data = 1
    try {
        const res = await Axios.get(`/reseller/${session.id}/?search=&page=1&limit=10`)
        data = res.data.total

    } catch {
        data = 1
    }




    return {
        props: {

            AllProducts: data,
            initQuery: session.id
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

        return <div className="w-full " >

            <label className="my-2 cursor-pointer label ">
                {l.all}
                <input type="checkbox" className="toggle toggle-accent focus:outline-0 " ref={resolvedRef}  {...rest} />

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
    const [TotalBalsData, setTotalBalsData] = useState([]);
    const [TotalCars, setTotalCars] = useState(AllProducts);



    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2100-01-01");







    const l = useLanguage();



    useEffect(() => {
        if (session.status === "authenticated") {
            const getResellerData = async () => {
                //$sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2100-01-01"}
                ///cars/ ? search =& page=1 & limit=3sdate = 2000 - 02 - 01 & edate=2023 - 11 - 17 & arrKu=1 & arrDu=1 & isSold=0
                try {
                    const res = await Axios.get(`/cars?search=${Search}&page=${Page}&limit=${Limit}$sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2100-01-01"}&&visibility=`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)
                    const data = await res.data.carDetail


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
        }

    }, [Search, Page, Limit, StartDate, EndDate, ReNewData, session.status])




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

        <>




            <div className="" >

                {/* //?   Header  */}
                <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-xl p-5">

                    <div className="flex items-center bg-white rounded-lg shadow w-72 dark:bg-gray-600 ">

                        <a href="#my-modal-2" className="flex mx-2 " ><FontAwesomeIcon className='mx-1 text-2xl hover:scale-90' icon={faBars} /></a>
                        <input type="search" placeholder={`${l.search} ...`} className="w-full input input-bordered focus:outline-0 h-9 "
                            onChange={e =>
                                setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                            }
                        />
                    </div>
                    {/* <div className="dropdown rtl:dropdown-right ltr:dropdown-left ltr:ml-8 rtl:mr-8 ">
                        <label tabIndex="0" className="m-1 active:scale-9 ">
                            <FontAwesomeIcon icon={CALLENDER} tabIndex="0" className="text-2xl text-blue-500 active:scale-90 hover:cursor-pointer " />
                        </label>

                        <ul tabIndex="0" className="flex justify-center shadow dropdown-content bg-base-100 rounded-box w-52">
                            <li className="py-2 ">

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
                    </div> */}


                    <div className="modal" id="my-modal-2">
                        <div className="m-2 modal-box">
                            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />
                            <div className="space-y-2 overflow-auto text-lg font-bold max-h-80 scrollbar-hide">
                                {allColumns.map(column => (
                                    <div key={column.id}>
                                        <div className="w-full rounded-lg ">
                                            <label className="cursor-pointer label">
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

                <div className="Desktop:overflow-auto  bg-white dark:bg-[#181A1B] rounded-b-xl shadow-xl ">


                    {/* //?   Table  */}

                    <table id="table-to-xls" className="table w-full my-10 text-center Mobile:hidden" {...getTableProps()}>

                        <thead className="">
                            {headerGroups.map((headerGroups, idx) => (

                                <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                    <th className='hidden'></th>
                                    {headerGroups.headers.map((column, idx) => (

                                        < th key={idx} className={`py-3 bg-[#3ea7e1] text-white  text-white ${column.id == "image" && "w-20  max-w-[100px] "}  `} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                            <span  >{column.render('Header')} </span>
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


                                                <td key={idx} className={`dark:bg-[#181A1B] text-center py-2  ${cell.column.id == "image" && "w-20   p-0"} `} {...cell.getCellProps()}>


                                                    {cell.render('Cell')}

                                                    {cell.column.id === "image" && (
                                                        <>
                                                            <Link href={`/Reseller/details/${row.original._id}`}><a className=''><Image
                                                                src={`${baseURL}/${row.original.FirstImage?.[0]?.filename || row.original.carDamage?.[0]?.filename}`} objectFit='cover' alt="Image" height={100} width={120} /></a></Link>

                                                        </>)

                                                    }

                                                    {cell.column.id === 'isSold' && (

                                                        cell.value === true ?
                                                            // <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                            <span className="text-green-500">Yes</span>
                                                            :
                                                            // <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                                                            <span className="text-red-500">No</span>

                                                    )}

                                                    {cell.column.id === "Details" &&
                                                        <Link href={`/Reseller/details/${row.original._id}`}><a><label htmlFor="my-modal-3" className="m-0" >
                                                            <FontAwesomeIcon icon={faEye} className="text-2xl text-blue-700 cursor-pointer" />
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
                    {/* //?   Table  */}




                    {/* //?   Cards  */}

                    <div className='mx-2 mb-20 Desktop:hidden'>
                        <div className='grid justify-center grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 '>
                            {DataTable?.map((car, idx) => {

                                return (
                                    <div className="w-full  overflow-hidden bg-white dark:bg-[#181a1b] rounded shadow-xl  border">
                                        <div className='px-2 py-3 border-b-2 text-[#1254ff] text-xl'>{car.model} {car.modeName}</div>
                                        <div className='flex bg-[#f5f9fd'>
                                            <figure className='w-36'><Image src={`${baseURL}/${car.FirstImage ? car.FirstImage?.[0]?.filename : car.carDamage?.[0]?.filename}`} width={200} height={200} alt="Album" /></figure>
                                            <div className="p-3 text-sm">
                                                <h2 className="text-sm text-black dark:text-white">{l.mileage}</h2>
                                                <p>{car.mileage} </p>
                                                <h2 className="">{l.price}:</h2>
                                                <p>{car.price} </p>
                                                <h2 className="">{l.wheeldrivetype}:</h2>
                                                <p>{car.wheelDriveType} </p>

                                            </div>
                                        </div>
                                        <div className='flex '>
                                            <Link href={`/Reseller/details/${car._id}`} className='w-full h-full p-0 m-0 bg-[#FFB838] py-2 text-black  active:scale-[101.5%]  '><a className='w-full h-full p-0 m-0 bg-[#FFB838] py-2 text-black  active:scale-[101.5%] text-center'> <span> {l.detail}</span>
                                                {" "} <FontAwesomeIcon className=' rotate-[45deg] font-thin text-sm' icon={faCircleXmark} /></a>
                                            </Link>
                                            <Link href={`/Reseller/details/${car._id}`} className='w-full h-full p-0 m-0 bg-[#ffff] py-2 text-black shadow-slate-100  shadow-inner flex justify-center items-center hover:bg-slate-50  dark:bg-[#181a1b]   active:scale-[101.5%]'>
                                                <a className='w-full h-full p-0 m-0 bg-[#ffff] py-2 text-black shadow-slate-100  shadow-inner flex justify-center items-center hover:bg-slate-50  dark:bg-[#181a1b]   active:scale-[101.5%]'><FontAwesomeIcon className='text-[#FFB838] ' icon={faStar} />
                                                    <p className='text-[#1254ff] font-bold px-1 '>{l.watch}</p></a>
                                            </Link>
                                            <button className='w-full h-full p-0 m-0 bg-[#ffff] py-2 text-black shadow-slate-100  shadow-inner  dark:bg-[#181a1b] dark:text-white active:scale-[101.5%]'>soon ...</button>
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    </div>

                    {/* //?   Cards  */}



                    {/* //?    botom */}
                    <div className="text-sm mb-96 bg-white dark:bg-[#181A1B] ">

                        <div className="flex items-center justify-between px-1 mb-5 text-sm rounded-xl">


                            <div className="flex items-center space-x-2 ">
                                <div ></div>
                                <FontAwesomeIcon icon={faAnglesLeft} className="w-2 px-2 py-1.5 rounded text-white bg-[#3ea7e1]    active:scale-95 hover:cursor-pointer"
                                    onClick={() => Page > 1 && setPage(1)}
                                    disabled={Page == 1 ? true : false} />

                                <FontAwesomeIcon icon={faChevronLeft} className="w-2 px-2 py-1.5 rounded text-white  bg-[#3ea7e1]  active:scale-95 hover:cursor-pointer"
                                    onClick={() => Page > 1 && setPage(Page - 1)}
                                    disabled={Page == 1 ? true : false} />



                                <span className="px-10 py-1 rounded text-white bg-[#3ea7e1] ">
                                    {Page}/{PageS}
                                </span>

                                <FontAwesomeIcon icon={faChevronRight} className=" bg-[#3ea7e1] text-white  px-2 w-2 py-1.5 rounded active:scale-95 hover:cursor-pointer"
                                    onClick={() => Page < PageS && (Page >= 1 && setPage(Page + 1))}
                                    disabled={Page >= PageS ? true : false} />

                                <FontAwesomeIcon icon={faAnglesRight} className=" bg-[#3ea7e1] text-white  px-2 w-2 py-1.5 rounded active:scale-95 hover:cursor-pointer"
                                    onClick={() => Page < PageS && (Page >= 1 && setPage(PageS))}
                                    disabled={Page >= PageS ? true : false} />


                                <div>
                                    <select className="w-10  max-w-xs text-sm select select-xs focus:outline-0 input-sm text-white bg-[#3ea7e1] "
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


                                {/* <FontAwesomeIcon icon={PDF} onClick={table_2_pdf} className="px-10 m-auto mx-10 text-2xl text-blue-400 transition ease-in-out Mobile:hidden md:mx-5 active:scale-9 hover:cursor-pointer" />

                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button "
                                    className="text-2xl active:scale-90 Mobile:hidden"
                                    table="table-to-xls"
                                    filename="tablexls"
                                    sheet="tablexls"
                                    buttonText="📋"
                                    icon={PDF}
                                /> */}


                            </div>

                        </div>


                    </div >

                    <div></div>
                    {/* //?    botom */}

                </div >
            </div >
        </>
    );


}



const Reseller = ({ AllProducts, initQuery }) => {


    const session = useSession()
    const l = useLanguage();


    const COLUMNS =
        useMemo(() =>
            [



                {
                    Header: "Image",

                    disableFilters: true,

                    accessor: 'image',


                },

                {
                    Header: "Name",

                    disableFilters: true,

                    accessor: 'modeName',


                },

                {
                    Header: "Model year",

                    disableFilters: true,

                    accessor: 'model',


                },

                {
                    Header: "Color",

                    disableFilters: true,

                    accessor: 'color',


                },

                {
                    Header: "Mileage",

                    disableFilters: true,

                    accessor: 'mileage',


                },

                {
                    Header: "Price",

                    disableFilters: true,

                    accessor: 'price',


                },

                {
                    Header: "Date",

                    disableFilters: true,

                    accessor: 'date',


                },
                {
                    Header: "Sold",

                    disableFilters: true,

                    accessor: 'isSold',


                },




                {
                    Header: "Car Type",

                    disableFilters: true,

                    accessor: 'tocar',


                },

                {
                    Header: "Whieel Drive",

                    disableFilters: true,

                    accessor: 'wheelDriveType',


                },

                {
                    Header: "Details",
                    disableFilters: true,
                },



            ], [AllProducts]
        )





    if (session.status === "loading") {
        return <div className="flex items-center justify-center h-screen">
            <Head>
                <title >{l.loading}</title>
            </Head>
            <div className="">
                {l.loading}
            </div>
        </div>
    }

    if (session.status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-screen">
                <Head>
                    <title >{l.unauthenticated}</title>
                </Head>
                <div className="text-2xl text-red-500">Unauthenticated</div>
            </div>
        )
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




            </div>
        );
    }
}

Reseller.Layout = ResellerLayout;
export default Reseller;


