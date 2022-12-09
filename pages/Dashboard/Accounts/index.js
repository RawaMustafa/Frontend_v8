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
import { faUserPlus, faTrash, faEdit, faSave, faBan, faFileDownload, faUsers, faUser, faWrench, faAnglesLeft, faChevronLeft, faChevronRight, faAnglesRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';
import { getSession, useSession } from "next-auth/react";
import { faFilePdf as PDF, faCalendarCheck as CALLENDER } from '@fortawesome/free-regular-svg-icons';


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


    return {
        props: {
            SessionID: session?.id || null,
            AllUsers: data,
        }
    }
}




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
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            },
        }


        if (Idofrow?.[3] == "Reseller" && DataUpdate.userRole == "Qarz") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth)

            const DataBalance = UDetails.data.userDetail.TotalBals

            try {

                const res1 = await Axios.patch('/users/' + SessionID, { "TotalBals": Math.floor(DataBalance) + Math.floor(Idofrow?.[1]) + DataUpdate.TotalBals }, auth)
                const res2 = await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, auth)
                const res3 = await Axios.post("/bal/", {
                    amount: Math.floor(Idofrow?.[1]) + DataUpdate.TotalBals,
                    action: "Updated",
                    userId: Idofrow?.[0]
                }, auth)

                await axios.all([res1, res2, res3]).then(axios.spread((...responses) => {

                    toast.success("User Updated Successfully")
                    toast.success("Your Balance Now= " + (Math.floor(DataBalance) + Math.floor(Idofrow?.[1] + DataUpdate.TotalBals)) + " $");
                    setReNewData(true)

                })).catch(() => {
                    toast.error("Something Went Wrong *")
                })

            } catch {
                toast.error(" error to update user * ")
            }
        }

        if (Idofrow?.[3] == "Qarz" && DataUpdate.userRole == "Reseller") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth)

            const DataBalance = UDetails.data.userDetail.TotalBals

            if (DataBalance >= (Idofrow?.[1] + DataUpdate.TotalBals)) {
                try {

                    const res1 = await Axios.patch('/users/' + SessionID, { "TotalBals": Math.floor(DataBalance) - Math.floor(Idofrow?.[1]) - DataUpdate.TotalBals }, auth)
                    const res2 = await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, auth)
                    const res3 = await Axios.post("/bal/", {
                        amount: - Math.floor(Idofrow?.[1]) - DataUpdate.TotalBals,
                        action: "Update",
                        userId: Idofrow?.[0]
                    }, auth)

                    await axios.all([res1, res2, res3]).then(axios.spread((...responses) => {

                        toast.success("User Updated Successfully")
                        toast.success("Your Balance Now= " + (Math.floor(DataBalance) - Math.floor(Idofrow?.[1]) - DataUpdate.TotalBals) + " $");

                    })).catch(() => {
                        toast.error("Something Went Wrong *")
                    })

                } catch {
                    toast.error(" error to update user * ")
                }
            }
            else {
                toast.error("You Dont Have Enough Balance *")
            }
        }

        else if (Idofrow?.[3] == "Reseller" && DataUpdate.userRole == "Reseller") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth)

            const DataBalance = UDetails.data.userDetail.TotalBals

            const donebalnace = Math.floor(DataUpdate.TotalBals) - Math.floor(Idofrow?.[1])

            if (donebalnace <= DataBalance) {

                try {
                    const res1 = await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - donebalnace }, auth)
                    const res2 = await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, auth)
                    const res3 = await Axios.post("/bal/",
                        {
                            amount: -donebalnace,
                            action: "Updated",
                            userId: Idofrow?.[0]
                        }, auth)

                    await axios.all([res1, res2, res3]).then((() => {
                        toast.success("User Updated Successfully")
                        toast.success("Your Balance Now= " + (DataBalance - donebalnace) + " $");

                    })).catch(() => {
                        toast.error(" error to update user * ")

                    })

                } catch {
                    toast.error(" error to update user * ")
                }
                finally {
                    setIdofrow(null);
                    setDeletestate(null);
                    setData({
                        userName: "",
                        email: "",
                        password: "",
                        userRole: "",
                        TotalBals: "",
                    });
                    setReNewData(true)

                }




            }




        }

        else if (Idofrow?.[3] == "Qarz" && DataUpdate.userRole == "Qarz") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth)

            const DataBalance = UDetails.data.userDetail.TotalBals

            const donebalnace = Math.floor(Idofrow?.[1]) - Math.floor(DataUpdate.TotalBals)

            if (donebalnace <= DataBalance) {

                try {
                    const res1 = await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - donebalnace }, auth)
                    const res2 = await Axios.patch(`/users/${Idofrow?.[0]}`, DataUpdate, auth)
                    const res3 = await Axios.post("/bal/",
                        {
                            amount: -donebalnace,
                            action: "Updated",
                            userId: Idofrow?.[0]
                        }, auth)

                    await axios.all([res1, res2, res3]).then(axios.spread((...responses) => {
                        toast.success("User Updated Successfully")
                        toast.success("Your Balance Now= " + (DataBalance - donebalnace) + " $");

                    })).catch(() => {
                        toast.error(" error to update user * ")

                    })

                } catch {
                    toast.error(" error to update user * ")
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
                    setReNewData(true)

                }




            }




        }

    }
    const handledeleteUser = async () => {
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            },
        }
        console.log(Deletestate[0])

        const UDetails = await Axios.get(`/users/detail/${Deletestate?.[0]}`, auth)
        const BalanceUser = UDetails.data.userDetail.TotalBals
        const Cars = UDetails.data?.Cars
        console.log(UDetails.data)

        if (Deletestate?.[3] == "Reseller" && BalanceUser == 0 && Cars == 0) {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth)

            const DataBalance = UDetails.data.userDetail.TotalBals

            try {
                const res1 = Axios.delete(`/users/${Deletestate[0]}`, auth)
                const res2 = Axios.patch(`/users/${SessionID}`, { "TotalBals": DataBalance + Deletestate?.[1] }, auth)
                const res3 = Axios.post("/bal/",
                    {
                        userId: session?.data?.id,
                        amount: Math.floor(Deletestate?.[1]),
                        note: Deletestate?.[2],
                        action: "Deleted",
                    }, auth)

                await axios.all([res1, res2, res3]).then(() => {

                    toast.success("User Deleted Successfully")
                    toast.success("Your Balance Now= " + (DataBalance + Deletestate?.[1]) + " $");

                }).catch(() => {
                    toast.error("Something Went Wrong *")

                })


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
                setReNewData(true)
            }


        }
        else if (Deletestate?.[3] == "Qarz" && BalanceUser == 0 && Cars == 0) {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth,)

            const DataBalance = UDetails.data.userDetail.TotalBals

            if (Deletestate?.[1] <= DataBalance) {
                try {

                    const res1 = Axios.delete(`/users/${Deletestate[0]}`, auth)
                    const res2 = Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - Deletestate?.[1] }, auth)
                    const res3 = Axios.post("/bal/",
                        {
                            userId: session?.data?.id,
                            amount: -Math.floor(Deletestate?.[1]),
                            note: Deletestate?.[2],
                            action: "Deleted",
                        }, auth)

                    await axios.all([res1, res2, res3]).then(() => {

                        toast.success("User Deleted Successfully")
                        toast.success("Your Balance Now= " + (DataBalance - Deletestate?.[1]) + " $");

                    }).catch(() => {

                    })





                } catch (error) {

                } finally {
                    setIdofrow(null);
                    setDeletestate(null);
                    // setData({
                    //     userName: "",
                    //     email: "",
                    //     password: "",
                    //     userRole: "",
                    //     TotalBals: "",
                    // });
                    setReNewData(true)
                }


            }
            else {

                toast.error("you dont have enough balance ")
            }
        }
        else if (Deletestate?.[3] == "Admin" && BalanceUser == 0 && BalanceUser == 0) {


            try {
                await Axios.delete(`/users/${Deletestate?.[0]}`, auth)
                toast.success("User Deleted Successfully")

            } catch (error) {
                toast.error("Something Went Wrong *")

            } finally {
                setIdofrow(null);
                setDeletestate(null);
                setReNewData(true)
            }
        }
        else {
            toast.error("you cant delete this user ")
        }
    }


    let changeNumber = 0

    const addUsers = async () => {

        (typeof document !== "undefined") && (document.getElementById("my-modal").click())
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }

        if (Data.userRole == "Reseller") {
            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth,)
            const DataBalance = UDetails.data.userDetail.TotalBals
            if (Data.TotalBals <= DataBalance) {

                try {

                    await Axios.post("/users/signup/", Data, auth).then(async (res) => {
                        const res1 = await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - Data.TotalBals }, auth,)
                        const res2 = await Axios.post("/bal/", {
                            amount: - Data.TotalBals,
                            userId: res?.data.Id,
                            action: "Gived",
                            note: Data.userName,

                        }, auth,)

                        await axios.all([res1, res2]).then((...res) => {
                            toast.success("Your Balance Now= " + (DataBalance - Data.TotalBals) + " $");
                            toast.success("User added Successfully");
                        })
                    }).catch(() => {

                    })

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
        else if (Data.userRole == "Qarz") {

            const UDetails = await Axios.get(`/users/detail/${session?.data?.id}`, auth,)
            const DataBalance = UDetails.data.userDetail.TotalBals

            if (Data.TotalBals <= DataBalance) {
                try {
                    const one = `/users/signup/`
                    const two = `/users/${SessionID}`
                    const thre = `/bal/`

                    Axios.post(one, Data, auth).then(async (res) => {

                        const res2 = Axios.patch(two, { "TotalBals": DataBalance + Data.TotalBals }, auth,)
                        const res3 = Axios.post(thre, {
                            userId: res?.data.Id,
                            amount: Data.TotalBals,
                            action: "Received",
                            note: Data.userName,
                        }, auth,)

                        await axios.all([res2, res3]).then((...res) => {
                            toast.success("Your Balance Now= " + (DataBalance + Data.TotalBals) + " $");
                            toast.success("User added Successfully");
                            setReNewData(true)
                        }).catch((err) => {

                        })



                    })




                } catch (error) {
                    error.request.status === 409 ? toast.error("User Already Exist") :
                        toast.error("User Not Added *");
                }
            }
            else {
                toast.error("balance not enough")
            }

        }

        else if (Data.userRole != "Admin") {

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

            const one = `/users/${session?.data?.id}`
            const two = `/bal/`
            const auth = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                },
            }
            const res1 = await Axios.patch(`/users/${session?.data?.id}`, {
                password: DataUpdateAdmin.password,
                email: DataUpdateAdmin.email,
                userName: DataUpdateAdmin.userName,
                TotalBals: DataUpdateAdmin.TotalBals
            }, auth)

            const res2 = await Axios.post("/bal/",
                {
                    amount: DataUpdateAdmin.TotalBals,
                    action: "Reseated",
                    userId: session?.data?.id

                }, auth,)

            await axios.all([res1, res2]).then((...res) => {

                toast.success("Admin Updated Successfully")
                signOut({ callbackUrl: '/Login', redirect: true });

            }).catch(() => {
                toast.error("Something Went Wrong *")

            })

        } catch (error) {
            toast.error("Something Went Wrong *")

        }


    }



    const table_2_pdf = () => {


        const table = document.getElementById('table-to-xls')

        const table_th = [...table.rows].map(r => [...r.querySelectorAll('th')].map((th) => (th.textContent) !== "Edit" && (th.textContent) !== "Delete" ? th.textContent : null))
        const table_td = [...table.rows].map((r) => [...r.querySelectorAll('td')].map(td => td.textContent))

        const doc = new jsPDF("p", "mm", "a4");


        doc.autoTable({


            head: [['', `User Name`, `Email`, "User Role", "Total Balance"]],
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

    const { pageIndex, pageSize } = state

    return (

        <div className='container mx-auto' >

            {/* //^ change user to admin */}
            <div className="mb-20 flex justify-end    p-2 ">

                <div onClick={() => {
                    PageUser == 1 && setPageUser(2)
                    PageUser == 2 && setPageUser(1)
                }}
                    className="p-5  lg:scale-100 cursor-pointer  justify-self-end border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg  w-40 h-16  z-30  ">
                    <div className="flex items-center  justify-around   ">

                        <div>
                            {PageUser == 1 && <div className="">{l.user}</div>}
                            {PageUser == 2 && <div className="">{DataAdmin?.userName}</div>}
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                {PageUser == 2 && <FontAwesomeIcon icon={faUser} className="text-2xl" />}
                                {PageUser == 1 && <FontAwesomeIcon icon={faUsers} className="text-2xl" />}

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/*//^     search      */}

            {PageUser == 1 && <div className=" flex justify-between items-center bg-white dark:bg-[#181a1b] rounded-t-xl shadow-2xl p-5">
                <div className="flex w-72 rounded-lg   items-center bg-white dark:bg-gray-600 shadow ">

                    <label htmlFor="my-modal" className="flex justify-center items-center p-2 "><FontAwesomeIcon className='text-2xl hover:scale-90 mx-1 cursor-pointer' icon={faUserPlus} /> </label>
                    <input autoComplete={false} autoCorrect={false} autoFocus={false} autoSave={false} type="search" placeholder={`${l.search} ...`} className="input input-bordered w-full    focus:outline-0   h-9 "
                        onChange={e =>
                            setSearch(e.target.value.match(/^[a-zA-Z0-9]*/)?.[0])
                        }
                    />
                </div>
            </div>}
            <div className=" container mx-auto overflow-x-auto  scrollbar-hide bg-white dark:bg-[#181a1b]  rounded-b-2xl shadow-neutral ">
                {PageUser == 1 && <div >

                    {/*  //^    Modal    */}
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


                    {/*  //^    Table    */}

                    <table id="table-to-xls" className="table w-full my-10  text-xs min-w-[650px] " {...getTableProps()}>
                        <thead className=" text-center min-w-[96000px]">

                            {headerGroups.map((headerGroups, idx) => (

                                <tr className="text-xs text-center  min-w-[96000px]" key={headerGroups.id} {...headerGroups.getHeaderGroupProps()}>
                                    <th className='hidden' ></th>
                                    {headerGroups.headers.map((column, idx) => (

                                        <th key={idx} className=" font-normal normal-case " {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}

                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? "⇅" : "⇵") : ""}
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
                                        <td className='hidden' ></td>
                                        {row.cells.map((cell, idx) => {
                                            return (


                                                <td key={idx} className="text-center py-3 dark:bg-[#181a1b]" {...cell.getCellProps()}>


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
                                                                        disabled
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
                                                        }} aria-label="upload picture" ><FontAwesomeIcon icon={faEdit} className="text-2xl text-blue-500 cursor-pointer" /></label>

                                                        :
                                                        <div className=" space-x-3">
                                                            {cell.column.id === "Edit" && <button disabled={EValid && RValid && BValid && UValid ? false : true} type='submit' onClick={handleUpdateUser} className="btn btn-accent "> <FontAwesomeIcon icon={faSave} className="text-2xl" /></button>}
                                                            {cell.column.id === "Edit" && <button onClick={() => { setIdofrow(null), setDataUpdate(null), setEValid(false), setUValid(false), setBValid(false) }} className="btn  btn-error"><FontAwesomeIcon icon={faBan} className="text-2xl" /></button>}

                                                        </div>


                                                    }
                                                    {cell.column.id === "Delete" && <label htmlFor="my-modal-3" className="m-0 cursor-pointer" onClick={() => { setDeletestate([row.original._id, row.original.TotalBals, row.original.userName, row.original.userRole]) }}><FontAwesomeIcon icon={faTrash} className="text-2xl text-red-700" /></label>}


                                                </td>

                                            )
                                        })}

                                    </tr>
                                )
                            }

                            )}

                        </tbody>


                    </table>


                    {/*  //^    Footer    */}

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


                    {/* //^  modal */}
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






