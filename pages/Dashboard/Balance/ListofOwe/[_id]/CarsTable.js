import Image from 'next/image';
import useLanguage from '../../../../../Component/language';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Axios, { baseURL } from '../../../../api/Axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import { useEffect, useMemo, useRef, forwardRef, useState } from 'react';
import { useSession } from "next-auth/react";
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';

export async function getServerSideProps({ req, query }) {

    return {
        redirect: {
            destination: "/",
            permanent: false,
        },
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




const CarsTable = ({ COLUMNS, AllProducts, initQuery }) => {
    const Datahidden = typeof window != 'undefined' ? localStorage.getItem("QarzCars")?.split(",") : [""]


    const session = useSession()
    const router = useRouter()
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

        if (session.status === 'authenticated') {
            const GetCars = async () => {

                try {

                    const Auth = {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    }


                    const one = `/qarz/${initQuery}/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2200-01-01"}`


                    const response1 = await Axios.get(one, Auth).then((res) => {
                        return res
                    }).catch(() => {
                    });


                    await axios.all([response1]).then(

                        axios.spread((...responses) => {
                            setDataTable(responses?.[0]?.data.qarzList || [])
                            console.log(responses?.[0]?.data.qarzList)
                            setPageS(Math.ceil(responses?.[0]?.data.total / Limit))

                        })).catch((e) => {
                            setDataTable([])
                        })



                } catch {


                    setDataTable([])


                }

            }


            GetCars()
        }

    }, [Search, Page, Limit, initQuery._id, session.status, StartDate, EndDate])




    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        let TH = []
        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (TH.push((th.children?.[0]?.innerText != "Detail" && th.children?.[0]?.innerText != "Image") ? th.children?.[0]?.innerText : ""))))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        const doc = new jsPDF("p", "mm", "a4");



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
        footerGroups,
        prepareRow,
        setHiddenColumns,
        columns,
        setColumnOrder,


    } = useTable({

        columns: COLUMNS,
        data: DataTable,

        // initialState: {
        //     hiddenColumns: ['Image', 'Name']
        // },

        // defaultColumn: { Filter: DefaultColumnFilter },

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );


    const { pageIndex, pageSize } = state



    useEffect(() => {
        setHiddenColumns(Datahidden || [''])
        // setColumnOrder(['Name','Image'])
    }, [columns])

    useEffect(() => {
        state.hiddenColumns != '' &&
            localStorage.setItem("QarzCars", state.hiddenColumns)
    }, [state.hiddenColumns])


    return (
        <div className="  ">

            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

                    <label htmlFor="my-modal" className=" flex  mx-2 hover:cursor-pointer"><FontAwesomeIcon className='text-2xl hover:scale-90 mx-1' icon={faBars} /></label>

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

                <input type="checkbox" id="my-modal" className="modal-toggle" />
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


                        <div className="modal-action flex justify-between">
                            <label className="btn btn-error"
                                onClick={() => { localStorage.setItem("QarzCars", "") }}
                            >{l.reset}</label>
                            <label htmlFor="my-modal" className="btn btn-accent">{l.don}</label>

                        </div>
                    </div>
                </div>

            </div>
            {/* //?   Header  */}


            <div className=" overflow-auto bg-white dark:bg-[#181A1B] rounded-b-xl shadow-xl ">



                <table id="table-to-xls" className="table w-full    my-10 text-center font-normal normal-case  " {...getTableProps()}>


                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>

                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className={`py-3 bg-[#3ea7e1]  text-white ${column.id == "Image" && "w-20  max-w-[100px] "}`} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                        <span className='normal-case   '>{column.render('Header')}</span>
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


                                            <td key={idx} className={` text-center  py-2 dark:bg-[#181A1B]  ${cell.column.id == "Image" && "w-20   p-0"}`} {...cell.getCellProps()}>



                                                {cell.column.id === "Image" && (
                                                    <>

                                                        <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original?.carId?.id}?Qarz=${row.original?.id}`}><a><Image
                                                            src={`${baseURL}/${row.original.carId.FirstImage?.[0]?.filename || row.original.carId.carDamage?.[0]?.filename}`} alt="Image" height={100} width={120} /></a></Link>

                                                    </>)

                                                }




                                                {(cell.column.id != 'carId') && cell.render('Cell')}

                                                {cell.column.id === 'Name' && (

                                                    <>
                                                        <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original?.carId?.id}?Qarz=${row.original?.id}`}><a>{row.original?.carId.modeName}</a></Link>
                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'Model Year' && (

                                                    <>
                                                        <span className="">{row.original.carId?.model}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'Car Type' && (

                                                    <>
                                                        <span className="">{row.original.carId?.tocar}</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'VIN' && (
                                                    <>
                                                        <p className=' '>..{row.original.carId?.VINNumber.substring(row.original.carId?.VINNumber.length - 6)} </p>
                                                    </>
                                                )}
                                                {cell.column.id === 'Color' && (
                                                    <>
                                                        <p className=' '>{row.original.carId?.color} </p>
                                                    </>
                                                )}
                                                {cell.column.id === 'Price Paid' && (

                                                    <>
                                                        <span className="">
                                                            {
                                                                row.original.carCost.pricePaidbid +
                                                                row.original.carCost.feesinAmericaCopartorIAAfee +
                                                                row.original.carCost.feesinAmericaStoragefee +
                                                                row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost +
                                                                row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost
                                                            } $</span>

                                                    </>

                                                )
                                                }
                                                {cell.column.id === 'Sold' && (


                                                    row.original.carId?.isSold === true ?
                                                        <span className="text-green-700">Yes</span>
                                                        :
                                                        <span className="text-red-700">No</span>


                                                )
                                                }


                                                {cell.column.id === 'Paid' && (

                                                    row.original.isPaid === true ?
                                                        <span className="text-green-700">Yes</span>
                                                        :
                                                        <span className="text-red-700">No</span>

                                                )}
                                                {cell.column.id === 'Date' && (

                                                    row.original?.dates

                                                )}
                                                {cell.column.id === "Details" &&

                                                    <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}/details/${row.original?.carId?.id}?Qarz=${row.original?.id}`}><a  >
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
                    <tfoot>
                        {footerGroups.map((group, idx) => (
                            <tr key={idx} {...group.getFooterGroupProps()}>
                                <td className='hidden'></td>
                                {group.headers.map((column, idx) => (
                                    <td key={idx} className='py-3 text-center bg-[#3ea7e1]  text-white ' {...column.getFooterProps()}>{column.render('Footer')}</td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>

                </table>


                {/* //?    botom */}
                <div className="text-sm  scale-90  ">

                    <div className=" flex justify-between  items-center rounded-xl mb-5  px-1  min-w-[700px] text-sm  ">


                        <div className=" flex items-center justify-around mx-5 bg-center space-x-2">

                            <div></div>
                            <FontAwesomeIcon icon={faAnglesLeft} className=" bg-[#3ea7e1]  text-white px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer "
                                onClick={() => Page > 1 && setPage(1)}
                                disabled={Page == 1 ? true : false} />

                            <FontAwesomeIcon icon={faChevronLeft} className=" bg-[#3ea7e1]  text-white px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page > 1 && setPage(Page - 1)}
                                disabled={Page == 1 ? true : false} />



                            <span className="px-20 py-2 rounded bg-[#3ea7e1]  text-white">
                                {Page}/{PageS}
                            </span>



                            <FontAwesomeIcon icon={faChevronRight} className=" bg-[#3ea7e1]  text-white px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(Page + 1))}
                                disabled={Page >= PageS ? true : false} />

                            <FontAwesomeIcon icon={faAnglesRight} className=" bg-[#3ea7e1]  text-white px-2 w-7 py-2.5 rounded active:scale-95 hover:cursor-pointer"
                                onClick={() => Page < PageS && (Page >= 1 && setPage(PageS))}
                                disabled={Page >= PageS ? true : false} />


                            <div>
                                <select className="select  select-sm w-20 focus:outline-0 input-sm bg-[#3ea7e1]  text-white   max-w-xs text-sm"
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

export default CarsTable;