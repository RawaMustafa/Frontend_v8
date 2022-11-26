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
import { faEye, faCalendarCheck, faFileDownload, faMoneyCheckDollar, faCar, } from '@fortawesome/free-solid-svg-icons';
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
                            TotalCars(responses?.[0]?.data.total)

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
        <div className="container mx-auto overflow-auto scrollbar-hide  ">



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
                        </ul>
                    </div>

                </div>


            </div>




            <table id="table-to-xls" className="ml-1 my-10   " {...getTableProps()}>


                <thead className="  ">

                    {headerGroups.map((headerGroups, idx) => (

                        <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                            {headerGroups.headers.map((column, idx) => (

                                < th key={idx} className={`p-4 m-44 ${true && "min-w-[200px]"} `} {...column.getHeaderProps(column.getSortByToggleProps())} >
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
                                {row.cells.map((cell, idx) => {
                                    return (


                                        <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>


                                            {(cell.column.id != 'carId') && cell.render('Cell')}

                                            {cell.column.id === 'carId' && (

                                                <>
                                                    {/* <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original.carId.id}?Qarz=${row.original.id}`}><a>{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link> */}
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

                                                <div>d</div>
                                                // row.original.carId.isSold === true ?
                                                //     <span className="text-green-500">Yes</span>
                                                //     :
                                                //     <span className="text-red-500">No</span>


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


        </div >

    );


}


