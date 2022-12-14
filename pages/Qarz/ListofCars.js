import useLanguage from '../../Component/language';
import QarzLayout from '../../Layouts/QarzLayout';
import { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import axios from 'axios';
import Axios, { baseURL } from '../api/Axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faCalendarCheck, faFileDownload, faMoneyCheckDollar, faCar, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars, } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';





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


    let data
    try {
        const res = await Axios.get(`/qarz/amount/${query._id}/?&page=1&limit=1`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.Token}`
            }
        },)
        data = await res.data.qarzList.map((e) => { return e.id }).length


    } catch {
        data = 4
    }



    return {
        props: {
            initQuery: session.id,
            AllQarz: data,

        }
    }



}








const Qarz = ({ initQuery, AllQarz }) => {


    const { data: session, status } = useSession()

    const l = useLanguage();
    const router = useRouter()




    if (status == "unauthenticated") {
        router.push('/');
    }

    if (status == "loading") {

        return (<>
            <Head>
                <title >{l.listofcars}</title>
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

                        // l.ispaid
                        "Is Paid"
                    )
                },

                accessor: 'isPaid',
                disableFilters: true,


            },
            {
                Header: () => {

                    // return l.date;
                    return "Date";
                },

                accessor: 'dates',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },

            {
                Header: () => {

                    // return l.detail;
                    return "Details";
                },

                accessor: 'Details',
                disableFilters: false,
                // Filter: DateRangeColumnFilter,
                // filter: dateBetweenFilterFn,

            },






        ]
    // )
    if (status == "authenticated") {




        return (

            <div className="container mx-auto  footer-center pt-10 ">

                <Head>
                    <title >{l.listofcars}</title>
                </Head>

                <CarsTable COLUMNS={COLUMNS} initQuery={initQuery} AllProducts={AllQarz} />

            </div >
        );

    }

}

Qarz.Layout = QarzLayout;
export default Qarz;







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



    const [StartDate, setStartDate] = useState("2000-1-1");
    const [EndDate, setEndDate] = useState("2100-1-1");







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
                    // &sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2200-01-01"}
                    const one = `/qarz/${initQuery}?search=${Search}&page=${Page}&limit=${Limit}`

                    const response1 = await Axios.get(one, Auth).then((res) => {
                        return res
                    }).catch(() => {

                    });


                    await axios.all([response1]).then(
                        axios.spread((...responses) => {
                            setDataTable(responses?.[0]?.data.qarzList)
                            setTotalCars(responses?.[0]?.data.total)

                        })).catch(() => {
                            setDataTable([])
                        })



                } catch {


                    setDataTable([])


                }

            }


            GetCars()
        }

    }, [Search, Page, Limit, initQuery, session.status, StartDate, EndDate])




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
        <div className="container mx-auto  ">


            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-2xl p-5">
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




            <div className=" overflow-auto scrollbar-hide  bg-white dark:bg-[#181A1B] rounded-b-xl shadow-2xl">


                <table id="table-to-xls" className="table table-compact w-full  my-10 text-center font-normal   " {...getTableProps()}>

                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>
                                {headerGroups.headers.map((column, idx) => (

                                    < th key={idx} className={`normal-case min-w-[200px]  `} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                        <span>{column.render('Header')}</span>
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


                                            <td key={idx} className="dark:bg-[#181A1B]  text-center   py-3" {...cell.getCellProps()}>


                                                {(cell.column.id != 'carId') && cell.render('Cell')}

                                                {cell.column.id === 'carId' && (

                                                    <>
                                                        <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original.carId.id}?Qarz=${row.original.id}`}><a>{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'model' && (

                                                    <>

                                                        <span className="">{row.original.carId.model}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'tocar' && (

                                                    <>
                                                        <span className="">{row.original.carId.tocar}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'price' && (

                                                    <>
                                                        <span className="">{row.original.carId.price}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'isSold' && (

                                                    row.original.carId.isSold === true ?
                                                        <span className="text-green-500">Yes</span>
                                                        :
                                                        <span className="text-red-500">No</span>


                                                )
                                                }


                                                {cell.column.id === 'isPaid' && (

                                                    cell.value === true ?
                                                        <span className="text-green-500">Yes</span>
                                                        :
                                                        <span className="text-red-500">No</span>

                                                )}
                                                {cell.column.id === "Details" &&

                                                    <Link href={`/Qarz/details/${row.original.carId.id}`}><a  >
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
                                buttonText="????"
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


