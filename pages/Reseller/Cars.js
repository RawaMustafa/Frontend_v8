import useLanguage from '../../Component/language';
import ResellerLayout from '../../Layouts/ResellerLayout';
import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Axios from '../api/Axios';
import Image from 'next/image';
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faFileDownload, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';



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
    const [TotalBalsData, setTotalBalsData] = useState([]);
    const [TotalCars, setTotalCars] = useState(AllProducts);



    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2100-01-01");







    const l = useLanguage();



    useEffect(() => {
        if (session.status === "authenticated") {
            const getResellerData = async () => {
                //$sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2100-01-01"}
                try {
                    const res = await Axios.get(`/reseller/${initQuery}?search=${Search}&page=${Page}&limit=${Limit}`, {
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


        <div className="w-full    " >


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

                        {/* <div className="dropdown rtl:dropdown-right ltr:dropdown-left">
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
                        </div> */}




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

                                    < th key={idx} className={`p-4 m-44 ${true && "min-w-[200px]"}`} {...column.getHeaderProps(column.getSortByToggleProps())} >
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
                                                    <Link href={`/Reseller/details/${row.original._id}`}><a><label htmlFor="my-modal-3" className="m-0" >
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
        </div >

    );


}



const Reseller = ({ AllProducts, initQuery }) => {


    const session = useSession()
    const l = useLanguage();


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





    if (session.status === "loading") {
        return <div className="flex justify-center items-center h-screen">
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
            <div className="flex justify-center items-center h-screen">
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


