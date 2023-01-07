import useLanguage from '../../Component/language';
import ResellerLayout from '../../Layouts/ResellerLayout';
import { useEffect, useMemo, useState, useRef } from 'react';
import Head from 'next/head'
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import axios from "axios"
import Axios from "../api/Axios"
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast, } from 'react-toastify';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faCalendarCheck, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';






export const getServerSideProps = async ({ req }) => {

    const session = await getSession({ req })



    if (!session || session?.userRole !== "Reseller") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }

    let data
    try {
        const res = await Axios.get(`/bal/${session?.id}?page=1&limit=10`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.Token}`
                }
            }
        )
        data = await res.data.total
    } catch {
        data = 1
    }

    return {
        props: {

            AllBal: data,
        }
    }
}


const Table = ({ COLUMNS, AllBal }) => {

    
    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);
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
            const getExpenseData = async () => {
                try {
                    const res = await Axios.get(`/bal/${session?.data.id}/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || '2000-01-01'}&edate${EndDate || "2500-01-01"}`, {
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
            getExpenseData()
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


            head: [["",`Amount`,  "Action"," Car ", "Note", "Date"]],
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
    const { pageIndex, pageSize } = state


    return (
        <div className="">
            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-2xl p-5">
                {/* <div className="flex items-center bg-white rounded-lg shadow w-72 dark:bg-gray-600 ">

                    <a href="#my-modal-2" className="flex mx-2 " ><FontAwesomeIcon className='mx-1 text-2xl hover:scale-90' icon={faBars} /></a>
                    <input type="search" placeholder={`${l.search} ...`} className="w-full input input-bordered focus:outline-0 h-9 "
                        onChange={e =>
                            {/* setSearch(e.target.value.match(/^[a-zA-Z0-9]*)?.[0]) */}
                        {/* }
                    />
                </div>  */}
                <div></div>
                <div className="dropdown rtl:dropdown-right ltr:dropdown-left ltr:ml-8 rtl:mr-8 ">
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
                </div>
            </div>
            {/* //?   Header  */}


            <div className="overflow-x-auto  bg-white dark:bg-[#181A1B] rounded-b-xl   w-full  ">

                <table id="table-to-xls" className="table w-full my-5 text-sm text-center min-w-[700px]" {...getTableProps()}>
                    <thead className="">
                        {headerGroups.map((headerGroups, idx) => (
                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>

                                {headerGroups.headers.map((column, idx) => (
                                    <th key={idx} className="p-4 m-44 w-[400px] py-3 font-normal normal-case bg-[#3ea7e1] text-white  " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
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
                                            <td key={idx} className="dark:bg-[#181A1B]  text-center   py-2  " {...cell.getCellProps()}>

                                                {cell.column.id === 'amount' && (
                                                    <>
                                                        {cell.value >= 0 ? <div className="text-green-500">{cell.value}</div> : <div className="text-red-500">{cell.value}</div>
                                                        } </>
                                                )}

                                                {cell.column.id === 'isSoled' && (
                                                    <>


                                                        {cell.value == true ?
                                                            <div className="text-green-200">Yes</div> : cell.value == false ? <div className="text-red-500">No</div> : null}




                                                    </>

                                                )}

                                                {cell.column.id === 'carId' && (
                                                    <>

                                                        <Link href={`/Reseller/details/${cell.value?._id}`}><a className="text-orange-500">{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
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
                <div className="container text-sm scale-90 ">

                    <div className=" flex justify-between container mx-auto items-center rounded-xl mb-5  px-1  min-w-[700px] text-sm  ">


                        <div className="flex items-center justify-around mx-5 space-x-2 bg-center ">

                            <div></div>
                            <FontAwesomeIcon icon={faAnglesLeft} className=" bg-[#3ea7e1] text-white  px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer "
                                onClick={() => Page > 1 && setPage(1)}
                                disabled={Page == 1 ? true : false} />

                            <FontAwesomeIcon icon={faChevronLeft} className=" bg-[#3ea7e1] text-white  px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page > 1 && setPage(Page - 1)}
                                disabled={Page == 1 ? true : false} />



                            <span className="px-20 py-2 rounded bg-[#3ea7e1] text-white ">
                                {Page}/{PageS}
                            </span>



                            <FontAwesomeIcon icon={faChevronRight} className=" bg-[#3ea7e1] text-white  px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(Page + 1))}
                                disabled={Page >= PageS ? true : false} />

                            <FontAwesomeIcon icon={faAnglesRight} className=" bg-[#3ea7e1] text-white  px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(PageS))}
                                disabled={Page >= PageS ? true : false} />


                            <div>
                                <select className="w-20 max-w-xs text-sm select select-sm focus:outline-0 input-sm bg-[#3ea7e1] text-white "
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

                            <FontAwesomeIcon icon={PDF} onClick={table_2_pdf} className="px-10 m-auto mx-10 text-2xl text-blue-400 transition ease-in-out md:mx-5 active:scale-9 hover:cursor-pointer" />

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



                        <div className="inline-flex space-x-3 overflow-auto scrollbar-hide">
                            <div></div>



                        </div>



                    </div>



                </div >
                {/* //?    botom */}


            </div >
        </div >
    );
}




const Expense = ({ SessionID, AllBal }) => {

    const session = useSession()
    const router = useRouter()



    const l = useLanguage();

    const COLUMNS =
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

                // {
                //     Header: () => {
                //         return (

                //             "Is Soled "
                //         )
                //     },

                //     accessor: 'isSoled',
                //     disableFilters: true,


                // },
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




            ], [SessionID]
        )



    if (session.status === "loading") {
        return (<>
            <Head>
                <title >{l.mybalance}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>
            <div className="text-center">
                {l.loading}
            </div>
        </>)
    }

    if (session.status === "unauthenticated") {
        return router.push("/")
    }

    if (session.status === "authenticated") {
        return (


            < >
                <Head>
                    <title >{l.mybalance}</title>
                </Head>





                <Table COLUMNS={COLUMNS} SessionID={SessionID} AllBal={AllBal} />





                <ToastContainer
                    draggablePercent={60}
                />


            </ >
        );
    }
}



Expense.Layout = ResellerLayout;




export default Expense;






