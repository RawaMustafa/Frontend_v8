import useLanguage from '../../Component/language';
import QarzLayout from '../../Layouts/QarzLayout';
import { useEffect, useMemo, useState, } from 'react';
import Head from 'next/head'

import Axios, { baseURL } from '../api/Axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faEye, faCalendarCheck, faFileDownload, } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, useGlobalFilter, usePagination, useFilters, useGroupBy, useExpanded, } from 'react-table';
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";





export async function getServerSideProps({ req, query }) {
    const session = await getSession({ req })
    if (!session || session.userRole != "Qarz") {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        }

    }


    let data
    try {
        const res = await Axios.get(`/qarz/${session.id}/?&page=1&limit=1`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.Token}`
            }
        },)
        data = await res.data.qarzList.map((e) => { return e.id }).length


    } catch {
        data = 1
    }

    console.log(data)

    return {
        props: {
            initQuery: session.id,
            AllQarz: data,

        }
    }



}





const Qarz = ({ initQuery, AllQarz }) => {


    const { status } = useSession()

    const l = useLanguage();
    const router = useRouter()



    if (status == "unauthenticated") {
        router.push('/');
    }


    if (status == "loading") {

        return (<>
            <Head>
                <title >{l.listofloan}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>
            <div className="text-center">
                {l.loading}
            </div>
        </>)
    }

    const COLUMNS =
        // useMemo(() =>
        [

            {
                Header: () => {
                    return (

                        l.amount
                    )
                },

                disableFilters: true,

                accessor: 'qarAmount',


            },

            {
                Header: () => {
                    return (

                        l.ispaid
                    )
                },

                accessor: 'isPaid',
                disableFilters: true,


            },
            {
                Header: () => {

                    return l.date;
                },

                accessor: 'dates',
                disableFilters: false,


            },





        ]
    // )

    if (status == "authenticated") {

        return (

            <div className="container mx-auto  footer-center  pt-10">

                <Head>
                    <title >{l.listofloan}</title>
                </Head>

                <TableQarz COLUMNS={COLUMNS} ID={initQuery} AllQarz={AllQarz} />


            </div >
        );

    }

}

Qarz.Layout = QarzLayout;
export default Qarz;





const TableQarz = ({ COLUMNS, ID,AllQarz }) => {

    const session = useSession();
    const router = useRouter();

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [StartDate, setStartDate] = useState("2000-10-10");
    const [EndDate, setEndDate] = useState("3000-10-10");


    const [DataTable, setDataTable] = useState([]);

    const l = useLanguage();

    const [ReNewData, setReNewData] = useState(false);




    useEffect(() => {

        if (session.status === 'authenticated') {

            const getQarzData = async () => {
                // ${StartDate}/${EndDate}?search=${Search}&page=${Page}&limit=${Limit}
                const res = await Axios.get(`/qarz/amount/${ID}?${StartDate}/${EndDate}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)


                setDataTable(res.data.qarzList)
            }
            getQarzData()
            setReNewData(false)
        }

    }, [Search, Page, Limit, StartDate, EndDate, ID, ReNewData, session.status])







    //^       convert Data to PDF

    const table_2_pdf = () => {

        const table = document.getElementById('table-to-xls')
        // const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        // }
        const doc = new jsPDF("p", "mm", "a3");
        doc.text(`Data{Hawbir}`, 95, 10);

        doc.autoTable({

            head: [[`Amount`, " pay for", "Date"]],
            body: table_td
        });


        doc.save("Table.pdf");
    };





    const {



        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
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
        // defaultColumn: {Filter: DefaultColumnFilter },

    }, useGlobalFilter, useFilters, useGroupBy, useSortBy, useExpanded, usePagination,

    );

    const { globalFilter } = state;
    const { pageIndex, pageSize } = state


    return (
        <>
            <div className=" flex justify-end     p-2   ">

                <div className='flex z-[500]   '>

                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left mx-5 lg:mx-5  ">

                        <label tabIndex="0" className=" m-1   ">
                            <FontAwesomeIcon icon={faCalendarCheck} tabIndex="0" className="text-3xl  m-auto md:mx-5 active:scale-90   ease-in-out" />
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


                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left mx-2 lg:mx-10">
                        <label tabIndex="0" className=" m-1  " >
                            <FontAwesomeIcon icon={faFileDownload} className="text-3xl m-auto md:mx-5 mx-1 active:scale-90   ease-in-out  " />
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


            <div className="  container mx-auto overflow-auto">


                <table id="table-to-xls" className=" my-10  inline-block min-w-[1000px]  " {...getTableProps()}>


                    <thead className="  ">

                        {headerGroups.map((headerGroups, idx) => (

                            <tr className="" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>

                                {headerGroups.headers.map((column, idx) => (

                                    <th key={idx} className="p-4 m-44      w-[380px]  " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

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
                                <tr key={idx}  {...row.getRowProps()} >
                                    {row.cells.map((cell, idx) => {
                                        return (


                                            <td key={idx} className="  text-center   py-3" {...cell.getCellProps()}>


                                                {cell.column.id === 'isPaid' && (

                                                    cell.value === true ? <div className="text-green-500" >Yes</div> : <div className="text-red-500" >No</div>
                                                )}


                                                {

                                                    cell.render('Cell')

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

                <div className="botom_Of_Table" >

                    <div className=" flex justify-between container mx-auto items-center    px-1 mb-20  min-w-[700px] ">



                        <div className=" flex  space-x-5 mx-5 text-lg items-center     ">

                            <div>

                                {l.page}
                                <span>
                                    {""}{pageIndex + 1}/{pageOptions.length}{""}
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



            </div >
        </>
    );


}




