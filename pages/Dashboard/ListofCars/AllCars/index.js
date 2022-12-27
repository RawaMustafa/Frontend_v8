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
import { faEye, faBars, faChevronLeft, faAnglesLeft, faChevronRight, faAnglesRight, } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';
import { getSession, useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/router';


// let initialState


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


    const Datahidden = typeof window != 'undefined' ? localStorage.getItem("AllCars")?.split(",") : ["image"]


    const router = useRouter()
    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);
    const [ReNewFooter, setReNewFooter] = useState(false);

    const [Search, setSearch] = useState("");

    const [FILTER, setFILTER] = useState(false);
    const [TOBalance, setTOBalance] = useState("All");
    const [ISSold, setISSold] = useState("All");
    const [ARRTKU, setARRTKU] = useState("All");
    const [ARRTDU, setARRTDU] = useState("All");
    const [Visibility, setVisibility] = useState("All");
    const [Location, setLocation] = useState("All");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);
    const [DataTable, setDataTable] = useState([]);
    const [PaperPDF, setPaperPDF] = useState("A1");
    const [TotalCars, setTotalCars] = useState(AllProducts);
    const [PageS, setPageS] = useState(Math.ceil(TotalCars / Limit));
    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2500-01-01");

    const l = useLanguage();





    useEffect(() => {


        const getExpenseData = async () => {
            setReNewFooter(true)
            try {
                const res = await Axios.get(`/cars/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || "2000-01-01"}&edate=${EndDate || "2500-01-01"}&arrKu=${ARRTKU}&arrDu=${ARRTDU}&isSold=${ISSold}&tobalance=${TOBalance}&visibility=${Visibility}&Location=${Location}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)
                const data = await res.data.carDetail
                console.log(data)
                const total = await res.data.total
                setDataTable(data)
                setTotalCars(total)
                setPageS(Math.ceil(total / Limit))


            } catch {

                setDataTable([])
                setPageS(1)
            }
        }
        getExpenseData()
        setReNewData(false)
        setReNewFooter(false)

    }, [Search, Page, Limit, StartDate, EndDate, ReNewData, ARRTDU, ARRTKU, ISSold, TOBalance, Visibility, Location])





    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        let TH = []
        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (TH.push((th.children?.[0]?.innerText != "Details" && th.children?.[0]?.innerText != "Image") ? th.children?.[0]?.innerText : ""))))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        const doc = new jsPDF("p", "mm", PaperPDF);



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
        setHiddenColumns
    } = useTable({
        columns: COLUMNS,
        data: DataTable,
        // initialState: {
        //     hiddenColumns: ['']
        // },
    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    const { pageIndex, pageSize } = state


    useEffect(() => {

        setHiddenColumns(Datahidden || [''])

    }, [])

    useEffect(() => {
        state.hiddenColumns != "" &&
            localStorage.setItem("AllCars", state.hiddenColumns)
    }, [state.hiddenColumns])




    return (
        <>

            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-2xl p-5">

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

                        <label className="label my-2 cursor-pointer">
                            {l.filter}
                            <input type="checkbox" className="toggle toggle-accent focus:outline-0 " onChange={(e) => {
                                setFILTER(e.target.checked)

                            }} />

                        </label>
                        <hr />

                        <div className={`space-y-2 ${FILTER ? "" : "hidden"} overflow-auto my-2`}>

                            <form onChange={(e) => {
                                setTOBalance(e.target.value)
                            }} >
                                <div
                                    className="grid  min-w-[50px]   grid-cols-4 space-x-2 rounded-xl bg-gray-200 dark:bg-slate-800  dark:text-white  text-black "

                                >
                                    <div className='bg-accent/100  rounded px-1 flex items-center text-white'
                                    >{l.balance}</div>
                                    <div>
                                        <input type="radio" name="option" id="1" className="peer hidden" value="Rent" />
                                        <label
                                            htmlFor="1"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-error peer-checked:font-bold peer-checked:text-white"
                                        >{l.loan}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="2" className="peer hidden" value="All" defaultChecked />
                                        <label
                                            htmlFor="2"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-slate-500 peer-checked:font-bold peer-checked:text-white"
                                        >{l.all}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="3" className="peer hidden" value="Cash" />
                                        <label
                                            htmlFor="3"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-accent peer-checked:font-bold peer-checked:text-white "
                                        >{l.cash}</label
                                        >
                                    </div>
                                </div>
                            </form>
                            <form onChange={(e) => { setISSold(e.target.value) }} >
                                <div
                                    className="grid  min-w-[50px]   grid-cols-4 space-x-2 rounded-xl bg-gray-200 dark:bg-slate-800  dark:text-white  text-black"

                                >
                                    <h5 className='bg-accent/100  rounded px-1 flex items-center text-white    '
                                    >{l.isSold}</h5>
                                    <div>
                                        <input type="radio" name="option" id="11" className="peer hidden" value="0" />
                                        <label
                                            htmlFor="11"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-error peer-checked:font-bold peer-checked:text-white"
                                        >{l.no}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="22" className="peer hidden" value="All" defaultChecked />
                                        <label
                                            htmlFor="22"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-slate-500 peer-checked:font-bold peer-checked:text-white"
                                        >{l.all}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="33" className="peer hidden" value="1" />
                                        <label
                                            htmlFor="33"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-accent peer-checked:font-bold peer-checked:text-white "
                                        >{l.yes}</label
                                        >
                                    </div>
                                </div>
                            </form>
                            <form onChange={(e) => { setVisibility(e.target.value) }} >
                                <div
                                    className="grid  min-w-[50px]   grid-cols-4 space-x-2 rounded-xl bg-gray-200 dark:bg-slate-800  dark:text-white  text-black"

                                >
                                    <h5 className='bg-accent/100  rounded px-1 flex items-center text-white    '
                                    >{l.visibility}</h5>
                                    <div>
                                        <input type="radio" name="option" id="110" className="peer hidden" value="Private" />
                                        <label
                                            htmlFor="110"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-error peer-checked:font-bold peer-checked:text-white"
                                        >{l.private}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="220" className="peer hidden" value="All" defaultChecked />
                                        <label
                                            htmlFor="220"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-slate-500 peer-checked:font-bold peer-checked:text-white"
                                        >{l.all}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="330" className="peer hidden" value="Public" />
                                        <label
                                            htmlFor="330"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-accent peer-checked:font-bold peer-checked:text-white "
                                        >{l.public}</label
                                        >
                                    </div>
                                </div>
                            </form>
                            <form onChange={(e) => { setLocation(e.target.value) }} >
                                <div
                                    className="grid  min-w-[50px]   grid-cols-5 space-x-2 rounded-xl bg-gray-200 dark:bg-slate-800  dark:text-white  text-black"

                                >
                                    <div className='bg-accent/100  rounded px-1 flex items-center text-white text-sm'
                                    >{l.Location}</div>
                                    <div>
                                        <input type="radio" name="option" id="1110" className="peer hidden" value="USA" />
                                        <label
                                            htmlFor="1110"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-error peer-checked:font-bold peer-checked:text-white"
                                        >{l.USA}</label
                                        >
                                    </div>


                                    <div>
                                        <input type="radio" name="option" id="222" className="peer hidden" value="All" defaultChecked />
                                        <label
                                            htmlFor="222"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-slate-500 peer-checked:font-bold peer-checked:text-white"
                                        >{l.all}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="11101" className="peer hidden" value="Dubai" />
                                        <label
                                            htmlFor="11101"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-error peer-checked:font-bold peer-checked:text-white"
                                        >{l.Dubai}</label
                                        >
                                    </div>

                                    <div>
                                        <input type="radio" name="option" id="3331" className="peer hidden" value="Kurdistan" />
                                        <label
                                            htmlFor="3331"
                                            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-accent peer-checked:font-bold peer-checked:text-white   max-xs:bg-red-200  w-6 overflow-hidden "
                                        >{l.Kurdistan}</label
                                        >
                                    </div>
                                </div>
                            </form>


                        </div>
                        <hr />

                        <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />

                        <div className={`max-h-80 ${FILTER ? "hidden" : ""}  scrollbar-hide space-y-2 overflow-auto text-lg font-bold`}>

                            {allColumns.map(column => (
                                <div key={column.id}  >
                                    <div className=" w-full rounded-lg">
                                        <label className="label cursor-pointer"

                                        >
                                            {column.id}
                                            <input type="checkbox"
                                                className="toggle toggle-accent focus:outline-0 "
                                                {...column.getToggleHiddenProps()}
                                            />

                                        </label>
                                    </div>


                                </div>
                            ))}


                        </div>

                        <div className="modal-action flex justify-between">
                            <label className="btn btn-error"
                                onClick={() => { localStorage.setItem("AllCars", "") }}
                            >{l.reset}</label>
                            <label htmlFor="my-modal" className="btn btn-accent">{l.don}</label>

                        </div>
                    </div>
                </div>






                <input type="checkbox" id="PDF-modal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative">
                        <label htmlFor="PDF-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <div className='text-center my-5'>
                            <FontAwesomeIcon icon={PDF} className=" text-6xl text-blue-400  " />

                        </div>
                        <h3 className="font-bold text-lg">{l.papermsg}</h3>

                        <div className='text-center my-5'>
                            <select onChange={(e) => { setPaperPDF(e.target.value) }} defaultValue={"A1"} className="select select-info w-full max-w-xs">
                                <option value={"A1"} >A1</option>
                                <option value={"A2"}>A2</option>
                                <option value={"A3"}>A3</option>
                                <option value={"A4"}>A4</option>
                                <option value={"A5"}>A5</option>
                            </select>
                        </div>
                        <div className="modal-action">
                            <label htmlFor="PDF-modal" onClick={table_2_pdf} className="btn btn-info">{l.print}</label>
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
                                    <th key={idx} className={`py-3 bg-[#3ea7e1]  text-white ${column.id == "Image" && "w-20  max-w-[100px] "}  `} {...column.getHeaderProps(column.getSortByToggleProps())} >
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

                                            <td key={idx} className={`text-center max-w-10 dark:bg-[#161818]  ${cell.column.id == "Image" && "w-20   p-0"}  ${idx != 0 && "py-2 "}`} {...cell.getCellProps()}>


                                                {(cell.column.id !== "VINNumber" && cell.column.id !== "price" && cell.column.id !== "tire") && cell.render('Cell')}
                                                {cell.column.id === "image" && (
                                                    <>

                                                        <Link href={`/Dashboard/ListofCars/AllCars/${row.original._id}`}><a><Image
                                                            src={`${baseURL}/${row.original.FirstImage?.[0]?.filename || row.original.carDamage?.[0]?.filename}`} alt="Image" height={100} width={120} /></a></Link>

                                                    </>)

                                                }
                                                {cell.column.id === 'isSold' && (

                                                    cell.value === true ?
                                                        <span className="text-green-500">Yes</span>
                                                        :
                                                        <span className="text-red-500">No</span>

                                                )}
                                                {cell.column.id === 'tire' && (

                                                    cell.value === "Public" ?
                                                        <span className="text-green-500">Public</span>
                                                        :
                                                        <span className="text-red-500">Private</span>

                                                )}
                                                {cell.column.id === 'VINNumber' && (
                                                    <>
                                                        <p className=' '>..{cell.value.substring(cell.value.length - 6)} </p>
                                                    </>
                                                )}


                                                {cell.column.id === 'arrivedToKurd' && (

                                                    cell.value === true ?
                                                        <span className="text-green-500">Yes</span>
                                                        :
                                                        <span className="text-red-500">No</span>

                                                )}
                                                {cell.column.id === 'arrivedToDoubai' && (

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

                                                {/* 1 */}


                                                {cell.column.id === "PricePaid" && (<>

                                                    {
                                                        row.original.carCost.pricePaidbid +
                                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                                        row.original.carCost.feesinAmericaStoragefee +
                                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost +
                                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost
                                                    } $
                                                </>)}
                                                {cell.column.id === "price" && (<>
                                                    {
                                                        row.original.carCost.price

                                                    } $
                                                </>)}

                                                {cell.column.id === "OtherCarSpends" && (<>


                                                    {
                                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                                        row.original.carCost.feesAndRepaidCostDubairepairCost

                                                    } $
                                                </>)}
                                                {cell.column.id === "ShipandFees" && (<>

                                                    {
                                                        row.original.carCost.coCCost +
                                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                                        row.original.carCost.dubaiToIraqGCostTranscost

                                                    } $
                                                </>)}
                                                {cell.column.id === "TotalCarPrice" && (<>

                                                    {
                                                        row.original.carCost.coCCost +
                                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                                        row.original.carCost.dubaiToIraqGCostTranscost +
                                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost +
                                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                                        row.original.carCost.feesAndRepaidCostDubairepairCost +
                                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost +
                                                        row.original.carCost.pricePaidbid +
                                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                                        row.original.carCost.feesinAmericaStoragefee +
                                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost

                                                    } $
                                                </>)}
                                                {cell.column.id === "Profit" && (<>

                                                    {
                                                        (row.original.carCost.price) -
                                                        (
                                                            row.original.carCost.coCCost +
                                                            row.original.carCost.dubaiToIraqGCostgumrgCost +
                                                            row.original.carCost.dubaiToIraqGCostTranscost +
                                                            row.original.carCost.raqamAndRepairCostinKurdistanrepairCost +
                                                            row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                                            row.original.carCost.feesAndRepaidCostDubaiothers +
                                                            row.original.carCost.feesAndRepaidCostDubairepairCost +
                                                            row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost +
                                                            row.original.carCost.pricePaidbid +
                                                            row.original.carCost.feesinAmericaCopartorIAAfee +
                                                            row.original.carCost.feesinAmericaStoragefee +
                                                            row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost
                                                        )


                                                    } $
                                                </>)}

                                                {cell.column.id === "MayCosts" && (<>


                                                    {
                                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost +
                                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                                        row.original.carCost.feesAndRepaidCostDubairepairCost
                                                    } $
                                                </>)}


                                                {cell.column.id === "Feestokurdistan" && (<>

                                                    {
                                                        row.original.carCost.coCCost +
                                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                                        row.original.carCost.dubaiToIraqGCostTranscost
                                                    } $
                                                </>)}

                                                {/* 2 */}
                                                {cell.column.id === "DubaiCosts" && (<>


                                                    {
                                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                                        row.original.carCost.feesAndRepaidCostDubairepairCost
                                                    } $
                                                </>)}

                                                {/* 3 */}
                                                {cell.column.id === "USACosts" && (<>


                                                    {
                                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                                        row.original.carCost.feesinAmericaStoragefee +
                                                        row.original.carCost.pricePaidbid
                                                    } $
                                                </>)}


                                                {/* 4 */}
                                                {cell.column.id === "USALocation" && (<>

                                                    {row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation}
                                                </>)}
                                                {/* 5 */}
                                                {cell.column.id === "KurdistanNumber" && (<>

                                                    {row.original.carCost.raqamAndRepairCostinKurdistanRaqam}
                                                </>)}


                                                {/* 6 */}
                                                {cell.column.id === "CostsKurdistan" && (<>


                                                    {
                                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost
                                                    } $
                                                </>)}


                                                {/* 7 */}
                                                {cell.column.id === "FeestoDubai" && (<>

                                                    {
                                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost +
                                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost
                                                    } $
                                                </>)}


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
                <div className="container text-sm  scale-90  ">

                    <div className=" flex justify-between container mx-auto items-center rounded-xl mb-5  px-1  min-w-[700px] text-sm  ">


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
                                <select className="select  select-sm w-20 focus:outline-0 input-sm bg-[#3ea7e1]  text-white  max-w-xs text-sm"
                                    onChange={(e) => {
                                        setLimit((e.target.value))
                                        setPageSize(Number(e.target.value))
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

                            <label htmlFor="PDF-modal" className=""><FontAwesomeIcon icon={PDF} className="md:mx-5 px-10 text-blue-400 active:scale-9 m-auto mx-10 text-2xl transition ease-in-out hover:cursor-pointer" /></label>

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


        </ >
    );
};




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
                            "Model"
                        )
                    },

                    disableFilters: true,

                    accessor: 'model',


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
                            "Vin Number"
                        )
                    },

                    // disableFilters: true,

                    accessor: 'VINNumber',


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

                // PricePaid ......................//^ ------------------------------
                {
                    Header: () => {
                        return (
                            "Price Paid"
                        )
                    },

                    disableFilters: true,

                    accessor: 'PricePaid',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.pricePaidbid +
                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                        row.original.carCost.feesinAmericaStoragefee +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost

                                    )

                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },

                },
                // OtherCarSpends  ......................//^ ------------------------------
                {
                    Header: () => {
                        return (
                            "Other Car Spends "
                        )
                    },

                    disableFilters: true,

                    accessor: 'OtherCarSpends',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                        row.original.carCost.feesAndRepaidCostDubairepairCost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },

                },
                // ShipandFees   ......................//^ ------------------------------
                {
                    Header: () => {
                        return (
                            "Ship and Fees"
                        )
                    },

                    disableFilters: true,

                    accessor: 'ShipandFees',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.coCCost +
                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                        row.original.carCost.dubaiToIraqGCostTranscost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },

                },
                // TotalCarPrice   ......................//^ ------------------------------
                {
                    Header: () => {
                        return (
                            "Total Car Price"
                        )
                    },

                    disableFilters: true,

                    accessor: 'TotalCarPrice',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.coCCost +
                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                        row.original.carCost.dubaiToIraqGCostTranscost +
                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost +
                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                        row.original.carCost.feesAndRepaidCostDubairepairCost +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost +
                                        row.original.carCost.pricePaidbid +
                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                        row.original.carCost.feesinAmericaStoragefee +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },

                },


                // sell price        .....................//^ ------------------------------
                {
                    Header: () => {
                        return (
                            "Sell Price"
                        )
                    },
                    disableFilters: true,
                    accessor: 'price',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((sum, idx) => { T += sum.original.price })
                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },
                },
                // Profit           .....................//^ ------------------------------
                {
                    Header: () => {
                        return (
                            "Profit"
                        )
                    },
                    disableFilters: true,
                    accessor: 'Profit',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (row.original.price - (row.original.carCost.coCCost +
                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                        row.original.carCost.dubaiToIraqGCostTranscost +
                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost +
                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                        row.original.carCost.feesAndRepaidCostDubairepairCost +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost +
                                        row.original.carCost.pricePaidbid +
                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                        row.original.carCost.feesinAmericaStoragefee +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost))
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },
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
                            "Visibility"
                        )
                    },
                    disableFilters: true,

                    accessor: 'tire',


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
                            "Type of Car"
                        )
                    },

                    disableFilters: true,

                    accessor: 'tocar',


                },

                {
                    Header: () => {
                        return (
                            "Arrived to Kurd"
                        )
                    },

                    disableFilters: true,

                    accessor: 'arrivedToKurd',


                },

                {
                    Header: () => {
                        return (
                            "Arrived to Dubai"
                        )
                    },

                    disableFilters: true,

                    accessor: 'arrivedToDoubai',


                },

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
                            "Wheel Drive Type"
                        )
                    },

                    disableFilters: true,

                    accessor: 'wheelDriveType',


                },
                // ^ -----1
                {
                    Header: () => {
                        return (
                            "May Costs"
                        )
                    },

                    disableFilters: true,

                    accessor: 'MayCosts',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost +
                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                        row.original.carCost.feesAndRepaidCostDubairepairCost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },


                },
                {
                    Header: () => {
                        return (
                            "Fees to kurdistan"
                        )
                    },

                    disableFilters: true,

                    accessor: 'Feestokurdistan',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.coCCost +
                                        row.original.carCost.dubaiToIraqGCostgumrgCost +
                                        row.original.carCost.dubaiToIraqGCostTranscost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },

                },

                // ^ -----2
                {
                    Header: () => {
                        return (
                            "Dubai Costs "
                        )
                    },

                    disableFilters: true,

                    accessor: 'DubaiCosts',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.feesAndRepaidCostDubaiothers +
                                        row.original.carCost.feesAndRepaidCostDubairepairCost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },


                },
                // ^ -----3
                {
                    Header: () => {
                        return (
                            "USA Costs "
                        )
                    },

                    disableFilters: true,

                    accessor: 'USACosts',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.feesinAmericaCopartorIAAfee +
                                        row.original.carCost.feesinAmericaStoragefee +
                                        row.original.carCost.pricePaidbid
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },


                },
                // ^ -----4
                {
                    Header: () => {
                        return (
                            "USA Location"
                        )
                    },

                    disableFilters: true,

                    accessor: 'USALocation',


                },
                // ^ -----5
                {
                    Header: () => {
                        return (
                            "Kurdistan Number"
                        )
                    },

                    disableFilters: true,

                    accessor: 'KurdistanNumber',

                },
                // ^ -----6
                {
                    Header: () => {
                        return (
                            "Costs Kurdistan"
                        )
                    },

                    disableFilters: true,

                    accessor: 'CostsKurdistan',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.raqamAndRepairCostinKurdistanothers +
                                        row.original.carCost.raqamAndRepairCostinKurdistanrepairCost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },


                },
                // ^ -----7
                {
                    Header: () => {
                        return (
                            "Fees to Dubai"
                        )
                    },

                    disableFilters: true,

                    accessor: 'FeestoDubai',
                    Footer: info => {
                        // Only calculate total visits if rows change
                        const total = useMemo(

                            () => {
                                let T = 0
                                info.rows.map((row, idx) => {
                                    T += (
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost +
                                        row.original.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost
                                    )
                                })

                                return T
                            }, [info.rows]
                        )

                        return <>{total} $</>
                    },


                },
                {
                    Header: "Details",

                    disableFilters: true,

                },



            ], []
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
                <div className=" top-[50%] -translate-y-[50%] m-auto absolute -translate-x-[50%] left-[50%] lg:left-[60%]    ">
                    <Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                </div>


            }



        </div>
    );
}



Expense.Layout = AdminLayout;

export default Expense;


