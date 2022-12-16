import useLanguage from '../../../../../Component/language';
import AdminLayout from '../../../../../Layouts/AdminLayout';
import { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import Head from 'next/head'
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Axios from "../../../../api/Axios"
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faFileDownload, faCalendarCheck, faCar, faMoneyCheckDollar, faCalendarPlus, faBan, faEdit, faTrash, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { getSession, useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';


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
        let TH = []
        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (TH.push(th.children?.[0]?.innerText != "Details" ? th.children?.[0]?.innerText : ""))))
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
    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );
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
                {/* <div className="dropdown rtl:dropdown-right ltr:dropdown-left ltr:ml-8  rtl:mr-8 ">
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
                </div> */}


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
            <div className="container mx-auto overflow-auto scrollbar-hide bg-white dark:bg-[#181A1B] rounded-b-xl shadow-xl ">

                <table id="table-to-xls" className="table w-full my-10 text-sm font-normal normal-case text-center   " {...getTableProps()}>

                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className="hidden"> </th>
                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className={`p-4 m-44 py-3 ${true && "min-w-[200px]"} `} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                        <span className='font-normal normal-case '>{column.render('Header')}</span>
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
                                    <td className="hidden"> </td>

                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className="text-center py-2 dark:bg-[#181A1B] " {...cell.getCellProps()}>


                                                {cell.render('Cell')}



                                                {cell.column.id === 'isSold' && (

                                                    cell.value === true ?
                                                        <span className="text-green-500">Yes</span>
                                                        :
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

const Table = ({ COLUMNS, AllUsers, SessionID }) => {
    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);

    const router = useRouter()

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2100-01-01");

    const [PageS, setPageS] = useState(Math.ceil(AllUsers / Limit));
    const [TotalUsers, setTotalUsers] = useState(AllUsers);


    const [DataTable, setDataTable] = useState([]);


    const l = useLanguage();



    //FIXME -  pagenation notworking



    // const users = await Axios.get(`/users/detail/${SessionID}`, {
    //     headers: {
    //         "Content-Type": "application/json",

    //         'Authorization': `Bearer ${session?.data?.Token}`

    //     }
    // },)
    // setUsersBalance(users.data.userDetail.TotalBals)

    useEffect(() => {

        if (session.status === "authenticated") {
            const getExpenseData = async () => {

                try {
                    const res = await Axios.get(`/bal/${router.query._id}/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || '2000-01-01'}&edate${EndDate || "2222-01-01"}`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },
                    )
                    setDataTable(res.data.History)

                    setTotalUsers(res.data.total)
                    setPageS(Math.ceil(res.data.total / Limit))
                }
                catch {
                    setDataTable([])
                    setTotalUsers(0)
                }
            }
            getExpenseData()
            setReNewData(false)
        }
    }, [Search, Page, PageS, Limit, StartDate, EndDate, ReNewData, session.status])




    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");

        doc.autoTable({

            head: [["", `Amount`, "Action", " Cars ", "Is Soled", "Note", "Date"]],
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
        <div className=" container mx-auto  overflow-auto ">



            <table id="table-to-xls" className="table w-full my-10  inline-block   min-w-[650px] text-center text-sm" {...getTableProps()}>
                <thead className="  ">
                    {headerGroups.map((headerGroups, idx) => (

                        <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                            <th className='hidden'></th>
                            {headerGroups.headers.map((column, idx) => (

                                <th key={idx} className="font-normal normal-case  py-3 " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
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
                                <td className="hidden"></td>
                                {row.cells.map((cell, idx) => {
                                    return (
                                        <td key={idx} className=" py-2 text-center dark:bg-[#181a1b]  " {...cell.getCellProps()}>

                                            {cell.column.id === 'amount' && (
                                                <>
                                                    {cell.value * -1 >= 0 ? <div className="text-green-500">{cell.value && cell.value * -1}</div> : <div className="text-red-500">{cell.value && cell.value * -1}</div>}
                                                </>
                                            )}
                                            {cell.column.id === 'isSoled' && (
                                                <>
                                                    {cell.value == true ?
                                                        <div className="text-green-200">Yes</div> : cell.value == false ? <div className="text-red-500">No</div> : null}

                                                </>
                                            )}

                                            {cell.column.id === 'carId' && (
                                                <>

                                                    <Link href={`/Dashboard/Balance/Reseller/${router.query._id}/details/${cell.value?._id}`}><a className="text-orange-500">{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
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

    );


}



const Reseller = ({ AllProducts, initQuery }) => {

    const router = useRouter()
    const session = useSession();
    const [page, setPage] = useState(1);


    const COLUMNSReseller =
        useMemo(() =>
            [
                {
                    Header: () => {
                        return (

                            // l.namecar
                            "Name of car"
                        )
                    },

                    disableFilters: true,

                    accessor: 'modeName',


                },

                {
                    Header: () => {
                        return (

                            "Price"
                            // l.price
                        )
                    },

                    disableFilters: true,

                    accessor: 'price',


                },
                {
                    Header: () => {
                        return (

                            // l.color
                            "Color"
                        )
                    },

                    disableFilters: true,

                    accessor: 'color',


                },
                // {
                //     Header: () => {
                //         return (

                //             // l.date
                //             "Date"
                //         )
                //     },

                //     disableFilters: true,

                //     accessor: 'date',


                // },
                {
                    Header: () => {
                        return (

                            // l.isSold
                            "Is Sold"
                        )
                    },

                    disableFilters: true,

                    accessor: 'isSold',


                },
                {
                    Header: () => {
                        return (

                            // l.mileage
                            "Mileage"
                        )
                    },

                    disableFilters: true,

                    accessor: 'mileage',


                },

                {
                    Header: () => {
                        return (

                            // l.modelyear
                            "Model"
                        )
                    },

                    disableFilters: true,

                    accessor: 'model',


                },



                {
                    Header: () => {
                        return (

                            // l.tire
                            "Tire"
                        )
                    },

                    disableFilters: true,

                    accessor: 'tire',


                },

                {
                    Header: () => {
                        return (

                            // l.tobalance
                            "Type of Balance"
                        )
                    },

                    disableFilters: true,

                    accessor: 'tobalance',


                },


                {
                    Header: () => {
                        return (

                            // l.tocar
                            "Type of Car"
                        )
                    },

                    disableFilters: true,

                    accessor: 'tocar',


                },

                {
                    Header: () => {
                        return (

                            // l.wheeldrivetype
                            "Wheel Drive Type"
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
    const COLUMNTable =
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
                    <ResellerTable COLUMNS={COLUMNSReseller} AllProducts={AllProducts} initQuery={initQuery} />


                    : <div className="m-auto top-[50%] -translate-y-[50%] absolute -translate-x-[50%] left-[50%] lg:left-[60%] ">
                        < Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                    </div>)
                }

                {page == 2 &&
                    <Table COLUMNS={COLUMNTable} SessionID={session?.data.id} AllUsers={1} />

                }



            </div>
        );
    }
}



Reseller.Layout = AdminLayout;

export default Reseller;











