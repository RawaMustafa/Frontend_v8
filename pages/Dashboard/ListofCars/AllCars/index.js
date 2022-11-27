import useLanguage from '../../../../Component/language';
import AdminLayout from '../../../../Layouts/AdminLayout';
import { useEffect, useMemo, useState, useRef, forwardRef } from 'react';
import Head from 'next/head'
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Axios from "../../../api/Axios"
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faFileDownload, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
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

            // &sdate=${StartDate}&edate=${EndDate}
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
                        <div className="font-bold text-lg overflow-auto max-h-80 scrollbar-hide space-y-2 ">
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
                        {/* //TODO -   Fix-------Date*/}
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

                        <tr id="th-to-xls" className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                            {headerGroups.headers.map((column, idx) => (

                                <th key={idx} className={`p-4 m-44 ${true && "min-w-[200px]"} `} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                    <span >{column.render('Header')}</span>
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
                                                <Link href={`/Dashboard/ListofCars/AllCars/${row.original._id}`}><a><label htmlFor="my-modal-3" className="m-0" >
                                                    <FontAwesomeIcon icon={faEye} className="text-2xl cursor-pointer text-blue-700" />
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








const Expense = ({ AllProducts }) => {






    const COLUMNS =
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
                {
                    Header: () => {
                        return (

                            // l.date
                            "Date"
                        )
                    },

                    disableFilters: true,

                    accessor: 'date',


                },
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


