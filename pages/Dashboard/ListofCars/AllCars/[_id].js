
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Axios, { baseURL } from '../../../api/Axios';

import Head from 'next/head'
import { useRouter } from 'next/router'
import useLanguage from '../../../../Component/language';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPaperPlane, faHandHoldingUsd, faArrowsRotate, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../../../Layouts/AdminLayout';
import Image from "next/image";
import { ToastContainer, toast, } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import { getSession, useSession } from "next-auth/react";

import jsPDF from "jspdf";






export const getServerSideProps = async (context) => {

    const session = await getSession({ req: context.req })



    if (!session || session?.userRole !== "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }
    const _id = context.params?._id;

    const response = await Axios.get('/cars/' + _id, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session?.data?.Token}`
        }
    },)
    const data = await response.data
    return {
        props: {
            carss: data,
            SessionID: session.id,
        },

    }



}


const Detail = ({ carss, SessionID }) => {


    const session = useSession()

    const InputUpdate = useRef()

    const router = useRouter()
    const [cars, setCars] = useState(carss);
    const [User, setUser] = useState([]);
    const [ChooseUser, setChooseUser] = useState("");
    const [UserID, setUserID] = useState(null);
    const [detpage, setDetpage] = useState(1);

    const l = useLanguage();



    const V_B_N = (e) => {

        if (typeof document !== "undefined") {
            const xd = document.getElementsByName(e)

            if (xd?.[0]?.type == "text") {


                return xd?.[0]?.value.match(/^[0-9a-zA-Z]{0,24}/)?.[0]
            }



            if (xd?.[0]?.type == "number") {


                return xd?.[0]?.value.match(/^[0-9]{0,7}/)?.[0]
            }


            if (xd?.[0]?.type == "select-one") {

                return xd?.[0]?.value.match(/^[a-zA-Z]{0,8}/)?.[0]

            }

            if (xd?.[0]?.type == "date") {

                return xd?.[0]?.value.match(/\d{4}-\d{2}-\d{2}/)?.[0]

            }

        }
    }

    let TotalCurrentCosts =
        Math.floor(cars.carDetail.carCost.pricePaidbid) +
        Math.floor(cars.carDetail.carCost.coCCost) +
        Math.floor(cars.carDetail.carCost.feesinAmericaStoragefee) +
        Math.floor(cars.carDetail.carCost.feesinAmericaCopartorIAAfee) +
        Math.floor(cars.carDetail.carCost.feesAndRepaidCostDubairepairCost) +
        Math.floor(cars.carDetail.carCost.feesAndRepaidCostDubaiFees) +
        Math.floor(cars.carDetail.carCost.feesAndRepaidCostDubaiothers) +
        Math.floor(cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost) +
        Math.floor(cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost) +
        Math.floor(cars.carDetail.carCost.dubaiToIraqGCostTranscost) +
        Math.floor(cars.carDetail.carCost.dubaiToIraqGCostgumrgCost) +
        Math.floor(cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost) +
        Math.floor(cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers)

    const handleDeleteCars = async () => {


        if (cars.carDetail.carCost.isSold == false) {

            try {

                const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                const DataBalance = UDetails.data.userDetail.TotalBals

                try {
                    await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance + TotalCurrentCosts }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    toast.success("Your Balance Now= " + (DataBalance + TotalCurrentCosts) + " $");


                    try {
                        const id = router.query._id



                        await Axios.post("/bal/",
                            {
                                amount: TotalCurrentCosts,
                                action: "DeletedCar",
                                // carId: cars.carDetail.modeName,
                                userId: SessionID

                            }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)


                        await Axios.delete("/cars/" + id, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)



                        toast.done("Car has been Deleted")
                        router.back()

                    } catch (err) {

                        toast.error("error to Deleting Car *")


                    }

                }
                catch (err) {

                    toast.error("Error from user balance *")

                }


            } catch (e) {
                toast.error("error to get Balance *");


            }
        }

        if (cars.carDetail.carCost.isSold == true) {

            try {
                const id = router.query._id

                await Axios.delete("/cars/" + id, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                toast.error("Car has been Deleted")
                router.back()

            } catch (err) {

                toast.error("error to Deleting Car")


            }
        }

    }


    const handleUpdateCars = async () => {

        const DataUpload = {
            "Tocar": V_B_N("Tocar"),
            "Price": V_B_N("Price"),
            "IsSold": V_B_N("IsSold"),
            "ModeName": V_B_N("ModeName"),
            "Model": V_B_N("Model"),
            "Color": V_B_N("Color"),
            "Mileage": V_B_N("Mileage"),
            "VINNumber": V_B_N("VINNumber"),
            "WheelDriveType": V_B_N("WheelDriveType"),

            "PricePaidbid": V_B_N("PricePaidbid"),

            "Tobalance": V_B_N("Tobalance"),
            "Tire": V_B_N("Tire"),
            "Date": V_B_N("Date"),
            Arrived: V_B_N("Arrived"),
            "FeesinAmericaStoragefee": V_B_N("FeesinAmericaStoragefee"),
            "FeesinAmericaCopartorIAAfee": V_B_N("FeesinAmericaCopartorIAAfee"),

            "FeesAndRepaidCostDubairepairCost": V_B_N("FeesAndRepaidCostDubairepairCost"),
            "FeesAndRepaidCostDubaiFees": V_B_N("FeesAndRepaidCostDubaiFees"),
            "FeesAndRepaidCostDubaiothers": V_B_N("FeesAndRepaidCostDubaiothers"),
            "FeesAndRepaidCostDubainote": V_B_N("FeesAndRepaidCostDubainote"),

            "CoCCost": V_B_N("CoCCost"),

            "TransportationCostFromAmericaLocationtoDubaiGCostLocation": V_B_N("TransportationCostFromAmericaLocationtoDubaiGCostLocation"),
            "TransportationCostFromAmericaLocationtoDubaiGCostTranscost": V_B_N("TransportationCostFromAmericaLocationtoDubaiGCostTranscost"),
            "TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost": V_B_N("TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost"),

            "DubaiToIraqGCostTranscost": V_B_N("DubaiToIraqGCostTranscost"),
            "DubaiToIraqGCostgumrgCost": V_B_N("DubaiToIraqGCostgumrgCost"),

            "RaqamAndRepairCostinKurdistanrepairCost": V_B_N("RaqamAndRepairCostinKurdistanrepairCost"),
            "RaqamAndRepairCostinKurdistanRaqam": V_B_N("RaqamAndRepairCostinKurdistanRaqam"),
            "RaqamAndRepairCostinKurdistanothers": V_B_N("RaqamAndRepairCostinKurdistanothers"),
            "RaqamAndRepairCostinKurdistannote": V_B_N("RaqamAndRepairCostinKurdistannote"),

        }



        let TotalCosts =
            Math.floor(DataUpload.PricePaidbid) +
            Math.floor(DataUpload.CoCCost) +
            Math.floor(DataUpload.FeesinAmericaStoragefee) +
            Math.floor(DataUpload.FeesinAmericaCopartorIAAfee) +
            Math.floor(DataUpload.FeesAndRepaidCostDubairepairCost) +
            Math.floor(DataUpload.FeesAndRepaidCostDubaiFees) +
            Math.floor(DataUpload.FeesAndRepaidCostDubaiothers) +
            Math.floor(DataUpload.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost) +
            Math.floor(DataUpload.TransportationCostFromAmericaLocationtoDubaiGCostTranscost) +
            Math.floor(DataUpload.DubaiToIraqGCostTranscost) +
            Math.floor(DataUpload.DubaiToIraqGCostgumrgCost) +
            Math.floor(DataUpload.RaqamAndRepairCostinKurdistanrepairCost) +
            Math.floor(DataUpload.RaqamAndRepairCostinKurdistanothers)

        let DoneBalance = TotalCosts - TotalCurrentCosts;



        const CurrentPrice = Math.floor(cars.carDetail.carCost.price)
        const updatePrice = Math.floor(DataUpload.Price)



   


        if (DataUpload.Tobalance == "Cash" && DataUpload.IsSold == 'false') {

            try {
                //FIXME -  change Email to Id of user
                const UDetails = await Axios.get(`/users/detail/${SessionID}`)

                const DataBalance = Math.floor(UDetails.data.userDetail.TotalBals)


                if (DoneBalance <= DataBalance) {
                    try {

                        await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - DoneBalance }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        await Axios.post("/bal/",
                            {
                                amount: -DoneBalance,
                                action: "Update",
                                carId: cars.carDetail._id,
                                userId: SessionID,
                            }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        try {
                            const id = router.query._id
                            const res = await Axios.patch(`/cars/${id}`,
                                DataUpload
                                , {
                                    headers: {
                                        "Content-Type": "application/json",
                                        'Authorization': `Bearer ${session?.data?.Token}`
                                    }
                                },)


                            toast.success("Data updated successfully");
                            router.reload()

                        } catch (err) {
                            toast.error("error to updated car *")
                        }
                        setDetpage(1)


                        toast.success("Your Balance Now= " + (DataBalance - DoneBalance) + " $");
                        // router.reload();
                    } catch (err) {

                        toast.error("Error from user balance *")

                    }
                }
                else {
                    toast.error("Your Balance is not enough")
                }

            } catch (e) {
                toast.error("error to update Balance *");


            }

        }

        else if (DataUpload.Tobalance == "Cash" && DataUpload.IsSold == 'true') {

            try {
                //FIXME -  change Email to Id of user
                const UDetails = await Axios.get(`/users/detail/${SessionID}`)

                const DataBalance = UDetails.data.userDetail.TotalBals
                const DonePrice = DoneBalance - (updatePrice - CurrentPrice)



                if (DonePrice <= DataBalance) {
                    try {

                        await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - DonePrice }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        await Axios.post("/bal/",
                            {
                                amount: -DonePrice,
                                action: "Update",
                                carId: cars.carDetail._id,
                                userId: SessionID
                            }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        try {
                            const id = router.query._id
                            const res = await Axios.patch(`/cars/${id}`,
                                DataUpload
                                , {
                                    headers: {
                                        "Content-Type": "application/json",
                                        'Authorization': `Bearer ${session?.data?.Token}`
                                    }
                                },)


                            toast.success("Data updated successfully");
                            router.reload()

                        } catch (err) {
                            toast.error("error to updated car *")
                        }
                        setDetpage(1)

                        toast.success("Your Balance Now= " + (DataBalance - DonePrice) + " $");
                        // router.reload();
                    } catch (err) {

                        toast.error("Error from user balance *")

                    }
                }
                else {
                    toast.error("Your Balance is not enough")
                }

            } catch (e) {
                toast.error("error to update Balance *");


            }

        }

        //FIXME - if Update Car    ----- Loan 
        else if (DataUpload.Tobalance == "Loann") {

            try {
                const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                const DataBalance = UDetails.data.userDetail.TotalBals

                if (TotalCosts <= DataBalance) {
                    try {

                        await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - DoneBalance }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        toast.success("Your Balance Now= " + (DataBalance - DoneBalance) + " $");

                    } catch (err) {

                        toast.error("Error from user balance *")

                    }
                }

            } catch (e) {
                toast.error("error to update Balance *");


            }


        }
        else {
            toast.error("you cant update Loan and Rent balance *");
        }


        // try {
        //     const id = router.query._id
        //     const res = await Axios.patch(`/cars/${id}`,
        //         DataUpload
        //         , {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 'Authorization': `Bearer ${session?.data?.Token}`
        //             }
        //         },)


        //     toast.success("Data updated successfully");
        //     // router.reload()

        // } catch (err) {
        //     toast.error("error to updated car")
        // }
        // setDetpage(1)
    }



    const handleSoldCars = async (bool) => {


        if (cars.carDetail.carCost.isSold == true) {


            try {

                const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)
                const DataBalance = UDetails.data.userDetail.TotalBals

                if (cars.carDetail.carCost.price <= DataBalance) {
                    try {

                        await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - cars.carDetail.carCost.price }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        toast.success("Your Balance Now= " + (DataBalance - cars.carDetail.carCost.price) + " $");


                        try {
                            const id = router.query._id

                            await Axios.patch(`/cars/${id}`,
                                {
                                    "IsSold": bool
                                }, {
                                headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${session?.data?.Token}`
                                }
                            },)

                            await Axios.post("/bal/",
                                {
                                    amount: -cars.carDetail.carCost.price,
                                    action: "Retrieved",
                                    carId: cars.carDetail._id,
                                    userId: SessionID
                                }, {
                                headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${session?.data?.Token}`
                                }
                            },)

                            toast.success("Car Retrieved")
                            router.reload()

                        } catch (err) {

                            // (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&
                            toast.error("error to Retrieved*")


                        }

                    }
                    catch (err) {

                        toast.error("Error from user balance *")

                    }
                }
                else {
                    toast.warn("You don't have enough balance");

                }

            } catch (e) {
                toast.error("error to get Balance *");


            }
        }

        if (cars.carDetail.carCost.isSold == false) {

            try {
                //FIXME -  change Email to Id of user
                const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.data?.Token}`
                    }
                },)

                const DataBalance = UDetails.data.userDetail.TotalBals


                try {

                    await Axios.patch(`/users/${SessionID}`, { "TotalBals": DataBalance + cars.carDetail.carCost.price }, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    toast.success("Your Balance Now= " + (DataBalance + cars.carDetail.carCost.price) + " $");

                    try {
                        const id = router.query._id

                        await Axios.patch(`/cars/${id}`,
                            {
                                "IsSold": bool
                            }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)


                        await Axios.post("/bal/",
                            {
                                amount: cars.carDetail.carCost.price,
                                action: "Sold",
                                carId: cars.carDetail._id,
                                userId: SessionID
                            }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        toast.success("Car Sold")
                        router.reload()

                    } catch (err) {

                        // (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&
                        toast.error("error to sold")


                    }

                } catch (err) {

                    toast.error("Error from user balance *")

                }


            } catch (e) {
                toast.error("error to get Balance *");


            }
        }






    }
    const handleGiveToReseller = async () => {

        try {
            const id = router.query._id


            await Axios.patch(`reseller/{"userId":"${UserID}", "carId":"${id}"}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)
            toast.success("Car Geven to Reseller Successfully")

        }
        catch (err) {

            toast.error("error to Give Car")

        }



    }
    const handleGiveToQarz = async () => {



        if ("") {

        }
        try {
            const id = router.query._id

            await Axios.post(`/qarz/`, {
                userId: UserID,
                carId: id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)



            toast.success("Car Geven to Qarz Successfully")

        }
        catch (err) {

            (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&

                toast.error("error to Give Car to Qarz")

        }


    }

    useEffect(() => {
        if (session.status === "authenticated") {

            const handleGetCars = async () => {

                try {
                    const id = router.query._id

                    const res = await Axios.get(`/cars/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)

                    setCars(res.data)



                } catch (err) {

                    // (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&
                    toast.error("error to Get Car *")

                }
            }

            handleGetCars()
        }

    }, [detpage, session.status])

    const id = router.query._id
    useEffect(() => {

        if (session.status === "authenticated") {

            const handleGetUsers = async () => {
                try {
                    const res = await Axios.get(`/users`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)
                    setUser(res.data.userDetail)
                } catch (err) {
                    // toast.error("error to Get Users *")
                }
            }
            handleGetUsers()
        }
    }, [id, session.status])


    const Doc_2_pdf = () => {

        const doc = new jsPDF("p", "mm", "a4");

        cars?.carDetail?.carDamage.length > 0 ?
            doc.addImage(`${baseURL}/${cars?.carDetail?.carDamage?.[0]?.filename}`, 'PNG', -12, -89, 226, 149 + 12, null, null, 270)
            :
            doc.addImage('/Sedan.png', 'PNG', -12, -89, 226, 149 + 12, null, null, 270)

        doc.addImage('/Detaile_Car_Damage.png', 'PNG', 1, 1, 210, 70)

        doc.addImage('/Detail_Taible_Damage.png', 'PNG', 148, 70, 0, 226)

        doc.save("Car_Damage.pdf");
    }


    const renderVideo = (item) => {

        return (
            <div>

                {item.taramash != "false" ?
                    <div className='video-wrapper flex text-center items-center justify-center   '>
                        <video width="1600" height="1040" controls
                            // crossOrigin="anonymous"
                            className="h-auto max-w-full flex text-center items-center justify-center  ">
                            <source
                                // crossOrigin="anonymous"
                                src={`${baseURL}${item.taramash}`} type="video/mp4" />
                        </video >
                    </div >
                    :
                    <div className='play-button w-full h-full relative  '>
                        <Image width={1600} height={1040}
                            alt='SliderImage'
                            // objectFit='contain'
                            // quality={'1'}
                            className='image-gallery-image  '
                            crossOrigin="anonymous"
                            src={item.original}
                        />

                    </div>
                }

            </div >
        );

    }


    const dataa = []

    cars.carDetail?.pictureandvideorepair?.map((img, index) => {
        dataa.push({
            "original": `${baseURL}${img.filename}`,
            "thumbnail": `${baseURL}${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo

        })

    })
    cars.carDetail?.pictureandvideodamage?.map((img, index) => {
        dataa.push({
            "original": `${baseURL}${img.filename}`,
            "thumbnail": `${baseURL}${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo

        })
    })
    cars.carDetail?.carDamage?.map((img, index) => {
        dataa.push({
            "original": `${baseURL}${img.filename}`,
            "thumbnail": `${baseURL}${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo

        })
    })








    return (
        <>
            <Head>
                <title> Cars Details</title>
            </Head>

            < >
                <ToastContainer
                    draggablePercent={60}
                />

                <div className="navbar mb-16  flex justify-between scrollbar-hide  max-w-8xl overflow-auto space-x-2  lg:w-[calc(100%-1rem)]  mt-2  bg-opacity-5    backdrop-blur-md bg-slate-300 rounded-2xl   ">


                    <button className="btn btn-success" onClick={() => { setDetpage(3) }}>{l.update}</button>
                    <label htmlFor="my-modal-3" className="btn btn-error modal-button">{l.delete}</label>
                    <label htmlFor="give-modal-3" className="btn btn-info modal-button">{l.give}</label>
                    {(cars.carDetail.carCost.isSold == true) && <label htmlFor="sold-modal-3" className="btn btn-warning modal-button">{l.retrieve}</label>}
                    {cars.carDetail.carCost.isSold ==false && <label htmlFor="sell-modal-3" className="btn btn-warning modal-button">{l.sell}</label>}
                    <label className="btn btn-outline modal-button" onClick={Doc_2_pdf}>PDF</label>



                </div>

                <div>
                    <input type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faTrashAlt} className="text-5xl text-red-700 " />  </h3>
                            <p className="py-4 ">{l.deletemsg}</p>
                            <div className="space-x-10 ">
                                <label className="btn btn-error " onClick={handleDeleteCars}>{l.yes}</label>
                                <label htmlFor="my-modal-3" className="btn btn-accent ">{l.no}</label>
                            </div>
                        </div>
                    </div>





                    <input type="checkbox" id="give-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="give-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faPaperPlane} className="text-5xl " />  </h3>
                            <p className="py-4">{l.givemsg}</p>




                            <div className="space-x-10">{

                            }
                                <div className="text-center m-5 space-y-5 ">
                                    <select onChange={(e) => {
                                        setUserID(null)
                                        setChooseUser(e.target.value)
                                    }} type='select' defaultValue={"Select"} className="select select-info w-full max-w-xs">
                                        <option value="Select" >{l.select}</option>
                                        {/* <option value="Qarz_1" >{l.loan}</option> */}
                                        <option value="Reseller_2" >{l.reseler}</option>

                                    </select>
                                    {(ChooseUser == "Qarz_1" && ChooseUser !== "") &&

                                        <>
                                            {cars.carDetail.tobalance == "Loan" &&
                                                //FIXME -  how i can give car to qarz account if Tobalance is Loan
                                                <div className=" flex justify-center ">
                                                    <div className="alert alert-warning shadow-lg w-80 text-start  ">
                                                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl " />
                                                        <span className="text-start ">{l.loanmsg}</span>
                                                    </div>
                                                </div>

                                            }

                                            <select disabled={cars.carDetail.tobalance == "Loan" ? true : false} defaultValue={"Select"} onChange={(event) => { setUserID(event.target.value) }} className="select select-info w-full max-w-xs">
                                                <option disabled value="Select">{l.select}</option>
                                                {User?.map((item, index) => {
                                                    if (item.userRole == "Reseller") {
                                                        return null;
                                                    }
                                                    if (item.userRole == "Qarz") {
                                                        return (<option key={index} value={item._id} >{item.userName}</option>
                                                        )
                                                    }
                                                })}
                                            </select>
                                        </>
                                    }


                                    {(ChooseUser == "Reseller_2" && ChooseUser !== "") &&
                                        <select defaultValue={"Select"} onChange={(event) => { setUserID(event.target.value) }} className="select select-info w-full max-w-xs">
                                            <option disabled value="Select">{l.select}</option>
                                            {User?.map((item, index) => {

                                                if (item.userRole == "Qarz") {
                                                    return null;
                                                }
                                                if (item.userRole == "Reseller") {
                                                    return (<option key={index} value={item._id} >{item.userName}</option>
                                                    )
                                                }

                                            })}
                                        </select>
                                    }






                                </div>
                                <div className="flex  justify-end">
                                    <label htmlFor="give-modal-3" className="btn btn-accent" disabled={(UserID != null && ChooseUser != '') ? false : true} onClick={
                                        ChooseUser == "Qarz_1" ? handleGiveToQarz : handleGiveToReseller

                                    }>{l.send}</label>
                                </div>

                            </div>
                        </div>
                    </div>






                    <input type="checkbox" id="sold-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="sold-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faArrowsRotate} className="text-5xl " /></h3>
                            <p className="py-4">{l.soldmsg}</p>
                            <div className="space-x-10">
                                <label htmlFor="sold-modal-3" className="btn btn-warning" onClick={() => handleSoldCars("false")}>{l.yes}</label>
                                <label htmlFor="sold-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div>


                    <input type="checkbox" id="sell-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="sell-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faHandHoldingUsd} className="text-5xl " /></h3>
                            <p className="py-4">{l.sellmsg}</p>
                            <div className="space-x-10">
                                <label htmlFor="sell-modal-3" className="btn btn-warning" onClick={() => {
                                    handleSoldCars("true")

                                }
                                }>{l.yes}</label>
                                <label htmlFor="sell-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto z-50 ">


                    <ImageGallery
                        onErrorImageURL="/Video.svg"
                        slideInterval={10000}
                        autoPlay={false}
                        showBullets={true}
                        useTranslate3D={true}
                        lazyLoad={true}
                        showThumbnails={true}
                        items={dataa}
                        additionalClass="z-50"
                        classNmae="z-50"
                        useBrowserFullscreen={true}

                    />



                    <div className="  mb-40 mx-2  ">


                        <div className="overflow-x-auto max-w-5xl z-0">
                            {/* <form onSubmit={HandleAddCars}   > */}
                            <table className="table table-zebra w-full text-center z-0 ">
                                <thead>
                                    <tr className=" z-0">
                                        <th className="active:scale-95 cursor-pointer w-[50%] z-0" onClick={() => { setDetpage(1) }}>{l.info}</th>
                                        <th className="active:scale-95 cursor-pointer w-[50%] z-0" onClick={() => { setDetpage(2) }}>{l.note}</th>
                                    </tr>
                                </thead>
                                <tbody className={`${detpage !== 1 ? "hidden" : ""} `}>
                                    <tr className="">
                                        <td>{l.tocar} :</td>
                                        <td>{cars.carDetail.tocar}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.tire} :</td>
                                        <td>{cars.carDetail.tire}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.date} :</td>
                                        <td>{cars.carDetail.date}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.namecar} :</td>
                                        <td>{cars.carDetail.modeName}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.modelyear} :</td>
                                        <td>{cars.carDetail.model}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.vinnumber} :</td>
                                        <td>{cars.carDetail.VINNumber}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.mileage} :</td>
                                        <td>{cars.carDetail.mileage}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.color} :</td>
                                        <td>{cars.carDetail.color}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.arived}:</td>
                                        {cars.carDetail.arrived ? <td className="">Yes</td> :
                                            <td className="">No</td>
                                        }
                                    </tr>
                                    <tr className="">
                                        <td>{l.wheeldrivetype} :</td>
                                        <td>{cars.carDetail.wheelDriveType}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.price} :</td>
                                        <td>{cars.carDetail.carCost.price}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.isSold} :</td>
                                        {/* <td>{cars.carDetail.carCost.isSold?.toString()}</td> */}
                                        {cars.carDetail.carCost.isSold ? <td className="">Yes</td> :
                                            <td className="">No</td>
                                        }
                                    </tr>
                                    <tr className="">
                                        <td>{l.tobalance} :</td>
                                        <td>{cars.carDetail.tobalance}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.pricepaidorcaratbid}:</td>
                                        <td>{cars.carDetail.carCost.pricePaidbid}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.storagefee} :</td>
                                        <td>{cars.carDetail.carCost.feesinAmericaStoragefee}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.copartoriaafee} :</td>
                                        <td>{cars.carDetail.carCost.feesinAmericaCopartorIAAfee}</td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.dubairepaircost} :</td>
                                        <td>{cars.carDetail.carCost.feesAndRepaidCostDubairepairCost}</td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.feesinadubai} :</td>
                                        <td>{cars.carDetail.carCost.feesAndRepaidCostDubaiFees}</td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.feesAndRepaidCostDubaiothers} :</td>
                                        <td>{cars.carDetail.carCost.feesAndRepaidCostDubaiothers}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.coccost} :</td>
                                        <td>{cars.carDetail.carCost.coCCost}</td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.uslocation} :</td>
                                        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromamericatodubaicost} :</td>
                                        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromamericatodubaigumrg} :</td>
                                        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}</td>

                                    </tr>


                                    <tr className="">
                                        <td>{l.fromdubaitokurdistancosts} :</td>
                                        <td>{cars.carDetail.carCost.dubaiToIraqGCostTranscost}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromdubaitokurdistangumrg} :</td>
                                        <td>{cars.carDetail.carCost.dubaiToIraqGCostgumrgCost}</td>
                                    </tr>




                                    <tr className="">
                                        <td>{l.numberinkurdistan} :</td>
                                        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanRaqam}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.repaircostinkurdistan} :</td>
                                        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost}</td>
                                    </tr>


                                    <tr className="">
                                        <td>{l.fromdubaitokurdistanothers} :</td>
                                        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers}</td>
                                    </tr>







                                </tbody>
                                <tbody ref={InputUpdate} className={`${detpage !== 3 ? "hidden" : ""} `}>
                                    <tr className="">
                                        <td>{l.tocar} :</td>
                                        <td>
                                            <select disabled name="Tocar" defaultValue={cars.carDetail.tocar} className="select select-info w-full max-w-xs">
                                                <option value="Sedan">Sedan</option>
                                                <option value="SUV">SUV</option>
                                                <option value="PickUp">PickUp</option>

                                            </select>



                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.tire} :</td>
                                        <td>

                                            <input name="Tire" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.tire} />

                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.date} :</td>
                                        <td>

                                            <input name="Date" type="Date" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.date} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.namecar} :</td>
                                        <td>

                                            <input name="ModeName" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.modeName} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.modelyear} :</td>
                                        <td>

                                            <input name="Model" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.model} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.vinnumber} :</td>
                                        <td>

                                            <input name="VINNumber" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.VINNumber} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.mileage} :</td>
                                        <td>

                                            <input name="Mileage" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.mileage} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.color} :</td>
                                        <td>

                                            <input name="Color" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.color} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.arived}:</td>
                                        <td className="">
                                            <select name="Arrived" defaultValue={cars.carDetail.arrived} className="select select-info w-full max-w-xs">
                                                <option value={true} >Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.wheeldrivetype} :</td>
                                        <td>

                                            <input name="WheelDriveType" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.wheelDriveType} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.price} :</td>
                                        <td>

                                            <input name="Price" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.price} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.isSold} :</td>
                                        <td>

                                            <select disabled name="IsSold" defaultValue={cars.carDetail.carCost.isSold} className="select select-info w-full max-w-xs">
                                                <option value={true} >Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.tobalance} :</td>
                                        <td>
                                            <select disabled name="Tobalance" defaultValue={cars.carDetail.tobalance} className="select select-info w-full max-w-xs">
                                                <option value="Cash"> {l.cash} </option>
                                                <option value="Loan" > {l.loan} </option>
                                                <option value="Rent" > {l.rent} </option>

                                            </select>

                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.pricepaidorcaratbid}:</td>
                                        <td>

                                            <input name="PricePaidbid" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.pricePaidbid}

                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.storagefee} :</td>
                                        <td>

                                            <input name="FeesinAmericaStoragefee" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesinAmericaStoragefee}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.copartoriaafee} :</td>
                                        <td>

                                            <input name="FeesinAmericaCopartorIAAfee" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesinAmericaCopartorIAAfee}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.dubairepaircost} :</td>
                                        <td>

                                            <input name="FeesAndRepaidCostDubairepairCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubairepairCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.feesinadubai} :</td>
                                        <td>

                                            <input name="FeesAndRepaidCostDubaiFees" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubaiFees}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.feesAndRepaidCostDubaiothers} :</td>
                                        <td>

                                            <input name="FeesAndRepaidCostDubaiothers" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubaiothers}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.coccost} :</td>
                                        <td>

                                            <input name="CoCCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.coCCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.uslocation} :</td>
                                        <td>

                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostLocation" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromamericatodubaicost} :</td>
                                        <td>
                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostTranscost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromamericatodubaigumrg} :</td>
                                        <td>
                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromdubaitokurdistancosts} :</td>
                                        <td>

                                            <input name="DubaiToIraqGCostTranscost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.dubaiToIraqGCostTranscost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromdubaitokurdistangumrg} :</td>
                                        <td>

                                            <input name="DubaiToIraqGCostgumrgCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.dubaiToIraqGCostgumrgCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.numberinkurdistan} :</td>
                                        <td>

                                            <input name="RaqamAndRepairCostinKurdistanRaqam" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanRaqam} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.repaircostinkurdistan} :</td>
                                        <td>

                                            <input name="RaqamAndRepairCostinKurdistanrepairCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td>{l.fromdubaitokurdistanothers} :</td>
                                        <td>

                                            <input name="RaqamAndRepairCostinKurdistanothers" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <button type="button" className="btn btn-error" onClick={() => { setDetpage(1) }}>{l.cancel}</button>
                                        </td>
                                        <td>
                                            <button type="submit" className="btn btn-success" onClick={

                                                handleUpdateCars
                                            } >{l.update}</button>
                                        </td>
                                        {/*   */}
                                    </tr>



                                </tbody>
                            </table>
                            {/* </form> */}
                            <div className={`${detpage !== 2 ? "hidden" : ""} overflow-hidden p-3 space-y-8  pb-20 [line-break: auto] dark:bg-[#242933]  bg-[#F2F2F2] border-t-2 `}>
                                <div className=" text-xl link-accent"> {l.USANote} : </div>
                                <div>{cars.carDetail.carCost.feesAndRepaidCostDubainote}</div>
                                <div className="mt-3 text-xl link-accent"> {l.DubaiNote} : </div>
                                <div>{cars.carDetail.carCost.feesAndRepaidCostDubainote}</div>
                                <div className="mt-3 text-xl link-accent"> {l.KurdistanNot}: </div>
                                <div>{cars.carDetail.carCost.raqamAndRepairCostinKurdistannote}</div>


                            </div>


                        </div>


                    </div>

                </div>







            </>

        </>
    );

}
Detail.Layout = AdminLayout;

export default Detail;