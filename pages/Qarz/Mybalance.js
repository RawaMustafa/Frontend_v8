

import useLanguage from '../../Component/language';
import QarzLayout from '../../Layouts/QarzLayout';



import { useEffect, useMemo, useState, useRef } from 'react';
import Head from 'next/head'


// import { Filter, DefaultColumnFilter, dateBetweenFilterFn, DateRangeColumnFilter } from '../Balance/Filter';


import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
// import { GlobalFilter } from '../Balance/GlobalFilter';

import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


import axios from "axios"
import Axios from "../api/Axios"

import { ToastContainer, toast, } from 'react-toastify';

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';






export const getServerSideProps = async ({ req }) => {

    const session = await getSession({ req })



    if (!session || session?.userRole !== "Qarz") {
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

const TableQarz = ({ COLUMNS, AllBal }) => {
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
            const getQarzData = async () => {
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


            head: [[`Amount`, " User Id", "Action", "Note", "Date"]],
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
        <div className=" container mx-auto  overflow-auto ">



            <div className=" flex justify-between   container mx-auto items-center p-2 min-w-[700px] ">


                <div className="flex">

                    <input type="search" placeholder={`${l.search} ...`} className="input   input-info  w-full max-w-xs mx-5 focus:outline-0"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>


                <div className="flex justify-center items-center lg:space-x-4 ">


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left ">

                        {/* //TODO -  fix Date */}
                        <label tabIndex="0" className=" m-1 active:scale-95 ">
                            <FontAwesomeIcon icon={faCalendarCheck} tabIndex="0" className="w-8 h-8 active:scale-95 " />
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
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-90   ease-in-out  transition" />
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



            <table id="table-to-xls" className="my-10  inline-block   min-w-[1000px] " {...getTableProps()}>


                <thead className="  ">

                    {headerGroups.map((headerGroups, idx) => (

                        <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                            {headerGroups.headers.map((column, idx) => (

                                <th key={idx} className="p-4 m-44 w-[400px]   " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

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
                                {row.cells.map((cell, idx) => {
                                    return (

                                        <td key={idx} className="  text-center   py-3 overflow-auto" {...cell.getCellProps()}>



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

            <div className="botom_Of_Table" >

                <div className=" flex justify-between container mx-auto items-center   p-3  px-1 mb-20  min-w-[700px] ">



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

            </div>



        </div >

    );


}




const Qarz = ({ SessionID, AllBal }) => {

    const session = useSession()
    const router = useRouter()



    const l = useLanguage();

    const COLUMNSQarz =
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





                <TableQarz COLUMNS={COLUMNSQarz} SessionID={SessionID} AllBal={AllBal} />





                <ToastContainer
                    draggablePercent={60}
                />


            </ >
        );
    }
}



Qarz.Layout = QarzLayout;




export default Qarz;






