import useLanguage from '../../../../Component/language';
import AdminLayout from '../../../../Layouts/AdminLayout';
import { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import Head from 'next/head'
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Axios, { baseURL } from "../../../api/Axios"
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faFileDownload, faCalendarCheck, faFilter, faBars, faChevronLeft, faAnglesLeft, faChevronRight, faAnglesRight, faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import { getSession, useSession } from "next-auth/react";
import Link from 'next/link';





export const getServerSideProps = async ({ req }) => {

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
        const res = await Axios.get(`/cars/?search=&page=1&limit=10`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.Token}`
            }
        },)
        data = await res.data.total

    } catch {
        data = 1
    }



    return {
        props: {

            AllProducts: data,
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

        return <div className=" w-full" >

            <label className="label my-2 cursor-pointer">
                {l.all}
                <input type="checkbox" className="toggle toggle-accent focus:outline-0 " ref={resolvedRef}  {...rest} />

            </label>
            <hr />
        </div >
    }
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'
const Table = ({ COLUMNS, AllProducts }) => {




    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);

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
        const getExpenseData = async () => {

            try {

                const res = await Axios.get(`/cars/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2500-01-01"}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)
                const data = await res.data.carDetail

                setDataTable(data)

                setTotalCars(res.data.total)

            } catch {

                setDataTable([])
                setPageS(1)
            }
        }
        setPageS(Math.ceil(TotalCars / Limit))
        getExpenseData()
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
    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    const { pageIndex, pageSize } = state

    return (
        <div className='mx-3' >

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




            <div className="overflow-x-auto  bg-white dark:bg-[#181A1B] rounded-b-xl   w-full    "  >

                <table id="table-to-xls" className="table w-full my-10  text-xs  " {...getTableProps()}>

                    <thead className=" ">
                        {headerGroups.map((headerGroups, idx) => (
                            <tr id="th-to-xls" className="text-xs text-center w-96 " key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>
                                {headerGroups.headers.map((column, idx) => (
                                    <th key={idx} className={`  ${idx == 0 && "w-20  max-w-[100px] "}  `} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                        <span className='text-xs  font-normal normal-case'>{column.render('Header')}</span>
                                        <span  >
                                            {column.isSorted ? (column.isSortedDesc ? "⇅" : "⇵") : ""}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        )
                        )
                        }
                    </thead >

                    <tbody {...getTableBodyProps()} >

                        {page.map((row, idx) => {

                            prepareRow(row)
                            return (
                                <tr key={idx} className=""   {...row.getRowProps()} >
                                    <td className='hidden'></td>
                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className={`text-center dark:bg-[#161818]  ${idx == 0 && "w-20   p-0"}`} {...cell.getCellProps()}>


                                                {cell.render('Cell')}
                                                {cell.column.id === "image" && (
                                                    <>
                                                        <Link href={`/Dashboard/ListofCars/AllCars/${row.original._id}`}><a><Image src={`${baseURL}/${row.original.carDamage?.[0].filename}`} alt="Image" height={100} width={100} /></a></Link>

                                                    </>)

                                                }
                                                {cell.column.id === 'isSold' && (

                                                    cell.value === true ?
                                                        <span className="text-green-500">Yes</span>
                                                        :
                                                        <span className="text-red-500">No</span>

                                                )}

                                                {cell.column.id === "Details" &&
                                                    <Link href={`/Dashboard/ListofCars/AllCars/${row.original._id}`}><a><label htmlFor="my-modal-3" className="m-0" >
                                                        <FontAwesomeIcon icon={faEye} className="text-xl text-blue-500 cursor-pointer" />
                                                    </label></a></Link>

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


            </div>


        </div >
    );


}








const Expense = ({ AllProducts }) => {





    const COLUMNS =
        useMemo(() =>
            [

                {
                    Header: () => {
                        return (

                            "Image"
                        )
                    },

                    disableFilters: true,
                    accessor: 'image',

                },
                {
                    Header: () => {
                        return (
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
                        )
                    },

                    disableFilters: true,

                    accessor: 'price',


                },
                {
                    Header: () => {
                        return (
                            "Color"
                        )
                    },

                    disableFilters: true,

                    accessor: 'color',


                },
                {
                    Header: () => {
                        return (
                            "Date"
                        )
                    },

                    disableFilters: true,

                    accessor: 'date',


                },
                {
                    Header: () => {
                        return (
                            "Is Sold"
                        )
                    },

                    disableFilters: true,

                    accessor: 'isSold',


                },
                {
                    Header: () => {
                        return (
                            "Mileage"
                        )
                    },

                    disableFilters: true,

                    accessor: 'mileage',


                },

                {
                    Header: () => {
                        return (
                            "Model"
                        )
                    },

                    disableFilters: true,

                    accessor: 'model',


                },



                // {
                //     Header: () => {
                //         return (
                //             "Tire"
                //         )
                //     },

                //     disableFilters: true,

                //     accessor: 'tire',


                // },

                {
                    Header: () => {
                        return (
                            "Type of Balance"
                        )
                    },

                    disableFilters: true,

                    accessor: 'tobalance',


                },


                {
                    Header: () => {
                        return (
                            "Type of Car"
                        )
                    },

                    disableFilters: true,

                    accessor: 'tocar',


                },

                {
                    Header: () => {
                        return (
                            "Wheel Drive Type"
                        )
                    },

                    disableFilters: true,

                    accessor: 'wheelDriveType',


                },

                // {
                //     Header: "Details",

                //     disableFilters: true,

                // },



            ], [AllProducts]
        )



    const l = useLanguage();

    return (


        <div className="" >
            <Head>
                <title >{l.allcars}</title>
            </Head>

            {AllProducts ?
                <Table COLUMNS={COLUMNS} AllProducts={AllProducts} />
                :
                <div className="m-auto top-[50%] -translate-y-[50%] absolute -translate-x-[50%] left-[50%] lg:left-[60%] ">
                    <Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                </div>

            }



        </div>
    );
}



Expense.Layout = AdminLayout;

export default Expense;


