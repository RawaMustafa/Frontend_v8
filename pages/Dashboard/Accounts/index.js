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
import { faUserPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faUsers, faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import { getSession, useSession } from "next-auth/react";


export async function getServerSideProps({ req, query }) {
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
    //     const res = Axios.get(`/users/?search=&page=1&limit=10`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': `Bearer ${session?.Token}`
    //         },
    //     })
    //     data = await res.data.total


    // } catch (err) {
    //     data = ""


    // }

    return {
        props: {
            SessionID: session?.id || null,
            AllUsers: data,
        }
    }
}


// import kurdish from "../../../Component/fonts/kurdish-normal";



const emai_regex = /^[\w-\.]{4,20}@([a-z]{2,6}\.)+[a-z]{2,4}$/;
const password_regex = /^[a-zA-Z0-9\.\-\_]{4,16}$/;
const userName_regex = /^[a-zA-Z0-9]{4,12}$/;
const userRole_regex = /^[a-zA-Z0-9\.\-\_]{4,16}$/;
const TotalBals_regex = /^[0-9]{0,12}$/;


const Table = ({ COLUMNS, AllUsers, SessionID }) => {

    const [ReNewData, setReNewData] = useState(false);

    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [PageUser, setPageUser] = useState(1);
    const [PageUpdate, setPageUpdate] = useState(1);
    const [Limit, setLimit] = useState(10);

    const [PageS, setPageS] = useState(Math.ceil(AllUsers / Limit));
    const [TotalUsers, setTotalUsers] = useState(AllUsers);



    const [DataTable, setDataTable] = useState([]);
    const [DataAdmin, setDataAdmin] = useState(null);
    const [Idofrow, setIdofrow] = useState(null);
    const [Deletestate, setDeletestate] = useState(null);
    const [Data, setData] = useState({
        userName: "",
        email: "",
        password: "",
        userRole: "",
        TotalBals: 0,
    });
    const [DataUpdateAdmin, setDataUpdateAdmin] = useState({
        userName: "",
        email: "",
        password: "",
        TotalBals: 0,
    });
    const [DataUpdate, setDataUpdate] = useState({
        userName: "",
        email: "",
        userRole: "",
        TotalBals: 0,
    });

    const session = useSession()



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


    const [UUFocus, setUUFocus] = useState(false);
    const [UEFocus, setUEFocus] = useState(false);
    const [UPFocus, setUPFocus] = useState(false);
    const [UCPFocus, setUCPFocus] = useState(false);
    const [UBFocus, setUBFocus] = useState(false);
    const [UEValid, setUEValid] = useState(false)
    const [UPValid, setUPValid] = useState(false)
    const [UCPValid, setUCPValid] = useState(false)
    const [UUValid, setUUValid] = useState(false)
    const [UBValid, setUBValid] = useState(false)
    const UURef = useRef(null);
    const UERef = useRef(null);
    const UPRef = useRef(null);
    const UCPRef = useRef(null);
    const UBRef = useRef(null);

    const handleSaveUpdateUser = (event) => {
        const savename = event.target.getAttribute('name')
        const type = event.target.getAttribute('type')
        const savevalue = event.target.value;



        if (savename == "userName") {
            savevalue = event.target.value.match(userName_regex)?.map(String)[0];
            savevalue?.match(userName_regex) == null || savevalue.match(userName_regex)[0] != savevalue ? setUUValid(false) : setUUValid(true);

        }

        else if (savename == "email") {

            savevalue = event.target.value.match(emai_regex)?.map(String)[0];
            savevalue?.match(emai_regex) == null || savevalue.match(emai_regex)[0] != savevalue ? setUEValid(false) : setUEValid(true);

        }

        else if (savename == "password") {
            savevalue = event.target.value.match(password_regex)?.map(String)[0];
            savevalue?.match(password_regex) == null || savevalue.match(password_regex)[0] != savevalue ? setUPValid(false) : setUPValid(true);
        }
        else if (savename == "TotalBals") {
            savevalue = event.target.value.match(TotalBals_regex)?.[0];
            savevalue?.match(TotalBals_regex) == null || savevalue.match(TotalBals_regex)[0] != savevalue ? setUBValid(false) : setUBValid(true);

        }





        const newdata = { ...DataUpdateAdmin }
        newdata[savename] = savevalue;
        setDataUpdateAdmin(newdata);

    }


    useEffect(() => {
        if (DataUpdateAdmin.password == UCPRef.current?.value && DataUpdateAdmin.password?.match(password_regex)?.[0] != "undefined") {
            setUCPValid(true)
        } else {
            setUCPValid(false)
        }

    }, [UCPRef.current?.value, UPRef.current?.value])


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



        if (Idofrow?.[3] == "Reseller" && DataUpdate.userRole !== "Reseller") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)





            const DataBalance = UDetails.data.userDetail.TotalBals


            try {
                await Axios.patch('/users/' + SessionID, { "TotalBals": Math.floor(DataBalance) + Math.floor(Idofrow?.[1]) }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                toast.success("Your Balance Now= " + (Math.floor(DataBalance) + Math.floor(Idofrow?.[1])) + " $");


                await Axios.post("/bal/",
                    {
                        amount: Math.floor(Idofrow?.[1]),
                        action: "Update",
                        userId: Idofrow?.[0]
                    }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)




                try {
                    await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        },
                    })

                    toast.success("User Updated Successfully")

                } catch (error) {
                    toast.error("Something Went Wrong *")

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








            } catch {
                toast.error(" error to update user * ")
            }
        }


        else if (Idofrow?.[3] == "Reseller" && DataUpdate.userRole == "Reseller") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)


            const DataBalance = UDetails.data.userDetail.TotalBals

            const donebalnace = Math.floor(DataUpdate.TotalBals) - Math.floor(Idofrow?.[1])

            if (donebalnace <= DataBalance) {

                try {
                    await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - donebalnace }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    toast.success("Your Balance Now= " + (DataBalance - donebalnace) + " $");




                    await Axios.post("/bal/",
                        {
                            amount: -donebalnace,
                            action: "Update",
                            userId: Idofrow?.[0]
                        }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    try {
                        await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            },
                        })

                        toast.success("User Updated Successfully")

                    } catch (error) {
                        toast.error("Something Went Wrong *")

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

                } catch {
                    toast.error(" error to update user * ")
                }




            }




        }



        else if (Idofrow?.[3] !== "Reseller" && DataUpdate.userRole == "Reseller") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)


            const DataBalance = UDetails.data.userDetail.TotalBals


            if (DataUpdate.TotalBals <= DataBalance) {

                try {
                    await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - DataUpdate.TotalBals }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    toast.success("Your Balance Now= " + (DataBalance - DataUpdate.TotalBals) + " $");


                    await Axios.post("/bal/",
                        {
                            amount: -DataUpdate.TotalBals,
                            action: "updated to " + Idofrow?.[2]
                        }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    try {
                        await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            },
                        })

                        toast.success("User Updated Successfully")

                    } catch (error) {
                        toast.error("Something Went Wrong *")

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

                } catch {
                    toast.error(" error to update user * ")
                }




            }




        }


        else if (Idofrow?.[3] !== "Reseller" && DataUpdate.userRole !== "Reseller") {

            try {
                await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    },
                })

                toast.success("User Updated Successfully")

            } catch (error) {
                toast.error("Something Went Wrong *")

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


    }

    const handledeleteUser = async () => {


        if (Deletestate?.[3] == "Reseller") {
            //FIXME - change Email to Id

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)


            const DataBalance = UDetails.data.userDetail.TotalBals

            // let donebalance = Math.floor(DataUpdate.cost) - Math.floor(Idofrow?.[1])


            try {
                await Axios.delete(`/users/${Deletestate?.[0]}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    },
                })
                toast.success("User Deleted Successfully")


                await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance + Deletestate?.[1] }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                toast.success("Your Balance Now= " + (DataBalance + Deletestate?.[1]) + " $");


                await Axios.post("/bal/",
                    {
                        amount: Math.floor(Deletestate?.[1]),
                        action: "Tooken",
                    }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

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



        if (Deletestate?.[3] != "Reseller") {


            try {
                await Axios.delete(`/users/${Deletestate?.[0]}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    },
                })
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


    }


    let changeNumber = 0

    const addUsers = async () => {


        (typeof document !== "undefined") && (document.getElementById("my-modal").click())



        if (Data.userRole == "Reseller") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)


            const DataBalance = UDetails.data.userDetail.TotalBals

            // let donebalance = Math.floor(DataUpdate.cost) - Math.floor(Idofrow?.[1])

            if (Data.TotalBals <= DataBalance) {


                try {



                    await Axios.post("/users/signup/", Data, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        },
                    })



                    await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - Data.TotalBals }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    toast.success("Your Balance Now= " + (DataBalance - Data.TotalBals) + " $");


                    await Axios.post("/bal/",
                        {
                            amount: -Data.TotalBals,
                            action: "Gived",
                            // userId: Data.email
                        }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)






                    toast.success("User added Successfully");


                } catch (error) {
                    error.request.status === 409 ? toast.error("User Already Exist") :
                        toast.error("User Not Added *");
                }

                setReNewData(true)


            }
            else {
                toast.error("Not Enough Balance")
            }

        }

        else if (Data.userRole != "Reseller") {

            try {

                await Axios.post("/users/signup/", Data, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    },
                })

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

    }



    useEffect(() => {
        const getUsers = async () => {
            try {

                const Auth = {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                }

                const one = `/users/?search=${Search}&page=${Page}&limit=${Limit}`
                const two = `/users/detail/${session?.data?.id}`


                const requestOne = Axios.get(one, Auth).then((res) => {
                    return res
                }).catch(() => {

                })

                const requestTwo = Axios.get(two, Auth).then((res) => {
                    return res
                }).catch(() => {

                })

                await axios.all([requestOne, requestTwo,]).

                    then(
                        axios.spread((...responses) => {


                            const dataFertch = responses?.[0]?.data?.userDetail;
                            const dataFertchTotal = responses?.[0]?.data?.total;

                            const dataFertchownCost = responses?.[1]?.data?.userDetail;


                            setDataTable(dataFertch || [])
                            setTotalUsers(dataFertchTotal)
                            setDataAdmin(dataFertchownCost)

                        })).catch((err) => {
                            //
                            if (err.response.status == 404) {
                                toast.error("Not Found")


                            }


                            if (err.response.status == 401) {
                                toast.error("Unauthorized")
                            }


                        })


            } catch {
                //



            }

        }
        setPageS(Math.ceil(TotalUsers / Limit))
        getUsers()
        setReNewData(false)

        console.clear("patata")

    }, [Search, Limit, Page, changeNumber, ReNewData, session?.data?.Token]);


    const handleUpdateUserAdmin = async () => {

        try {
            await Axios.patch(`/users/${session?.data?.id}`, {
                password: DataUpdateAdmin.password,
                email: DataUpdateAdmin.email,
                userName: DataUpdateAdmin.userName,
                TotalBals: DataUpdateAdmin.TotalBals
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                },
            })
            toast.success("Admin Updated Successfully")

            await Axios.post("/bal/",
                {
                    amount: DataUpdateAdmin.TotalBals,
                    action: "Reseated",
                    userId: session?.data?.id

                }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)


            signOut({ callbackUrl: '/Login', redirect: true });

        } catch (error) {
            toast.error("Something Went Wrong *")

        } finally {

            setIdofrow(null);
            setDeletestate(null);
            setDataUpdateAdmin({
                userName: "",
                email: "",
                password: "",
                TotalBals: "",
            });
            setReNewData(true)
        }



    }


    const table_2_pdf = () => {


        const table = document.getElementById('table-to-xls')

        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        const doc = new jsPDF("p", "mm", "a4");


        doc.autoTable({


            head: [[`User Name`, `Email`, "User Role", "Total Balance"]],
            body: table_td
        });

        doc.save("Table.pdf");
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

        <div >
            <div className="mb-32 flex justify-end    ">

                <div onClick={() => {
                    PageUser == 1 && setPageUser(2)
                    PageUser == 2 && setPageUser(1)
                }}
                    className="p-5 scale-75 lg:scale-100 cursor-pointer  justify-self-end border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg  w-64   z-30  ">
                    <div className="flex items-center  justify-around   ">

                        <div>
                            {PageUser == 1 && <div className="">{l.user}</div>}
                            {PageUser == 2 && <div className="">{DataAdmin?.userName}</div>}
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                {PageUser == 2 && <FontAwesomeIcon icon={faUser} className="text-2xl" />}
                                {PageUser == 1 && <FontAwesomeIcon icon={faUsers} className="text-2xl" />}

                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <div className=" container mx-auto overflow-x-auto  scrollbar-hide">
                {PageUser == 1 && <div >



                    <div className=" flex justify-between   rounded-lg container mx-auto items-center p-2 min-w-[700px] ">



                        <div className="flex  gap-10">
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
                            <input type="search" placeholder={`${l.search} ...`} className="input   input-info  w-full max-w-xs focus:outline-0"
                                onChange={e =>
                                    setSearch(e.target.value.match(/^[a-zA-Z0-9]*/))
                                }
                            />
                        </div>


                        <div className="flex justify-center items-center ">



                            <div className="dropdown rtl:dropdown-right ltr:dropdown-left mx-10">
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
                                    <li><button className='btn btn-outline' onClick={table_2_pdf}>PDF</button> </li>
                                    {/* <li><button className='btn' onClick={table_All_pdff}>ALL_PDF</button> </li> */}
                                </ul>
                            </div>


                        </div>

                    </div>




                    {/* <div className="xl:flex justify-center overflow-auto  py-2    "> */}




                    <table id="table-to-xls" className=" my-10 inline-block  min-w-[1000px]  " {...getTableProps()}>
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
                                                            row.original._id == Idofrow?.[0] ?
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



                                                    {row.original._id !== Idofrow?.[0] ?
                                                        cell.column.id === "Edit" &&

                                                        <label onClick={() => {
                                                            setIdofrow([row.original._id, row.original.TotalBals, row.original.userName, row.original.userRole])
                                                            setDataUpdate(""), setEValid(false), setUValid(false), setBValid(false)
                                                        }} aria-label="upload picture" ><FontAwesomeIcon icon={faEdit} className="text-2xl text-blue-500" /></label>

                                                        :
                                                        <div className=" space-x-3">
                                                            {cell.column.id === "Edit" && <button disabled={EValid && RValid && BValid && UValid ? false : true} type='submit' onClick={handleUpdateUser} className="btn btn-accent"> <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                            {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null), setDataUpdate(null), setEValid(false), setUValid(false), setBValid(false) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                        </div>


                                                    }
                                                    {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0" onClick={() => { setDeletestate([row.original._id, row.original.TotalBals, row.original.userName, row.original.userRole]) }}><FontAwesomeIcon icon={faTrash} className="text-2xl text-red-700" /></label>}


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

                        <div className=" flex justify-between container mx-auto items-center  rounded-xl p-3  px-1 mb-20 min-w-[700px] ">



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

                </div >}
                {PageUser == 2 &&
                    <div className=" ">





                        <div className="mb-5 rounded m-2   ">

                            <div className="flex justify-end    ">
                                {PageUpdate == 1 && <button className="btn btn-warning   text-md" onClick={() => {
                                    setPageUpdate(2)
                                }} >{l.update}</button>}
                                {PageUpdate == 2 && <button className="btn btn-info   text-md" onClick={() => {
                                    setPageUpdate(1)
                                }} >{l.info}</button>}

                            </div>
                            <div className='py-20 lg:px-5 space-y-5'>
                                <div>
                                    <label htmlFor="userName" className="p-2 text-lg">{l.userName}</label>
                                    <div id="userName" name="userName" className="bg-slate-300  p-1 rounded text-black text-md">
                                        {PageUpdate == 1 && <h1 className="p-3"> {DataAdmin?.userName}</h1>}
                                        {PageUpdate == 2 && <div className="form-control w-full max-w-full dark:text-white">

                                            <input
                                                defaultValue={DataAdmin?.userName}

                                                required name='userName' type="name" placeholder={l.userName}
                                                onChange={(event) => { handleSaveUpdateUser(event) }}
                                                onClick={(event) => { handleSaveUpdateUser(event) }}
                                                onFocus={() => { setUUFocus(true) }}
                                                onBlur={() => { setUUFocus(false) }}
                                                ref={UURef}

                                                className="input input-bordered input-info w-full   dark:placeholder:text-white dark:color-white" />
                                            <p id="userName-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!UUValid && UUFocus && UURef.current?.value != "" ? "block" : "hidden"}`}>
                                                {l.userName}{l.incorrect}
                                                <br />
                                                {l.charecter416}

                                            </p>

                                        </div>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="p-2 text-lg">{l.email}</label>
                                    <div id="email" className="bg-slate-300 p-1 rounded text-black text-md">
                                        {PageUpdate == 1 && <h1 className="p-3"> {DataAdmin?.email}</h1>}
                                        {PageUpdate == 2 &&
                                            <div className="form-control w-full max-w-full dark:text-white">

                                                <input
                                                    defaultValue={DataAdmin?.email}

                                                    required name='email' type="email" placeholder={l.email}
                                                    onChange={(event) => { handleSaveUpdateUser(event) }}
                                                    onClick={(event) => { handleSaveUpdateUser(event) }}
                                                    onFocus={() => { setUEFocus(true) }}
                                                    onBlur={() => { setUEFocus(false) }}
                                                    ref={UERef}

                                                    className="input input-bordered input-info w-full   dark:placeholder:text-white dark:color-white" />
                                                <p id="email-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!UEValid && UEFocus && UERef.current?.value != "" ? "block" : "hidden"}`}>
                                                    {l.email}{l.incorrect}
                                                    <br />
                                                    {l.charecter416}


                                                </p>

                                            </div>}

                                    </div>
                                </div>
                                {PageUpdate == 2 && <div>
                                    <label htmlFor="password" className="p-2 text-lg">{l.password}</label>
                                    <div id="password" className="bg-slate-300 p-1 rounded text-black text-md">

                                        <div className="form-control w-full max-w-full dark:text-white">

                                            <input
                                                required name='password' type="text" placeholder={l.password}
                                                onChange={(event) => { handleSaveUpdateUser(event) }}
                                                onClick={(event) => { handleSaveUpdateUser(event) }}
                                                onFocus={() => { setUPFocus(true) }}
                                                onBlur={() => { setUPFocus(false) }}
                                                ref={UPRef}

                                                className="input input-bordered input-info w-full   dark:placeholder:text-white dark:color-white" />
                                            <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!UPValid && UPFocus && UPRef.current?.value != "" ? "block" : "hidden"}`}>
                                                {l.password} {l.incorrect}
                                                <br />
                                                {l.charecter416}


                                            </p>

                                        </div>

                                    </div>
                                </div>}
                                {PageUpdate == 2 && <div>
                                    <label htmlFor="cpassword" className="p-2 text-lg">{l.cpassword}</label>
                                    <div id="cpassword" className="bg-slate-300 p-1 rounded text-black text-md">
                                        <div className="form-control w-full max-w-full dark:text-white">

                                            <input
                                                ref={UCPRef}
                                                required name='cpassword' type="text" placeholder={l.cpassword}
                                                onFocus={() => { setUCPFocus(true) }}
                                                onBlur={() => { setUCPFocus(false) }}
                                                onChange={(event) => { handleSaveUpdateUser(event) }}
                                                onClick={(event) => { handleSaveUpdateUser(event) }}
                                                className="input input-bordered input-info w-full    dark:placeholder:text-white dark:color-white" />
                                            <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!UCPValid && UCPFocus && UCPRef.current?.value != "" ? "block" : "hidden"}`}>
                                                {l.cpassword} {l.incorrect}
                                                <br />
                                                {l.charecter416}


                                            </p>

                                        </div>

                                    </div>
                                </div>}
                                <div>
                                    <label htmlFor="balance" className="p-2 text-lg">{l.balance}</label>
                                    <div id="balance" className="bg-slate-300 p-1 rounded text-black text-md">
                                        {PageUpdate == 1 && <h1 className="p-3"> ${DataAdmin?.TotalBals}</h1>}
                                        {PageUpdate == 2 && <div className="form-control w-full max-w-full dark:text-white">

                                            <input
                                                defaultValue={DataAdmin?.TotalBals}
                                                required name='TotalBals' type="number" placeholder={l.balance}
                                                onChange={(event) => { handleSaveUpdateUser(event) }}
                                                onClick={(event) => { handleSaveUpdateUser(event) }}
                                                onFocus={() => { setUBFocus(true) }}
                                                onBlur={() => { setUBFocus(false) }}
                                                ref={UBRef}
                                                className="input input-bordered input-info w-full   dark:placeholder:text-white dark:color-white" />
                                            <p id="balance-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${!UBValid && UBFocus && UBRef.current?.value != "" ? "block" : "hidden"}`}>
                                                {l.balance} {l.incorrect}
                                                <br />



                                            </p>

                                        </div>}
                                    </div>
                                </div>

                                <div className="flex justify-center   pt-10">
                                    {PageUpdate == 2 &&
                                        <label htmlFor="my-modal"
                                            className={"btn btn-success sm:btn-wide text-md "}
                                            disabled={
                                                (UUValid && UEValid && UPValid && UCPValid && UBValid) ? false : true
                                            }>
                                            {l.update}
                                        </label>
                                    }
                                </div>

                            </div>
                        </div>



                    </div>

                }
            </div>


            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <div className="font-bold ">
                        <FontAwesomeIcon className="text-5xl flex justify-center w-full" icon={faWrench} />
                    </div>
                    <hr className='mt-10' />
                    <p className="pt-10 text-lg">{l.msgupdatei}</p>
                    <p className="pb-4 text-lg">{l.msgupdates}</p>
                    <div className="modal-action pt-10">
                        <label htmlFor="my-modal" className="btn bt">{l.cancel}</label>
                        <label htmlFor="my-modal"
                            className={"btn btn-success  text-md "}
                            onClick={handleUpdateUserAdmin}

                            disabled={
                                (UUValid && UEValid && UPValid && UCPValid && UBValid) ? false : true
                            } >
                            {l.update}
                        </label>

                    </div>
                </div>
            </div>
        </div >

    );


}


const Accounts = ({ AllUsers, SessionID }) => {

    const router = useRouter()
    const session = useSession();
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





            ], [AllUsers, router.locale]
        )



    const l = useLanguage();


    if (session.status === "loading") {
        return (
            <>
                <Head>
                    <title >{l.account}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <div className="w-100 h-100 text-center">
                    {l.loading}
                </div>
            </>
        )
    }

    if (session.status === "unauthenticated") {
        return router.push("/")
    }

    if (session.status === "authenticated") {
        return (


            <>
                <Head>
                    <title >{l.account}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>

                <Table COLUMNS={COLUMNS} AllUsers={AllUsers} SessionID={SessionID} />
                <ToastContainer
                    draggablePercent={60}
                />


            </ >
        );
    }
}




import AdminLayout from '../../../Layouts/AdminLayout';
import { useRouter } from 'next/router';
Accounts.Layout = AdminLayout;





export default Accounts;






