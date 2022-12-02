import useLanguage from '../../../Component/language';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useEffect, useMemo, useState, useRef } from 'react';
import Head from 'next/head'
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import axios from "axios"
import Axios from "../../api/Axios"
import { ToastContainer, toast, } from 'react-toastify';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';





const Amount_regex = /^[0-9.]{0,8}$/;
const date_regex = /^\d{4}-\d{2}-\d{2}$/;
const action_regex = /^[0-9a-zA-Z=> ]{0,50}$/;



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
        const res = await Axios.get(`/bal/?search=&page=1&limit=10`,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.Token}`
                }
            }
        )

        data = await res.data.total[0].total
    } catch {
        data = 1
    }

    return {
        props: {

            AllUsers: data,
            SessionID: session.id
        }
    }
}

const Table = ({ COLUMNS, AllUsers, SessionID }) => {
    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);



    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2500-01-01");

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
                    const res = await Axios.get(`/bal/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || '2000-01-01'}&edate${EndDate || "2500-01-01"}`, {
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










    const addBalance = async () => {

        try {

            await Axios.patch("/users/" + SessionID, {
                TotalBals: UsersBalance + Data.Amount
            }, {
                headers: {
                    "Content-Type": "application/json",

                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)

            await Axios.post("/bal/", {
                amount: Data.Amount,
                action: "Balance",
                userId: SessionID

            }, {
                headers: {
                    "Content-Type": "application/json",

                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)
            setReNewData(true)

            toast.success("Balance Adeed Successfully");

        } catch (error) {
            // error.request.status === 409 || error.request.status === 403 || error.request.status === 404 || error.request.status === 401 &&
            toast.error("Balance Not Added *");
            // 
        } finally {

            // setData({
            //     date: "",
            //     DESC: "",
            //     Amount: 0,
            // });
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
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({


            head: [[`Amount`, " User Id", "Action", "Date"]],
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
        <div className="container mx-auto overflow-auto ">



            <div className=" flex justify-between   container mx-auto items-center p-2 min-w-[700px] ">

                <div>


                    <label htmlFor="my-modal" className="flex items-center justify-center btn modal-button ">
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-xl " />
                    </label>

                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="space-y-12 modal-box">

                            <div>{l.add} {l.balance}</div>
                            <div>


                                <input
                                    required name='Amount' type="number" placeholder={l.amount}
                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                    onFocus={() => { setCFocus(true) }}
                                    onBlur={() => { setCFocus(false) }}

                                    className="w-full max-w-xl mt-5 input input-bordered input-info dark:placeholder:text-white dark:color-white"
                                />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!CValid && !CFocus && Data.Amount != "" ? "block" : "hidden"}`}>
                                    {l.incorrect}
                                    <br />
                                    {l.number7}


                                </p>

                            </div>


                            <div className="modal-action">
                                <div></div>
                                <label htmlFor="my-modal" className="btn btn-error"  >{l.cancel}</label>
                                <label htmlFor="my-modal" onSubmit={(e) => { e.click() }}   >
                                    <input type="submit" className="btn btn-success" disabled={CValid ? false : true} onClick={addBalance} value={l.add} />
                                </label>

                            </div>

                        </div>
                    </div>

                </div>
                <div className="flex">

                    <input type="search" placeholder={`${l.search} ...`} className="w-full max-w-xs mx-5 input input-info focus:outline-0"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>


                <div className="flex items-center justify-center lg:space-x-4 ">


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left ">

                        {/* //TODO -  fix Date */}
                        <label tabIndex="0" className="m-1 active:scale-95">
                            <FontAwesomeIcon icon={faCalendarCheck} tabIndex="0" className="w-8 h-8 active:scale-95 " />
                        </label>

                        <ul tabIndex="0" className="flex justify-center shadow dropdown-content bg-base-100 rounded-box w-52 ">
                            <li className="py-2 ">

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
                        <label tabIndex="0" className="m-1 " >
                            <FontAwesomeIcon icon={faFileDownload} className="m-auto mx-1 text-3xl transition ease-in-out md:mx-5 active:scale-90" />
                        </label>

                        <ul tabIndex="0" className="flex justify-center p-2 space-y-2 shadow dropdown-content menu bg-base-100 rounded-box w-52 ">
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



            <table id="table-to-xls" className="my-10 table w-full     min-w-[1000px] " {...getTableProps()}>


                <thead className="text-center">

                    {headerGroups.map((headerGroups, idx) => (

                        <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                            <th></th>
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


                                        <td key={idx} className="py-3 text-center " {...cell.getCellProps()}>



                                            {cell.column.id === 'amount' && row.original._id !== Idofrow?.[0] && (

                                                cell.value >= 0 ? <div className="text-green-500">{cell.value}</div> : <div className="text-red-500">{cell.value}</div>
                                            )}



                                            {cell.column.id === 'userId' && row.original._id !== Idofrow?.[0] && (
                                                <>
                                                    <div>{row.original.userName}</div>
                                                    {cell.value?.userRole == "Qarz" && <Link href={`/Dashboard/Balance/ListofOwe/${cell.value?._id}`}><a className="text-red-300">{cell.value?.userName}</a></Link>}
                                                    {cell.value?.userRole == "Reseller" && <Link href={`/Dashboard/Balance/Reseller/${cell.value?._id}`}><a className="text-violet-300">{cell.value?.userName}</a></Link>}
                                                    {cell.value?.userRole == "Admin" && <a className="text-blue-400 cursor-crosshair">{cell.value?.userName}</a>}




                                                </>

                                            )}

                                            {cell.column.id === 'carId' && row.original._id !== Idofrow?.[0] && (
                                                <>

                                                    <div></div>
                                                    <Link href={`/Dashboard/ListofCars/AllCars/${row.original.carId}`}><a className="text-orange-200">{row.original.modeName}</a></Link>
                                                </>

                                            )
                                            }


                                            {
                                                cell.column.id !== "Delete" &&
                                                    cell.column.id !== "Edit" &&
                                                    row.original._id == Idofrow?.[0] ?
                                                    <>

                                                        {cell.column.id == "amount" && <input defaultValue={row.original.amount}
                                                            ref={CRef}
                                                            onChange={(event) => { handleSaveExpenseData(event) }}
                                                            onClick={(event) => { handleSaveExpenseData(event) }}
                                                            onFocus={() => { setCFocus(true) }}
                                                            onBlur={() => { setCFocus(false) }}

                                                            type="number" placeholder={cell.column.id} name='amount' className="w-full max-w-xs input input-bordered input-warning" />}

                                                        {cell.column.id == "action" &&
                                                            <input name='action'
                                                                defaultValue={row.original.action}
                                                                ref={ACRef}
                                                                type="text"
                                                                onChange={(event) => { handleSaveExpenseData(event) }}
                                                                onClick={(event) => { handleSaveExpenseData(event) }}
                                                                onFocus={() => { setDEFocus(true) }}
                                                                onBlur={() => { setDEFocus(false) }}

                                                                className="w-full max-w-xs input input-warning" placeholder={cell.column.id}></input>}
                                                        {cell.column.id == "actionDate" && <input disabled
                                                            defaultValue={row.original.actionDate}
                                                            ref={DRef}
                                                            onChange={(event) => { handleSaveExpenseData(event) }}
                                                            onClick={(event) => { handleSaveExpenseData(event) }}
                                                            onFocus={() => { setDFocus(true) }}
                                                            onBlur={() => { setDFocus(false) }}

                                                            name='actionDate' type="date" placeholder={l.date} className="w-full max-w-xl input input-warning " />}


                                                    </>

                                                    :
                                                    (cell.column.id != 'userId' && cell.column.id != 'amount' && cell.column.id != 'carId') && cell.render('Cell')

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



                    <div className="flex items-center justify-around mx-5 text-lg ">


                        <span className="px-3">
                            {l.page}{" " + Page}/{PageS}
                        </span>

                        <div>
                            <select className="w-full max-w-xs select select-info focus:outline-0"
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




                    <div className="inline-flex space-x-3 overflow-auto scrollbar-hide ">
                        <div></div>



                        <button className="w-2 h-2 border-0 btn btn-info " onClick={() =>
                            setPage(1)
                        }
                            disabled={
                                Page == 1 ? true : false
                            }
                        >{"<<"} </button>


                        <button className="w-2 h-2 btn btn-info" onClick={() =>
                            setPage(Page - 1)
                        }
                            disabled={
                                Page <= 1 ? true : false

                            }
                        >{"<"}
                        </button>


                        <button className="w-2 h-2 btn btn-info" onClick={() =>
                            Page >= 1 && setPage(Page + 1)
                        }
                            disabled={
                                Page >= PageS ? true : false
                            }
                        >{">"} </button>


                        <button className="w-2 h-2 btn btn-info "
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

            <input name="error_btn" type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
            <div className="modal ">
                <div className="relative modal-box ">
                    <label htmlFor="my-modal-3" className="absolute btn btn-sm btn-circle right-2 top-2 ">✕</label>
                    <div className="text-lg font-bold text-center"><FontAwesomeIcon icon={faBan} className="text-red-700 text-7xl " /> </div>
                    <p className="py-4 ">{l.deletemsg}</p>
                    <div className="space-x-10 ">
                        <label htmlFor="my-modal-3" className="btn btn-error " onClick={handledeleteExpenseData}>{l.yes}</label>
                        <label htmlFor="my-modal-3" className="btn btn-accent " onClick={() => { setDeletestate(null) }} >{l.no}</label>
                    </div>
                </div>
            </div>

        </div >

    );


}








const Expense = ({ SessionID, AllUsers }) => {

    const session = useSession()
    const router = useRouter()



    const l = useLanguage();

    const COLUMNS =
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

                            "User "
                        )
                    },

                    accessor: 'userId',
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





                <Table COLUMNS={COLUMNS} SessionID={SessionID} AllUsers={AllUsers} />





                <ToastContainer
                    draggablePercent={60}
                />


            </ >
        );
    }
}



Expense.Layout = AdminLayout;




export default Expense;






