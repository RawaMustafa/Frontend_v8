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
import { faEye, faFileDownload, faCalendarCheck, faCar, faMoneyCheckDollar, faCalendarPlus, faBan, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getSession, useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';


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

    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
    const [UsersBalance, setUsersBalance] = useState()
    const [Data, setData] = useState({

        Amount: 0,
        action: "",

    });

    const [DataUpdate, setDataUpdate] = useState({

        amount: 0,
        action: "",

    });


    const l = useLanguage();


    const [CFocus, setCFocus] = useState(false);
    const [DFocus, setDFocus] = useState(false);
    const [DEFocus, setDEFocus] = useState(false);


    const [CValid, setCValid] = useState(false)
    const [DValid, setDValid] = useState(false)
    const [DEValid, setDEValid] = useState(false)

    const CRef = useRef();
    const DRef = useRef();
    const ACRef = useRef();
    const inputRef = useRef();


    const handleSaveExpenseData = (event) => {
        const savename = event.target.getAttribute('name')
        const savevalue = event.target.value;
        const type = event.target.getAttribute('type')




        if (savename == "action") {

            savevalue = event.target.value.match(action_regex)?.[0];
            savevalue?.match(action_regex) == null || savevalue.match(action_regex)[0] != savevalue ? setDEValid(false) : setDEValid(true);

        }

        if (type == "number") {
            savevalue?.match(Amount_regex) == null || savevalue.match(Amount_regex)[0] != savevalue ? setCValid(false) : setCValid(true);
            savevalue = event.target.value.match(Amount_regex)?.map(Number)[0];

        }

        // if (savename == "date") {
        //     savevalue?.match(date_regex) == null || savevalue.match(date_regex)[0] != savevalue ? setDValid(false) : setDValid(true);
        //     savevalue = event.target.value.match(date_regex)?.map(String)[0];
        // }



        const newdata = { ...Data }
        newdata[savename] = savevalue;
        setData(newdata);


    }


    //NOTE - validation for updating table for my Balance

    let count = 0

    useEffect(() => {


        CRef.current?.value?.match(Amount_regex) == null || CRef.current.value?.match(Amount_regex)[0] != CRef.current.value ? setCValid(false) : setCValid(true);

        ACRef.current?.value?.match(action_regex) == null || ACRef.current.value?.match(action_regex)[0] != ACRef.current.value ? setDEValid(false) : setDEValid(true);

        // DRef.current?.value?.match(date_regex) == null || DRef.current.value?.match(date_regex)[0] != DRef.current.value ? setDValid(false) : setDValid(true);




        const newdataUpdate = { ...DataUpdate }


        newdataUpdate.amount = CRef.current?.value.match(Amount_regex)?.map(String)[0];


        // newdataUpdate.date = DRef.current?.value.match(date_regex)?.map(String)[0];

        newdataUpdate.action = ACRef.current?.value.match(action_regex)?.map(String)[0];




        setDataUpdate(newdataUpdate);





    }, [CRef?.current?.value, DRef?.current?.value, ACRef?.current?.value, count])

    //REVIEW -           -



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
                    const users = await Axios.get(`/users/detail/${SessionID}`, {
                        headers: {
                            "Content-Type": "application/json",

                            'Authorization': `Bearer ${session?.data?.Token}`

                        }
                    },)
                    setUsersBalance(users.data.userDetail.TotalBals)
                    setDataTable(res.data.History.reverse())
                    setTotalUsers(res.data.total?.[0].total)

                    setPageS(Math.ceil(res.data.total?.[0].total / Limit))
                }
                catch {
                    // setDataTable([])
                    setTotalUsers(0)
                }
            }
            getExpenseData()
            setReNewData(false)
        }
    }, [Search, Page, Limit, StartDate, EndDate, ReNewData, session.status])





    //REVIEW - 


    const handleUpdatExpense = async () => {

        try {

            const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
                headers: {
                    "Content-Type": "application/json",

                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)

            const DataBalance = UDetails.data.userDetail.TotalBals

            let donebalance = Math.floor(DataUpdate.amount) - Math.floor(Idofrow?.[1])


            if (-donebalance <= DataBalance) {


                await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance + donebalance }, {
                    headers: {
                        "Content-Type": "application/json",

                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                toast.success("Your Balance Now= " + (DataBalance + donebalance) + " $");

                await Axios.patch(`/bal/${Idofrow?.[0]}`, DataUpdate, {
                    headers: {
                        "Content-Type": "application/json",

                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)


                toast.success("Data Updated Successfully")
            }

        } catch (error) {


            toast.error("Something Went Wrong *")
        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                amount: 0,
                action: "",
            });
            setReNewData(true)

        }



    }

    const handledeleteExpenseData = async () => {


        const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
            headers: {
                "Content-Type": "application/json",

                'Authorization': `Bearer ${session?.data?.Token}`
            }
        },)

        const DataBalance = UDetails.data.userDetail.TotalBals

        try {
            await Axios.delete(`/bal/${Deletestate?.[0]}`, {
                headers: {
                    "Content-Type": "application/json",

                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)

            await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - Deletestate?.[1] }, {
                headers: {
                    "Content-Type": "application/json",

                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)

            toast.success("Your Balance Now = " + (DataBalance - Deletestate?.[1]) + " $");

            toast.warn("Data Deleted Successfully")

        } catch (error) {

            toast.error("Something Went Wrong *")

        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                amount: 0,
                action: "",
            });
            // getExpenseData()
            setReNewData(true)

        }



    }







    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");

        doc.autoTable({

            head: [[`Amount`, "Action", " Cars ", "Is Soled", "Note", "Date"]],
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

                    <input type="search" placeholder={`${l.search} ...`} className="input hidden  input-info  w-full max-w-xs mx-5 focus:outline-0"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>


                <div className="flex justify-center items-center lg:space-x-4 ">


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left ">

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


                                        // <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>



                                        //     {cell.column.id === 'amount' && row.original._id !== Idofrow?.[0] && (

                                        //         cell.value >= 0 ? <div className="text-green-500">{cell.value}</div> : <div className="text-red-500">{cell.value}</div>
                                        //     )}

                                        //     {cell.column.id === 'userId' && row.original._id !== Idofrow?.[0] && (
                                        //         <>


                                        //             {cell.value?.userRole == "Qarz" && <Link href={`/Dashboard/Balance/ListofOwe/${cell.value?._id}`}><a className="text-red-300">{cell.value?.userName}</a></Link>}
                                        //             {cell.value?.userRole == "Reseller" && <Link href={`/Dashboard/Balance/Reseller/${cell.value?._id}`}><a className="text-violet-300">{cell.value?.userName}</a></Link>}
                                        //             {cell.value?.userRole == "Admin" && <a className="text-blue-400 cursor-crosshair">{cell.value?.userName}</a>}




                                        //         </>

                                        //     )}

                                        //     {cell.column.id === 'carId' && row.original._id !== Idofrow?.[0] && (
                                        //         <>


                                        //             <Link href={`/Dashboard/ListofCars/AllCars/${cell.value?._id}`}><a className="text-orange-200">{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
                                        //         </>

                                        //     )
                                        //     }


                                        //     {
                                        //         cell.column.id !== "Delete" &&
                                        //             cell.column.id !== "Edit" &&
                                        //             row.original._id == Idofrow?.[0] ?
                                        //             <>

                                        //                 {cell.column.id == "amount" && <input defaultValue={row.original.amount}
                                        //                     ref={CRef}
                                        //                     onChange={(event) => { handleSaveExpenseData(event) }}
                                        //                     onClick={(event) => { handleSaveExpenseData(event) }}
                                        //                     onFocus={() => { setCFocus(true) }}
                                        //                     onBlur={() => { setCFocus(false) }}

                                        //                     type="number" placeholder={cell.column.id} name='amount' className="input input-bordered input-warning w-full max-w-xs" />}

                                        //                 {cell.column.id == "action" &&
                                        //                     <textarea name='action'
                                        //                         defaultValue={row.original.action}
                                        //                         ref={ACRef}
                                        //                         type="textarea"
                                        //                         onChange={(event) => { handleSaveExpenseData(event) }}
                                        //                         onClick={(event) => { handleSaveExpenseData(event) }}
                                        //                         onFocus={() => { setDEFocus(true) }}
                                        //                         onBlur={() => { setDEFocus(false) }}

                                        //                         className="textarea textarea-warning  w-full max-w-xs" placeholder={cell.column.id}></textarea>}
                                        //                 {cell.column.id == "actionDate" && <input disabled
                                        //                     defaultValue={row.original.actionDate}
                                        //                     ref={DRef}
                                        //                     onChange={(event) => { handleSaveExpenseData(event) }}
                                        //                     onClick={(event) => { handleSaveExpenseData(event) }}
                                        //                     onFocus={() => { setDFocus(true) }}
                                        //                     onBlur={() => { setDFocus(false) }}

                                        //                     name='actionDate' type="date" placeholder={l.date} className="input input-warning   w-full max-w-xl  " />}


                                        //             </>

                                        //             :
                                        //             (cell.column.id != 'userId' && cell.column.id != 'amount' && cell.column.id != 'carId') && cell.render('Cell')

                                        //     }



                                        //     {
                                        //         row.original._id !== Idofrow?.[0] ?
                                        //             cell.column.id === "Edit" &&
                                        //             <button ref={inputRef} onClick={() => { setIdofrow([row.original._id, row.original.amount, row.original.action]) }} aria-label="upload picture"  ><FontAwesomeIcon icon={faEdit} className="text-2xl cursor-pointer text-blue-500" /></button>

                                        //             :
                                        //             <div className=" space-x-3">
                                        //                 {cell.column.id === "Edit" && <button type='submit' className="btn btn-accent" disabled={CValid && DEValid ? false : true} onClick={handleUpdatExpense} > <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                        //                 {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                        //             </div>


                                        //     }
                                        //     {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate([row.original._id, row.original.amount, row.original.action]) }}><FontAwesomeIcon icon={faTrash} className="text-2xl cursor-pointer text-red-700" /></label>}


                                        // </td>
                                        <td key={idx} className="  text-center   py-3 overflow-auto" {...cell.getCellProps()}>



                                            {cell.column.id === 'amount' && (
                                                <>
                                                    {cell.value * -1 >= 0 ? <div className="text-green-500">{cell.value&&cell.value * -1}</div> : <div className="text-red-500">{cell.value&&cell.value * -1}</div>
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
            {/* </div > */}

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

                {
                    Header: () => {
                        return (

                            "Is Soled "
                        )
                    },

                    accessor: 'isSoled',
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

                <div className="pt-5  mb-32 grid grid-cols-1 md:grid-cols-2 gap-10  ">


                    <div className="   z-30  mx-5   ">



                    </div>


                    <div onClick={() => {
                        page == 1 && setPage(2)
                        page == 2 && setPage(1)
                    }}
                        className="p-5 cursor-pointer scale-75 lg:scale-100 justify-self-end border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg  w-64      z-30    ">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.reseler}</div>
                                {/* <div className="text-2xl font-bold ">{AllQarzAmount}</div> */}
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                    {page == 2 && <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-2xl" />}
                                    {page == 1 && <FontAwesomeIcon icon={faCar} className="text-2xl" />}

                                </div>
                            </div>

                        </div>
                    </div>


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











