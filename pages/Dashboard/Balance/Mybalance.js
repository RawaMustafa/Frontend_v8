

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





const cost_regex = /^[0-9]{0,8}$/;
const date_regex = /^\d{4}-\d{2}-\d{2}$/;
const DESC_regex = /^[0-9a-zA-Z]{0,50}$/;


import { getSession } from "next-auth/react";

export const getServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session || !session?.userRole == "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }
    return {
        props: {


        }
    }
}

const Table = ({ COLUMNS }) => {

    const [ReNewData, setReNewData] = useState(false);

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [StartDate, setStartDate] = useState("2000-1-1");
    const [EndDate, setEndDate] = useState("2100-1-1");



    const [DataTable, setDataTable] = useState([]);

    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
    const [Data, setData] = useState({
        date: "",
        DESC: "",
        cost: 0,
    });

    const [DataUpdate, setDataUpdate] = useState({
        date: "",
        DESC: "",
        cost: 0,
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
    const DERef = useRef();
    const inputRef = useRef();


    const handleSaveExpenseData = (event) => {
        const savename = event.target.getAttribute('name')
        const savevalue = event.target.value;
        const type = event.target.getAttribute('type')




        if (savename == "DESC") {

            savevalue = event.target.value.match(DESC_regex)?.[0];
            savevalue?.match(DESC_regex) == null || savevalue.match(DESC_regex)[0] != savevalue ? setDEValid(false) : setDEValid(true);

        }

        if (type == "number") {
            savevalue?.match(cost_regex) == null || savevalue.match(cost_regex)[0] != savevalue ? setCValid(false) : setCValid(true);
            savevalue = event.target.value.match(cost_regex)?.map(Number)[0];

        }

        if (savename == "date") {
            savevalue?.match(date_regex) == null || savevalue.match(date_regex)[0] != savevalue ? setDValid(false) : setDValid(true);
            savevalue = event.target.value.match(date_regex)?.map(String)[0];
        }



        const newdata = { ...Data }
        newdata[savename] = savevalue;
        setData(newdata);


    }




    let count = 0

    useEffect(() => {


        CRef.current?.value?.match(cost_regex) == null || CRef.current.value?.match(cost_regex)[0] != CRef.current.value ? setCValid(false) : setCValid(true);

        DERef.current?.value?.match(DESC_regex) == null || DERef.current.value?.match(DESC_regex)[0] != DERef.current.value ? setDEValid(false) : setDEValid(true);

        DRef.current?.value?.match(date_regex) == null || DRef.current.value?.match(date_regex)[0] != DRef.current.value ? setDValid(false) : setDValid(true);




        const newdataUpdate = { ...DataUpdate }


        newdataUpdate.cost = CRef.current?.value.match(cost_regex)?.map(String)[0];


        newdataUpdate.date = DRef.current?.value.match(date_regex)?.map(String)[0];

        newdataUpdate.DESC = DERef.current?.value.match(DESC_regex)?.map(String)[0];




        setDataUpdate(newdataUpdate);





    }, [CRef?.current?.value, DRef?.current?.value, DERef?.current?.value, count])

    // inputRef?.current




    const handleUpdatExpense = async () => {


        try {


            await Axios.patch(`/ownCost/${Idofrow}`, DataUpdate)
            toast.success("Data Updated Successfully")
        } catch (error) {

            error.response.status == 403 || error.response.status == 409 || error.response.status == 404 || error.response.status == 401 &&

                toast.error("Something Went Wrong")
        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                date: "",
                DESC: "",
                cost: 0,
            });
            // getExpenseData()
            setReNewData(true)

        }



    }

    const handledeleteExpenseData = async () => {

        try {
            await Axios.delete(`/ownCost/${Deletestate}`)

            toast.warn("Data Deleted Successfully")

        } catch (error) {


            error.response.status == 403 || error.response.status == 409 || error.response.status == 404 || error.response.status == 401 &&

                toast.error("Something Went Wrong")

        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                date: "",
                DESC: "",
                cost: 0,
            });
            // getExpenseData()
            setReNewData(true)

        }



    }





    const addExpense = async () => {

        try {

            await Axios.post("/ownCost/", Data)

            toast.success("Data Adeed Successfully");

        } catch (error) {
            error.request.status === 409 || error.request.status === 403 || error.request.status === 404 || error.request.status === 401 &&
                toast.error("Data Not Added");
            // 
        } finally {

            setData({
                date: "",
                DESC: "",
                cost: 0,
            });
            // getExpenseData()
            setReNewData(true)
        }

    }



    useEffect(() => {
        const getExpenseData = async () => {

            const res = await Axios.get(`/ownCost/${StartDate}/${EndDate}?search=${Search}&page=${Page}&limit=${Limit}`)

            setDataTable(res.data.costDetail)
        }
        getExpenseData()
        setReNewData(false)
    }, [Search, Page, Limit, StartDate, EndDate, ReNewData])







    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({


            head: [[`Amount`, " pay for", "Date"]],
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
            head: [[`Amount`, " pay for", "Date"]],
            body: res.map((d) => [d.OtherCost, d.DescCost, d.actionDate])
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
        <div className="  ml-1 ">



            <div className=" flex justify-between border rounded-lg container mx-auto items-center p-2  ">

                <div>

                    <label htmlFor="my-modal" className="btn modal-button flex justify-center items-center ">
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-xl  " />
                    </label>

                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box space-y-12">

                            <div>{l.expense}</div>
                            <div>
                                <input
                                    required name='cost' type="number" placeholder={l.amount}
                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                    onFocus={() => { setCFocus(true) }}
                                    onBlur={() => { setCFocus(false) }}

                                    className=" input input-bordered input-info w-full max-w-xl mt-5 dark:placeholder:text-white dark:color-white"
                                />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!CValid && !CFocus && Data.cost != "" ? "block" : "hidden"}`}>
                                    {l.incorrect}
                                    <br />
                                    {l.number7}


                                </p>

                            </div>
                            <div>
                                <textarea name='DESC'
                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                    onFocus={() => { setDEFocus(true) }}
                                    onBlur={() => { setDEFocus(false) }}

                                    className="textarea textarea-info w-full max-w-xl mt-5 dark:placeholder:text-white dark:color-white" placeholder="Bio"></textarea>
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!DEValid && !DEFocus && Data.DESC != "" ? "block" : "hidden"}`}>
                                    {l.incorrect}
                                    <br />
                                    {l.charecter416}


                                </p>

                            </div>

                            <div>
                                <input name='date' type="date" placeholder={l.date}
                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                    onFocus={() => { setDFocus(true) }}
                                    onBlur={() => { setDFocus(false) }}
                                    className="input input-bordered input-info w-full max-w-xl  dark:placeholder:text-white dark:color-white" />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!DValid && !DFocus && Data.date != "" ? "block" : "hidden"}`}>
                                    {l.incorrect}
                                    <br />


                                </p>

                            </div>


                            <div className="modal-action">
                                <div></div>
                                <label htmlFor="my-modal" className="btn btn-error"  >{l.cancel}</label>
                                <label htmlFor="my-modal" onSubmit={(e) => { e.click() }}   >
                                    <input type="submit" className="btn btn-success" disabled={DValid && CValid ? false : true} onClick={addExpense} value={l.add} />
                                </label>

                            </div>

                        </div>
                    </div>
                </div>


                <div className="flex justify-center items-center lg:space-x-4">
                    <input type="search" placeholder="Search ..." className="input   input-primary  w-full max-w-xs"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />

                    <div className="dropdown dropdown-end ">
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
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-90 active:rotate-180 ease-in-out  transition" />
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
                            <li><button className='btn btn-outline' onClick={table_All_pdff}>ALL_PDF</button> </li>
                        </ul>
                    </div>


                </div>


            </div>



            <div className="flex justify-center  py-2    ">




                <table id="table-to-xls" className=" ml-1  overflow-auto inline-block   " {...getTableProps()}>


                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className="p-4 m-44      w-80   " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

                                        <span>
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


                                                {
                                                    cell.column.id !== "Delete" &&
                                                        cell.column.id !== "Edit" &&
                                                        row.original._id == Idofrow ?
                                                        <>

                                                            {cell.column.id == "OtherCost" && <input defaultValue={row.original.OtherCost}
                                                                ref={CRef}
                                                                onChange={(event) => { handleSaveExpenseData(event) }}
                                                                onClick={(event) => { handleSaveExpenseData(event) }}
                                                                onFocus={() => { setCFocus(true) }}
                                                                onBlur={() => { setCFocus(false) }}

                                                                type="number" placeholder={cell.column.id} name='cost' className="input input-bordered input-warning w-full max-w-xs" />}

                                                            {cell.column.id == "DescCost" &&
                                                                <textarea name='DESC'
                                                                    defaultValue={row.original.DescCost}
                                                                    ref={DERef}
                                                                    type="textarea"
                                                                    onChange={(event) => { handleSaveExpenseData(event) }}
                                                                    onClick={(event) => { handleSaveExpenseData(event) }}
                                                                    onFocus={() => { setDEFocus(true) }}
                                                                    onBlur={() => { setDEFocus(false) }}

                                                                    className="textarea textarea-warning  w-full max-w-xs" placeholder={cell.column.id}></textarea>}
                                                            {cell.column.id == "actionDate" && <input
                                                                defaultValue={row.original.actionDate}
                                                                ref={DRef}
                                                                onChange={(event) => { handleSaveExpenseData(event) }}
                                                                onClick={(event) => { handleSaveExpenseData(event) }}
                                                                onFocus={() => { setDFocus(true) }}
                                                                onBlur={() => { setDFocus(false) }}

                                                                name='date' type="date" placeholder={l.date} className="input input-warning   w-full max-w-xl  " />}


                                                        </>

                                                        :
                                                        cell.render('Cell')

                                                }



                                                {row.original._id !== Idofrow ?
                                                    cell.column.id === "Edit" &&
                                                    <button ref={inputRef} onClick={() => { setIdofrow(row.original._id) }} aria-label="upload picture"  ><FontAwesomeIcon icon={faEdit} className="text-2xl cursor-pointer text-blue-500" /></button>

                                                    :
                                                    <div className=" space-x-3">
                                                        {cell.column.id === "Edit" && <button type='submit' className="btn btn-accent" disabled={CValid && DEValid && DValid ? false : true} onClick={handleUpdatExpense} > <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                        {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                    </div>


                                                }
                                                {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate(row.original._id) }}><FontAwesomeIcon icon={faTrash} className="text-2xl cursor-pointer text-red-700" /></label>}


                                            </td>

                                        )
                                    })}

                                </tr>
                            )
                        }

                        )}

                    </tbody>


                </table>
            </div >

            <div className="botom_Of_Table" >

                <div className=" flex justify-between container mx-auto items-center border rounded-xl p-3  px-1 mb-20 ">



                    <div className=" flex  space-x-5 mx-5 text-lg items-center     ">

                        <div>

                            {l.page}{""}
                            <span>
                                {pageIndex + 1}{l.of}{pageOptions.length}
                            </span>
                        </div>

                        <div>

                            <select className="select select-primary  w-full max-w-xs"
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
                        <button className="btn w-2 h-2 btn-primary   " onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"} </button>
                        <button className="btn w-2 h-2 btn-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"} </button>
                        <button className="btn w-2 h-2 btn-primary" onClick={() => nextPage()} disabled={!canNextPage}>{">"} </button>
                        <button className="btn w-2 h-2 btn-primary " onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"} </button>
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








const Expense = (props) => {






    const COLUMNS =
        useMemo(() =>
            [


                {
                    Header: () => {
                        return (

                            l.amount
                        )
                    },

                    disableFilters: true,

                    accessor: 'OtherCost',


                },



                {
                    Header: () => {
                        return (

                            l.payfor
                        )
                    },

                    accessor: 'DescCost',
                    disableFilters: true,


                },
                {
                    Header: () => {

                        return l.date;
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



            ], [props]
        )



    const l = useLanguage();

    return (


        < >
            <Head>
                <title >{l.account}</title>
            </Head>





            <Table COLUMNS={COLUMNS} />





            <ToastContainer
                draggablePercent={60}
            />


        </ >
    );
}



Expense.Layout = AdminLayout;




export default Expense;






