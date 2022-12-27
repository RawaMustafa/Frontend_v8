import useLanguage from '../../../../../Component/language';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Axios, { baseURL } from '../../../../api/Axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import { useEffect, useState } from 'react';
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




const TableBal = ({ COLUMNS, AllBal }) => {
    const session = useSession()
    const [ReNewData, setReNewData] = useState(false);
    const router = useRouter()

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);
    const [StartDate, setStartDate] = useState("2000-01-01");
    const [EndDate, setEndDate] = useState("2500-01-01");
    const [PageS, setPageS] = useState(Math.ceil(AllBal / Limit));
    const [DataTable, setDataTable] = useState([]);


    const l = useLanguage();




    useEffect(() => {

        if (session.status === "authenticated") {
            const getQarzData = async () => {
                try {
                    const res = await Axios.get(`/bal/${router.query._id}/?search=${Search}&page=${Page}&limit=${Limit}&sdate=${StartDate || '2000-01-01'}&edate${EndDate || "2500-01-01"}`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)



                    setDataTable(res.data.History)
                    setPageS(Math.ceil(res.data.total / Limit))
                } catch (e) {

                    setDataTable([])
                }
            }
            getQarzData()
            setReNewData(false)
        }
    }, [Search, Page, Limit, StartDate, EndDate, ReNewData, session.status])







    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{ Hawbir }`, 95, 10);

        doc.autoTable({


            head: [["", `Amount`, " User Id", "Action", "Note", "Date"]],
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
        <div className=" ">
            {/* //?   Header  */}
            <div className=" flex justify-between items-center bg-white dark:bg-[#181A1B] rounded-t-xl shadow-xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

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
            {/* //?   Header  */}


            <div className="overflow-auto bg-white  dark:bg-[#181A1B] rounded-b-xl shadow-xl  ">

                <table id="table-to-xls" className="table w-full my-10 text-sm text-center font-normal  " {...getTableProps()}>
                    <thead className="  ">
                        {headerGroups.map((headerGroups, idx) => (
                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                <th className='hidden'></th>
                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className="bg-[#3ea7e1]  text-white  min-w-[120px] normal-case py-3 " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

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
                                    <td className='hidden'></td>

                                    {row.cells.map((cell, idx) => {
                                        return (

                                            <td key={idx} className="dark:bg-[#181a1b]  text-center   py-3 overflow-auto" {...cell.getCellProps()}>



                                                {cell.column.id === 'amount' && (
                                                    <>
                                                        {cell.value * -1 >= 0 ? <div className="text-green-700">{cell.value * -1}</div> : <div className="text-red-700">{cell.value * -1}</div>
                                                        } </>
                                                )}

                                                {cell.column.id === 'isPaid' && (
                                                    <>


                                                        {cell.value == true ?
                                                            <div className="text-green-700">Yes</div> : cell.value == false ? <div className="text-red-700">No</div> : null}




                                                    </>

                                                )}

                                                {cell.column.id === 'carId' && (
                                                    <>

                                                        <Link href={`/Dashboard/Balance/ListofOwe/${router.query._id}`}><a className="text-orange-700">{cell.value?.modeName || cell.value?.VINNumber || cell.value?.id}</a></Link>
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

                {/* //?    botom */}
                <div className="container text-sm  scale-90  ">

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

export default TableBal;