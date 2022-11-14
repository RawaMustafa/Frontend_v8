

import useLanguage from '../../../Component/language';
import AdminLayout from '../../../Layouts/AdminLayout';

import { useEffect, useMemo, useState, useRef } from 'react';
import Head from 'next/head'


// import { Filter, DefaultColumnFilter, dateBetweenFilterFn, DateRangeColumnFilter } from '../Balance/Filter';


import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
// import { GlobalFilter } from '../Balance/GlobalFilter';

import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


import axios from "axios"
import Axios from "../../api/Axios"

import { ToastContainer, toast, } from 'react-toastify';

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';





const Amount_regex = /^[0-9-]{0,8}$/;
const date_regex = /^\d{4}-\d{2}-\d{2}$/;
const action_regex = /^[0-9a-zA-Z=> ]{0,50}$/;


import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
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

    // try {
    //     const res = await Axios.get(`/users/?search=&page=1&limit=10`)
    //     data = await res.data.total
    // } catch {
    //     data = 1
    // }



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

    const [StartDate, setStartDate] = useState("2000-1-1");
    const [EndDate, setEndDate] = useState("2100-1-1");

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
                // ${StartDate}/${EndDate}?search=${Search}&page=${Page}&limit=${Limit}

                const res = await Axios.get(`/bal/?search=${Search}&page=${Page}&limit=${Limit}`, {
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
                setTotalUsers(res.data.total)


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

    const table_All_pdff = () => {



        var obj = JSON.parse(JSON.stringify(DataTable))
        var res = [];
        //
        for (var i in obj)
            res.push(obj[i]);


        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({
            head: [[`Amount`, " User Id", "Action", "Date"]],
            body: res.map((d) => [d.amount, d.userId, d.action, d.actionDate])
        });
        doc.save("ALL(Data).pdf");





    };



    const {



        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        state,
        setGlobalFilter,
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
        <div className=" container mx-auto  overflow-auto ">



            <div className=" flex justify-between   container mx-auto items-center p-2 min-w-[700px] ">

                <div>

                    <label htmlFor="my-modal" className="btn modal-button flex justify-center items-center ">
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-xl  " />
                    </label>

                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box space-y-12">

                            <div>{l.add} {l.balance}</div>
                            <div>


                                <input
                                    required name='Amount' type="number" placeholder={l.amount}
                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                    onFocus={() => { setCFocus(true) }}
                                    onBlur={() => { setCFocus(false) }}

                                    className=" input input-bordered input-info w-full max-w-xl mt-5 dark:placeholder:text-white dark:color-white"
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


                <div className="flex justify-center items-center lg:space-x-4 ">
                    <input type="search" placeholder={`${l.search} ...`} className="input   input-info  w-full max-w-xs mx-5 focus:outline-0"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />

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
                            {/* <li><button className='btn btn-outline' onClick={table_All_pdff}>ALL_PDF</button> </li> */}
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


                                        <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>



                                            {cell.column.id === 'amount' && row.original._id !== Idofrow?.[0] && (

                                                cell.value >= 0 ? <div className="text-green-500">{cell.value}</div> : <div className="text-red-500">{cell.value}</div>
                                            )}

                                            {cell.column.id === 'userId' && row.original._id !== Idofrow?.[0] && (
                                                <>


                                                    {cell.value?.userRole == "Qarz" && <Link href={`/Dashboard/Balance/ListofOwe/${cell.value?._id}`}><a className="text-red-300">{cell.value?.userName}</a></Link>}
                                                    {cell.value?.userRole == "Reseller" && <Link href={`/Dashboard/Balance/Reseller/${cell.value?._id}`}><a className="text-violet-300">{cell.value?.userName}</a></Link>}
                                                    {cell.value?.userRole == "Admin" && <a className="text-blue-400 cursor-crosshair">{cell.value?.userName}</a>}




                                                </>

                                            )}

                                            {cell.column.id === 'carId' && row.original._id !== Idofrow?.[0] && (
                                                <>


                                                    <Link href={`/Dashboard/ListofCars/AllCars/${cell.value?._id}`}><a className="text-orange-200">{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
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

                                                            type="number" placeholder={cell.column.id} name='amount' className="input input-bordered input-warning w-full max-w-xs" />}

                                                        {cell.column.id == "action" &&
                                                            <textarea name='action'
                                                                defaultValue={row.original.action}
                                                                ref={ACRef}
                                                                type="textarea"
                                                                onChange={(event) => { handleSaveExpenseData(event) }}
                                                                onClick={(event) => { handleSaveExpenseData(event) }}
                                                                onFocus={() => { setDEFocus(true) }}
                                                                onBlur={() => { setDEFocus(false) }}

                                                                className="textarea textarea-warning  w-full max-w-xs" placeholder={cell.column.id}></textarea>}
                                                        {cell.column.id == "actionDate" && <input disabled
                                                            defaultValue={row.original.actionDate}
                                                            ref={DRef}
                                                            onChange={(event) => { handleSaveExpenseData(event) }}
                                                            onClick={(event) => { handleSaveExpenseData(event) }}
                                                            onFocus={() => { setDFocus(true) }}
                                                            onBlur={() => { setDFocus(false) }}

                                                            name='actionDate' type="date" placeholder={l.date} className="input input-warning   w-full max-w-xl  " />}


                                                    </>

                                                    :
                                                    (cell.column.id != 'userId' && cell.column.id != 'amount' && cell.column.id != 'carId') && cell.render('Cell')

                                            }



                                            {
                                                row.original._id !== Idofrow?.[0] ?
                                                    cell.column.id === "Edit" &&
                                                    <button ref={inputRef} onClick={() => { setIdofrow([row.original._id, row.original.amount, row.original.action]) }} aria-label="upload picture"  ><FontAwesomeIcon icon={faEdit} className="text-2xl cursor-pointer text-blue-500" /></button>

                                                    :
                                                    <div className=" space-x-3">
                                                        {cell.column.id === "Edit" && <button type='submit' className="btn btn-accent" disabled={CValid && DEValid ? false : true} onClick={handleUpdatExpense} > <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                        {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                    </div>


                                            }
                                            {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate([row.original._id, row.original.amount, row.original.action]) }}><FontAwesomeIcon icon={faTrash} className="text-2xl cursor-pointer text-red-700" /></label>}


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

                <div className=" flex justify-between container mx-auto items-center   p-3  px-1 mb-20  min-w-[700px]">


                    <div className=" flex  space-x-5 mx-5 text-lg items-center     ">

                        <div>

                            {l.page}{" "}
                            <span>
                                {pageIndex + 1}{"/"}{pageOptions.length}
                            </span>
                        </div>

                        <div>

                            <select className="select select-info  w-full max-w-xs"
                                onChange={(e) => {
                                    setLimit((e.target.value) * 2)
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




                    <div className="space-x-2  overflow-auto inline-flex  scrollbar-hide ">
                        <div></div>
                        <button className="btn w-2 h-2 btn-info   " onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"} </button>
                        <button className="btn w-2 h-2 btn-info" onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"} </button>
                        <button className="btn w-2 h-2 btn-info" onClick={() => nextPage()} disabled={!canNextPage}>{">"} </button>
                        <button className="btn w-2 h-2 btn-info " onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"} </button>
                    </div>

                </div>

            </div>

            <input name="error_btn" type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
            <div className="modal  ">
                <div className="modal-box relative ">
                    <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                    <div className="text-lg font-bold text-center"><FontAwesomeIcon icon={faBan} className="text-7xl text-red-700  " /> </div>
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








const Expense = ({ SessionID }) => {

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
                        return "Date";
                    },

                    accessor: 'actionDate',
                    disableFilters: false,
                    // Filter: DateRangeColumnFilter,
                    // filter: dateBetweenFilterFn,

                },


                {
                    Header: "Edit",
                    disableFilters: true,



                },
                {
                    Header: "Delete",

                    disableFilters: true,



                },



            ], [SessionID]
        )



    if (session.status === "loading") {
        return (
            <div className="w-100 h-100 text-center">
                Loading...
            </div>
        )
    }

    if (session.status === "unauthenticated") {
        return router.push("/")
    }

    if (session.status === "authenticated") {
        return (


            < >
                <Head>
                    <title >{l.account}</title>
                </Head>





                <Table COLUMNS={COLUMNS} SessionID={SessionID} />





                <ToastContainer
                    draggablePercent={60}
                />


            </ >
        );
    }
}



Expense.Layout = AdminLayout;




export default Expense;






