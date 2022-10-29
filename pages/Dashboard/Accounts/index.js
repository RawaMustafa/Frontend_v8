import useLanguage from '../../../Component/language';
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
import { faUserPlus, faTrash, faEdit, faSave, faBan, faFileDownload } from '@fortawesome/free-solid-svg-icons';

import { getSession } from "next-auth/react";


export async function getServerSideProps({ req, query }) {
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
            initQuery: query
        }
    }
}


// import kurdish from "../../../Component/fonts/kurdish-normal";



const emai_regex = /^[\w-\.]{4,20}@([a-z]{2,6}\.)+[a-z]{2,4}$/;
const password_regex = /^[a-zA-Z0-9\.\-\_]{4,16}$/;
const userName_regex = /^[a-zA-Z0-9]{4,12}$/;
const userRole_regex = /^[a-zA-Z0-9\.\-\_]{4,16}$/;
const TotalBals_regex = /^[0-9]{0,7}$/;


const Table = ({ COLUMNS }) => {

    const [ReNewData, setReNewData] = useState(false);

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(4);



    const [DataTable, setDataTable] = useState([]);
    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
    const [Data, setData] = useState({
        "userName": "",
        "email": "",
        "password": "",
        "userRole": "",
        "TotalBals": 0,
    });
    const [DataUpdate, setDataUpdate] = useState({
        "userName": "",
        "email": "",
        "userRole": "",
        "TotalBals": 0,
    });

    const l = useLanguage();

    const [UFocus, setUFocus] = useState(false);
    const [EFocus, setEFocus] = useState(false);
    const [PFocus, setPFocus] = useState(false);
    const [RFocus, setRFocus] = useState(false);

    const [EValid, setEValid] = useState(false)
    const [PValid, setPValid] = useState(false)
    const [UValid, setUValid] = useState(false)
    const [RValid, setRValid] = useState(false)
    const [BValid, setBValid] = useState(false)
    const URef = useRef();
    const ERef = useRef();
    const RRef = useRef();
    const BRef = useRef();

    const handleSaveUser = (event) => {
        const savename = event.target.getAttribute('name')
        const type = event.target.getAttribute('type')
        const savevalue = event.target.value;


        if (type == "number") {
            savevalue = event.target.value.match(TotalBals_regex)?.map(Number)[0];

        }
        if (type == "name") {
            savevalue = event.target.value.match(userName_regex)?.map(String)[0];
            savevalue?.match(userName_regex) == null || savevalue.match(userName_regex)[0] != savevalue ? setUValid(false) : setUValid(true);

        }

        else if (type == "email") {

            savevalue = event.target.value.match(emai_regex)?.map(String)[0];
            savevalue?.match(emai_regex) == null || savevalue.match(emai_regex)[0] != savevalue ? setEValid(false) : setEValid(true);

        }

        else if (type == "password") {
            savevalue = event.target.value.match(password_regex)?.map(String)[0];
            savevalue?.match(password_regex) == null || savevalue.match(password_regex)[0] != savevalue ? setPValid(false) : setPValid(true);


        }
        else if (savename == "userRole" && savevalue != "Select") {
            savevalue = event.target.value.match(userRole_regex)?.map(String)[0]
            savevalue?.match(userRole_regex) == null || savevalue.match(userRole_regex)[0] != savevalue ? setRValid(false) : setRValid(true);
        }



        const newdata = { ...Data }
        newdata[savename] = savevalue;
        setData(newdata);
    }





    useEffect(() => {



        URef.current?.value?.match(userName_regex) == null || URef.current.value?.match(userName_regex)[0] != URef.current.value ? setUValid(false) : setUValid(true);


        ERef.current?.value?.match(emai_regex) == null || ERef.current.value?.match(emai_regex)[0] != ERef.current.value ? setEValid(false) : setEValid(true);


        RRef.current?.value?.match(userRole_regex) == null || RRef.current.value?.match(userRole_regex)[0] != RRef.current.value ? setRValid(false) : setRValid(true);


        BRef.current?.value?.match(TotalBals_regex) == null || BRef.current.value?.match(TotalBals_regex)[0] != BRef.current.value ? setBValid(false) : setBValid(true);



        const newdataUpdate = { ...DataUpdate }


        newdataUpdate.TotalBals = BRef.current?.value?.match(TotalBals_regex)?.map(Number)[0];

        newdataUpdate.email = ERef.current?.value.match(emai_regex)?.map(String)[0];


        newdataUpdate.userName = URef.current?.value.match(userName_regex)?.map(String)[0];

        newdataUpdate.userRole = RRef.current?.value.match(userRole_regex)?.map(String)[0];




        setDataUpdate(newdataUpdate);

    }, [BRef.current?.value, RRef.current?.value, ERef.current?.value, URef.current?.value])







    const handleUpdateUser = async () => {

        try {
            await Axios.patch(`/users/${Idofrow}`, DataUpdate)

            toast.success("User Updated Successfully")

        } catch (error) {
            error.response.status == 400 || error.response.status == 404 || error.response.status == 401 ? toast.error("User Not Updated") : toast.error("Something Went Wrong")

        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setData({
                userName: "",
                email: "",
                password: "",
                userRole: "",
                TotalBals: "",
            });

            // getUsers()
            setReNewData(true)

        }



    }

    const handledeleteUser = async () => {

        try {
            await Axios.delete(`/users/${Deletestate}`)
            toast.success("User Deleted Successfully")

        } catch (error) {
            //
        } finally {
            //
            setIdofrow(null);
            setDeletestate(null);
            setData({
                userName: "",
                email: "",
                password: "",
                userRole: "",
                TotalBals: "",
            });
            // getUsers()
            setReNewData(true)
        }



    }


    let patata = 0

    const addUsers = async () => {


        (typeof document !== "undefined") && (document.getElementById("my-modal").click())



        try {

            await Axios.post("/users/signup/", Data)

            toast.success("User added Successfully");


        } catch (error) {
            error.request.status === 409 ? toast.error("User Already Exist") :
                toast.error("User Not Added");
        } finally {

            // getUsers()
            setReNewData(true)
            setData({
                userName: "",
                email: "",
                password: "",
                userRole: "",
                TotalBals: "",
            });
        }

    }



    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await Axios.get(`/users/?search=${Search}&page=${Page}&limit=${Limit}`)

                setDataTable(res.data.userDetail)

            } catch (error) {
                if (error.response.status === 404) {
                    toast.error("No User Found");
                }


            }
        }
        getUsers()
        setReNewData(false)
    }, [Search, Limit, Page, patata, ReNewData]);



    //^   ...........................///////////////////////////////..........................................    convert Data to PDF

    const table_2_pdf = () => {

        // if (typeof window !== 'undefined') {
        const table = document.getElementById('table-to-xls')

        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))
        // //
        // }
        const doc = new jsPDF("p", "mm", "a4");

        // doc.addFileToVFS("./kurdish-normal.js", kurdish);
        // doc.addFont("kurdish-normal.ttf", "kurdish", "normal");

        // doc.setFont("kurdish"); // set font




        doc.autoTable({


            head: [[`User Name`, `Email`, "User Role", "Total Balance"]],
            body: table_td
        });

        doc.save("Table.pdf");
    };

    const table_All_pdff = () => {



        var obj = JSON.parse(JSON.stringify(DataTable))

        var res = [];
        for (var i in obj)
            res.push(obj[i]);


        const doc = new jsPDF("p", "mm", "a3");


        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({
            head: [[`User Name`, `Email`, "User Role", "Total Balance"]],
            body: res.map((d) => [d.userName, d.email, d.userRole, d.TotalBals])
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

    const { pageIndex, pageSize } = state

    return (
        <div className="  ml-1 ">



            <div className=" flex justify-between border rounded-lg container mx-auto items-center p-2  ">



                <div>


                    <label htmlFor="my-modal" className="btn modal-button flex justify-center items-center ">
                        <FontAwesomeIcon icon={faUserPlus} className="text-xl  " />
                    </label>

                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal">


                        <div className="modal-box space-y-12">

                            <div>{l.account}</div>


                            <div>
                                <input
                                    required name='userName' type="name" placeholder={l.userName}
                                    onChange={(event) => { handleSaveUser(event) }}
                                    onClick={(event) => { handleSaveUser(event) }}
                                    onFocus={() => { setUFocus(true) }}
                                    onBlur={() => { setUFocus(false) }}
                                    className="input input-bordered input-info w-full max-w-xl mt-5 dark:placeholder:text-white dark:color-white" />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!UValid && !UFocus && Data.userName != "" ? "block" : "hidden"}`}>
                                    {l.userName}{l.incorrect}
                                    <br />
                                    {l.charecter416}


                                </p>

                            </div>
                            <div>
                                <input required name='email' type="email" placeholder={l.email}
                                    onChange={(event) => { handleSaveUser(event) }}
                                    onClick={(event) => { handleSaveUser(event) }}
                                    onFocus={() => { setEFocus(true) }}
                                    onBlur={() => { setEFocus(false) }}
                                    className="input input-bordered input-info w-full max-w-xl mt-5 dark:placeholder:text-white dark:color-white" />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!EValid && !EFocus && Data.email != "" ? "block" : "hidden"}`}>
                                    {l.email}{l.incorrect}
                                    <br />
                                    {l.charecter1224}


                                </p>

                            </div>
                            <div>  <input required name='password' type="password" placeholder={l.password}
                                onChange={(event) => { handleSaveUser(event) }}
                                onClick={(event) => { handleSaveUser(event) }}
                                onFocus={() => { setPFocus(true) }}
                                onBlur={() => { setPFocus(false) }}
                                className="input input-bordered input-info w-full max-w-xl  dark:placeholder:text-white dark:color-white" />
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!PValid && !PFocus && Data.password != "" ? "block" : "hidden"}`}>
                                    {l.password}{l.incorrect}

                                    <br />
                                    {l.charecter416}


                                </p>

                            </div>
                            <div>   <select name='userRole' defaultValue={l.select}
                                onChange={(event) => { handleSaveUser(event) }}
                                onClick={(event) => { handleSaveUser(event) }}
                                onFocus={() => { setRFocus(true) }}
                                onBlur={() => { setRFocus(false) }}
                                className="select select-info w-full max-w-xl ">

                                <option disabled >{l.select}</option>
                                <option>Admin</option>
                                <option>Reseller</option>
                                <option>Qarz</option>

                            </select>
                                <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!RValid && !RFocus && Data.userRole != "" && Data.userRole != "Select" ? "block" : "hidden"}`}>
                                    {l.userRole}{l.incorrect}

                                    <br />
                                    {l.plsselectone}


                                </p>

                            </div>
                            <input name='TotalBals' type="number" placeholder={l.TotalBals}
                                onClick={(event) => { handleSaveUser(event) }}
                                onChange={(event) => { handleSaveUser(event) }}
                                className="input input-bordered input-info w-full max-w-xl  dark:placeholder:text-white dark:color-white" />

                            <div className="modal-action">
                                <div></div>
                                <label htmlFor="my-modal" className="btn btn-error"  >{l.cancel}</label>
                                <label disabled={EValid && PValid && UValid && RValid ? false : true} htmlFor="my-modal" onSubmit={(e) => { e.click() }} >
                                    <input type="submit" className={`btn btn-success disabled:text-opacity-100 `}
                                        disabled={EValid && PValid && UValid && RValid ? false : true}
                                        value={l.add}
                                        onClick={addUsers}
                                    />
                                </label>

                            </div>

                        </div>
                    </div>
                </div>


                <div className="flex justify-center items-center lg:space-x-4">
                    <input type="search" placeholder="Search ..." className="input   input-primary  w-full max-w-xs"
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/))
                        }
                    />


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left ">
                        <label tabIndex="0" className=" m-1  " >
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-90 active:rotate-180 ease-in-out  transition" />
                        </label>

                        <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 flex justify-center space-y-2 ">
                            <li>  <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="btn download-table-xls-button"
                                table="table-to-xls"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="XLSX" />  </li>
                            <li><button className='btn' onClick={table_2_pdf}>PDF</button> </li>
                            <li><button className='btn' onClick={table_All_pdff}>ALL_PDF</button> </li>
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
                                <tr key={idx}  {...row.getRowProps()} >
                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>


                                                {
                                                    cell.column.id !== "Delete" &&
                                                        cell.column.id !== "Edit" &&
                                                        row.original._id == Idofrow ?
                                                        <>
                                                            {cell.column.id == "userName" &&
                                                                <input
                                                                    ref={URef}
                                                                    defaultValue={row.original.userName}
                                                                    name={cell.column.id}
                                                                    type="text"
                                                                    placeholder={cell.column.id}
                                                                    className="input input-bordered input-warning w-full max-w-xs"

                                                                    onChange={(event) => { handleSaveUser(event) }}
                                                                    onClick={(event) => { handleSaveUser(event) }}
                                                                    onFocus={() => { setUFocus(true) }}
                                                                    onBlur={() => { setUFocus(false) }}


                                                                />}

                                                            {cell.column.id == "email" && <input
                                                                ref={ERef}

                                                                name={cell.column.id} defaultValue={row.original.email}
                                                                type="email" placeholder={cell.column.id} className="input input-bordered input-warning w-full max-w-xs"
                                                                onChange={(event) => { handleSaveUser(event) }}
                                                                onClick={(event) => { handleSaveUser(event) }}
                                                                onFocus={() => { setEFocus(true) }}
                                                                onBlur={() => { setEFocus(false) }}


                                                            />}


                                                            {cell.column.id == "userRole" &&
                                                                <select
                                                                    ref={RRef}

                                                                    onChange={(event) => { handleSaveUser(event) }}
                                                                    onClick={(event) => { handleSaveUser(event) }}
                                                                    onFocus={() => { setRFocus(true) }}
                                                                    onBlur={() => { setRFocus(false) }}

                                                                    name={cell.column.id} defaultValue={row.original.userRole} placeholder={cell.column.id} className="select select-warning w-full max-w-xs">
                                                                    <option>Reseller</option>
                                                                    <option>Qarz</option>
                                                                </select>}
                                                            {cell.column.id == "TotalBals" && <input
                                                                ref={BRef}
                                                                onChange={(event) => { handleSaveUser(event) }}
                                                                onClick={(event) => { handleSaveUser(event) }}


                                                                name={cell.column.id} defaultValue={row.original.TotalBals} type="text" placeholder={cell.column.id} className="input input-bordered input-warning w-full max-w-xs"
                                                            />}



                                                        </>

                                                        :
                                                        cell.render('Cell')

                                                }



                                                {row.original._id !== Idofrow ?
                                                    cell.column.id === "Edit" &&

                                                    <label onClick={() => { setIdofrow(row.original._id) }} aria-label="upload picture" ><FontAwesomeIcon icon={faEdit} className="text-2xl text-blue-500" /></label>

                                                    :
                                                    <div className=" space-x-3">
                                                        {cell.column.id === "Edit" && <button disabled={EValid && RValid && BValid && UValid ? false : true} type='submit' onClick={handleUpdateUser} className="btn btn-accent"> <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                        {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                    </div>


                                                }
                                                {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate(row.original._id) }}><FontAwesomeIcon icon={faTrash} className="text-2xl text-red-700" /></label>}


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
                                {/* {setPage(pageIndex + 1)} */}
                            </span>
                        </div>

                        <div>
                            <select className="select select-primary  w-full max-w-xs" onChange={(e) => {
                                setLimit(Number(e.target.value) * 2)
                                setPageSize(Number(e.target.value))
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
                        <label htmlFor="my-modal-3" className="btn btn-error " onClick={handledeleteUser}>{l.yes}</label>
                        <label htmlFor="my-modal-3" className="btn btn-accent " onClick={() => { setDeletestate(null) }} >{l.no}</label>
                    </div>
                </div>
            </div>

        </div >

    );


}


const Accounts = (props) => {



    const COLUMNS =
        useMemo(() =>
            [
                {
                    Header: () => {
                        return (

                            l.userName
                        )
                    },

                    disableFilters: true,

                    accessor: 'userName',


                },
                {
                    Header: () => {
                        return (

                            l.email
                        )
                    },

                    disableFilters: true,

                    accessor: 'email',


                },



                {
                    Header: () => {
                        return (

                            l.userRole
                        )
                    },

                    accessor: 'userRole',
                    disableFilters: true,


                },
                {
                    Header: () => {

                        return l.TotalBals;
                    },

                    accessor: 'TotalBals',
                    disableFilters: true,


                },


                {
                    Header: "Edit",
                    disableFilters: true,



                },
                {
                    Header: "Delete",

                    disableFilters: true,



                }





            ], [props]
        )



    const l = useLanguage();

    return (


        <>
            <Head>
                <title >{l.account}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Table COLUMNS={COLUMNS} />
            <ToastContainer
                draggablePercent={60}
            />


        </ >
    );
}




import AdminLayout from '../../../Layouts/AdminLayout';
Accounts.Layout = AdminLayout;





export default Accounts;






