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
import { faCalendarPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faCalendarCheck, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { faFilePdf as PDF, faCalendarCheck as CALLENDER, faCalendarPlus as Plusss } from '@fortawesome/free-regular-svg-icons';





const Amount_regex = /^[0-9.]{0,12}$/;
const date_regex = /^\d{4}-\d{2}-\d{2}$/;
const action_regex = /^[0-9a-zA-Z-+_/ =<>,. ]{0,100}$/;



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

    let data

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
    const [TotalUsers, setTotalUsers] = useState([]);
    const [TransferUser, setTransferUser] = useState(['none']);


    const [DataTable, setDataTable] = useState([]);

    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
    const [UsersBalance, setUsersBalance] = useState()
    const [Data, setData] = useState({

        Amount: 0,
        action: "",
        note: ""

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

        if (savename == "note") {
            savevalue?.match(action_regex) == null || savevalue.match(action_regex)[0] != savevalue ? setDValid(false) : setDValid(true);
            savevalue = event.target.value.match(action_regex)?.map(String)[0];

        }



        const newdata = { ...Data }
        newdata[savename] = savevalue;
        setData(newdata);


    }



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



    useEffect(() => {

        if (session.status === "authenticated") {
            const getExpenseData = async () => {
                const auth = {
                    headers: {
                        "Content-Type": "application/json",

                        'Authorization': `Bearer ${session?.data?.Token}`

                    }
                }

                try {
                    const res = await Axios.get(`/bal/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || '2000-01-01'}&edate${EndDate || "2500-01-01"}`, auth
                    )

                    setDataTable(res.data.History)
                    setPageS(Math.ceil(res.data.total[0].total / Limit))


                    const users = await Axios.get(`/users/Reseller/`, auth)
                    setTotalUsers(users.data.userDetail)
                }
                catch {
                    // setDataTable([])
                }
            }
            getExpenseData()
            setReNewData(false)
        }
    }, [Search, Page, Limit, StartDate, EndDate, ReNewData, session.status])





    const addBalance = async () => {

        const auth = {
            headers: {
                "Content-Type": "application/json",

                'Authorization': `Bearer ${session?.data?.Token}`

            }
        }

        if (TransferUser != "none") {
            const users = await Axios.get(`/users/detail/${TransferUser?.split?.(",")?.[0]}`, auth,)
            const UsersBalance = users.data.userDetail.TotalBals

            try {

                await Axios.patch("/users/" + TransferUser?.split?.(",")?.[0], {
                    TotalBals: UsersBalance - Data.Amount
                }, auth,)

                toast.success("Balance Adeed Successfully");

            }
            catch {
                toast.error("Something Went Wrong*");
            }

        }


        const users = await Axios.get(`/users/detail/${SessionID}`, auth,)

        const UsersBalance = users.data.userDetail.TotalBals
        try {

            await Axios.patch("/users/" + SessionID, {
                TotalBals: UsersBalance + Data.Amount
            }, auth,)

            await Axios.post("/bal/", {
                amount: Data.Amount,
                action: TransferUser == "none" ? "Balance" : "Transfer",
                userId: TransferUser == "none" ? SessionID : TransferUser.split(",")?.[0],
                note: Data.note,
                isSoled: false

            }, auth,)
            setReNewData(true)
            toast.success("Balance Adeed Successfully");

        } catch (error) {
            toast.error("Balance Not Added *");
        } finally {
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


            head: [[`Amount`, "Action", " Cars", " User", " Note", "Date"]],
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
        <div className="container mx-auto shadow  my-10">
            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-2xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

                    <label htmlFor="my-modal" className="flex items-center justify-center p-2 px-3  active:scale-90  hover:cursor-pointer">
                        <FontAwesomeIcon icon={Plusss} className="text-2xl " />
                    </label>


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
            </div>

            {/* //?   Modal  */}
            <div>
                <input type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal">
                    <div className="space-y-12 modal-box">

                        <div>{l.add} {l.balance}</div>
                        <div>
                            <label htmlFor="Amount">{l.amount}</label>
                            <input
                                id='Amount'
                                required name='Amount' type="number" placeholder={l.amount}
                                onClick={(event) => { handleSaveExpenseData(event) }}
                                onChange={(event) => { handleSaveExpenseData(event) }}
                                onFocus={() => { setCFocus(true) }}
                                onBlur={() => { setCFocus(false) }}
                                className="w-full max-w-xl input input-bordered input-info dark:placeholder:text-white dark:color-white focus:outline-0"
                            />

                            <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!CValid && !CFocus && Data.Amount != "" ? "block" : "hidden"}`}>
                                {l.incorrect}
                                <br />
                                {l.number7}
                            </p>
                            <div className=' mt-5   '>
                                <label htmlFor="User" >{l.transfer}</label>
                                <select id='User'
                                    onChange={(event) => {
                                        setTransferUser(event.target.value)
                                    }}
                                    onClick={(event) => { setTransferUser(event.target.value) }}

                                    defaultValue="none"
                                    className="w-full max-w-xl input input-bordered input-info dark:placeholder:text-white dark:color-white focus:outline-0">
                                    <option value="none">{l.none}</option>
                                    {TotalUsers?.map((user, idx) => (
                                        <option key={idx} value={[user._id, user.userName]}>{user.userName}</option>
                                    ))}
                                </select >
                            </div>
                            <div className=' mt-5   '>
                                <label htmlFor="note" >{l.note}</label>
                                <input
                                    id='note'
                                    required name='note' type="text" placeholder={l.note}
                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                    onFocus={() => { setCFocus(true) }}
                                    onBlur={() => { setCFocus(false) }}
                                    className="w-full max-w-xl input input-bordered input-info dark:placeholder:text-white dark:color-white focus:outline-0"
                                />
                            </div>




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
            {/* //?   Modal  */}


            <div className="container mx-auto overflow-auto bg-white dark:bg-[#181a1b]  ">
                {/* //?    Table      */}
                <table id="table-to-xls" className="my-10 table w-full  min-w-[650px]  text-xs" {...getTableProps()}>

                    <thead className="text-center">
                        {headerGroups.map((headerGroups, idx) => (
                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th key={idx} className='hidden'></th>
                                {headerGroups.headers.map((column, idx) => (
                                    <th key={idx} className=" text-xs font-normal normal-case " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? "⇅" : "⇵") : ""}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead >
                    <tbody {...getTableBodyProps()}>

                        {page.map((row, idx) => {
                            prepareRow(row)
                            return (
                                <tr key={idx}   {...row.getRowProps()} >
                                    <th key={idx} className='hidden'></th>

                                    {row.cells.map((cell, idx) => {
                                        return (
                                            <td key={idx} className="py-3 text-center dark:bg-[#181a1b] " {...cell.getCellProps()}>



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
                                                        <Link href={`/Dashboard/ListofCars/AllCars/${row.original.carId}`}><a className="text-orange-600">{row.original.modeName}</a></Link>
                                                    </>
                                                )}

                                                {
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
                {/* //?    Table      */}




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






