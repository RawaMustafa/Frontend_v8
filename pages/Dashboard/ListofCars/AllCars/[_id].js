import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Axios, { baseURL } from '../../../api/Axios';
import Head from 'next/head'
import { useRouter } from 'next/router'
import useLanguage from '../../../../Component/language';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPaperPlane, faHandHoldingUsd, faArrowsRotate, faExpand, faCompress, faChevronRight, faChevronLeft, faLock, faLockOpen, faWrench } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../../../Layouts/AdminLayout';
import Image from "next/image";
import { ToastContainer, toast, } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import { getSession, useSession } from "next-auth/react";
import jsPDF from "jspdf";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";




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
            'Authorization': `Bearer ${session?.Token}`
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
    const [Note, setNote] = useState('');
    const [detpage, setDetpage] = useState(1);
    const [ImageUpdatePage, setImageUpdatePage] = useState(1);
    const [ImagePage, setImagePage] = useState(1);
    const [FullScreen, setFullScreen] = useState(false);
    const [ShowPage, setShowPage] = useState(1);
    const [RenewPage, setRenewPage] = useState(false);


    const [pictureandvideorepair, setPictureandvideorepair] = useState([])
    const [pictureandvideodamage, setPictureandvideodamage] = useState([])
    const [CarDamage, setCarDamage] = useState([])


    const l = useLanguage();


    const V_B_N = (e) => {

        if (typeof document !== "undefined") {
            const xd = document.getElementsByName(e)

            if (xd?.[0]?.type == "text") {


                return xd?.[0]?.value.match(/^[0-9a-zA-Z-_/,=.><  ]{0,40}/)?.[0]
            }



            if (xd?.[0]?.type == "number") {


                return xd?.[0]?.value.match(/^[0-9.]{0,12}/)?.[0]
            }


            if (xd?.[0]?.type == "select-one") {

                return xd?.[0]?.value.match(/^[a-zA-Z]{0,8}/)?.[0]

            }

            if (xd?.[0]?.type == "date") {

                return xd?.[0]?.value.match(/\d{4}-\d{2}-\d{2}/)?.[0]

            }

        }
    }

    let TotalLoan =
        Math.floor(cars.carDetail.carCost.pricePaidbid) +
        Math.floor(cars.carDetail.carCost.feesinAmericaStoragefee) +
        Math.floor(cars.carDetail.carCost.feesinAmericaCopartorIAAfee) +
        Math.floor(cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost) +
        Math.floor(cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost);



    let TotalCurrentCosts =
        Math.floor(cars.carDetail.carCost.pricePaidbid) +
        Math.floor(cars.carDetail.carCost.coCCost) +
        Math.floor(cars.carDetail.carCost.feesinAmericaStoragefee) +
        Math.floor(cars.carDetail.carCost.feesinAmericaCopartorIAAfee) +
        Math.floor(cars.carDetail.carCost.feesAndRepaidCostDubairepairCost) +
        // Math.floor(cars.carDetail.carCost.feesAndRepaidCostDubaiFees) +
        Math.floor(cars.carDetail.carCost.feesAndRepaidCostDubaiothers) +
        Math.floor(cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost) +
        Math.floor(cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost) +
        Math.floor(cars.carDetail.carCost.dubaiToIraqGCostTranscost) +
        Math.floor(cars.carDetail.carCost.dubaiToIraqGCostgumrgCost) +
        Math.floor(cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost) +
        Math.floor(cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers);


    const handleVisiblity = async (Visiblity) => {

        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }



        try {
            const id = router.query._id

            await Axios.post("/bal/",
                {
                    // amount: TotalCurrentCosts,
                    action: Visiblity,
                    note: "changed to" + Visiblity,
                    userId: SessionID,

                }, auth,)

            await Axios.patch("/cars/" + id, {
                Tire: Visiblity
            }, auth,)

            toast.success("Car Visiblity Changed to " + Visiblity)
            setRenewPage(true)

        } catch (err) {
            toast.error("error to Change Visiblity")
            setRenewPage(true)

        }




    }



    const handleDeleteCars = async () => {
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }

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
                                action: "DeleteCar",
                                note: cars.carDetail.modeName,
                                userId: SessionID,
                                note: Note

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

            console.log("hello")
            try {
                const id = router.query._id

                await Axios.post("/bal/",
                    {
                        // amount: TotalCurrentCosts,
                        action: "Delete",
                        note: cars.carDetail.modeName,
                        userId: SessionID,
                        // note: Note

                    }, auth,)
                console.log("hello", id)

                await Axios.delete(`/cars/${id}`, auth,)

                toast.error("Car has been Deleted")
                router.back()

            } catch (err) {

                toast.error("error to Deleting Car")


            }
        }

    }


    const handleUpdateCars = async () => {

        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }
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
            // "Tire": V_B_N("Tire"),
            "Date": V_B_N("Date"),
            "ArrivedToKurd": V_B_N("arrivedToKurd"),
            "ArrivedToDoubai": V_B_N("arrivedToDoubai"),
            "FeesinAmericaStoragefee": V_B_N("FeesinAmericaStoragefee"),
            "FeesinAmericaCopartorIAAfee": V_B_N("FeesinAmericaCopartorIAAfee"),

            "FeesAndRepaidCostDubairepairCost": V_B_N("FeesAndRepaidCostDubairepairCost"),
            // "FeesAndRepaidCostDubaiFees": V_B_N("FeesAndRepaidCostDubaiFees"),
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
            // Math.floor(DataUpload.FeesAndRepaidCostDubaiFees) +
            Math.floor(DataUpload.FeesAndRepaidCostDubaiothers) +
            Math.floor(DataUpload.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost) +
            Math.floor(DataUpload.TransportationCostFromAmericaLocationtoDubaiGCostTranscost) +
            Math.floor(DataUpload.DubaiToIraqGCostTranscost) +
            Math.floor(DataUpload.DubaiToIraqGCostgumrgCost) +
            Math.floor(DataUpload.RaqamAndRepairCostinKurdistanrepairCost) +
            Math.floor(DataUpload.RaqamAndRepairCostinKurdistanothers);

        let DoneBalance = TotalCosts - TotalCurrentCosts;

        const UpdatedLoan =
            Math.floor(DataUpload.FeesinAmericaCopartorIAAfee) +
            Math.floor(DataUpload.FeesinAmericaStoragefee) +
            Math.floor(DataUpload.PricePaidbid);


        const CurrentPrice = Math.floor(cars.carDetail.carCost.price)
        const updatePrice = Math.floor(DataUpload.Price)





        if (cars.carDetail.userGiven?.userName != null && CurrentPrice != updatePrice) {

            const ResellerId = cars.carDetail.userGiven._id
            const ResellerBalance = Math.floor(cars.carDetail.userGiven.TotalBals)
            const DonePrice = updatePrice - CurrentPrice

            try {
                const reseller = await Axios.patch(`users/${ResellerId}`, { TotalBals: ResellerBalance + DonePrice }, auth)
                const balReseller = await Axios.post("/bal/",
                    {
                        amount: DonePrice,
                        action: "Update",
                        carId: cars.carDetail._id,
                        userId: ResellerId,
                        note: "Updating price of car"
                    }, auth)

                axios.all([reseller, balReseller]).then(() => {
                    toast.success("price updated")
                })

            } catch {
                toast.error("error to update price  *");
            }
        }


        if (cars.carDetail?.userQarzId != null && UpdatedLoan != TotalLoan) {

            const QarzId = cars?.userQarzId
            const QarzRes = await Axios.get(`users/detail/${QarzId}`, auth)
            const QarzBalance = Math.floor(QarzRes.data.userDetail.TotalBals)
            const DoneLoan = UpdatedLoan - TotalLoan


            try {
                const Qarz = await Axios.patch(`users/${QarzId}`, { TotalBals: QarzBalance + DoneLoan }, auth)
                const balQarz = await Axios.post("/bal/",
                    {
                        amount: DoneLoan,
                        action: "Update",
                        carId: cars.carDetail._id,
                        userId: QarzId,
                        note: "Updating Rent car",
                    }, auth)

                axios.all([Qarz, balQarz]).then(() => {
                    toast.success("Loan updated")
                })

            } catch {
                toast.error("error to update Loan  *");
            }


        }

        if (DataUpload.Tobalance == "Rent") {

            try {
                const id = router.query._id
                const res = await Axios.patch(`/cars/${id}`, DataUpload, auth,)


                toast.success("Data updated successfully");
                setRenewPage(true)


            } catch (err) {
                toast.error("error to updated car")
            }
            setDetpage(1)
        }


        if (DataUpload.Tobalance == "Cash" && DataUpload.IsSold == 'false') {

            try {
                const UDetails = await Axios.get(`/users/detail/${SessionID}`, auth,)

                const DataBalance = Math.floor(UDetails.data.userDetail.TotalBals)


                if (DoneBalance <= DataBalance) {
                    try {

                        await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - DoneBalance }, auth,)

                        await Axios.post("/bal/",
                            {
                                amount: -DoneBalance,
                                action: "Update",
                                carId: cars.carDetail._id,
                                userId: SessionID,
                            }, auth,)

                        try {
                            const id = router.query._id
                            const res = await Axios.patch(`/cars/${id}`,
                                DataUpload
                                , auth,)


                            toast.success("Data updated successfully");
                            setRenewPage(true)


                        } catch (err) {
                            toast.error("error to updated car *")
                        }
                        setDetpage(1)


                        toast.success("Your Balance Now= " + (DataBalance - DoneBalance) + " $");
                        setRenewPage(true)
                            ;
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

        if (DataUpload.Tobalance == "Cash" && DataUpload.IsSold == 'true') {

            try {
                const UDetails = await Axios.get(`/users/detail/${SessionID}`, auth,)

                const DataBalance = UDetails.data.userDetail.TotalBals
                const DonePrice = DoneBalance - (updatePrice - CurrentPrice)



                if (DonePrice <= DataBalance) {
                    try {

                        await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - DonePrice }, auth,)

                        await Axios.post("/bal/",
                            {
                                amount: -DonePrice,
                                action: "Update",
                                carId: cars.carDetail._id,
                                userId: SessionID
                            }, auth,)

                        try {
                            const id = router.query._id
                            const res = await Axios.patch(`/cars/${id}`,
                                DataUpload
                                , auth,)


                            toast.success("Data updated successfully");
                            setRenewPage(true)


                        } catch (err) {
                            toast.error("error to updated car *")
                        }
                        setDetpage(1)

                        toast.success("Your Balance Now= " + (DataBalance - DonePrice) + " $");
                        setRenewPage(true)
                            ;
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

    }



    const handleSoldCars = async (bool) => {

        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }
        if (cars.carDetail.carCost.isSold == true) {


            try {

                const UDetails = await Axios.get(`/users/detail/${SessionID}`, auth,)
                const DataBalance = UDetails.data.userDetail.TotalBals

                if (cars.carDetail.carCost.price <= DataBalance) {
                    try {
                        const id = router.query._id

                        const res1 = await Axios.patch('/users/' + SessionID, { "TotalBals": DataBalance - cars.carDetail.carCost.price }, auth,)
                        const res2 = await Axios.patch(`/cars/${id}`, {
                            "IsSold": bool
                        }, auth,)
                        const res3 = await Axios.post("/bal/", {
                            amount: -cars.carDetail.carCost.price,
                            action: "Retrieved",
                            carId: cars.carDetail._id,
                            userId: SessionID,
                            note: Note

                        }, auth,)

                        await axios.all([res1, res2, res3]).then(() => {
                            toast.success("Your Balance Now= " + (DataBalance - cars.carDetail.carCost.price) + " $");
                            toast.success("Car Retrieved")
                            setRenewPage(true)

                            setRenewPage(true)

                        }).catch(() => {
                            toast.error("something went to wrong *")

                        })




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
                const UDetails = await Axios.get(`/users/detail/${SessionID}`, auth,)

                const DataBalance = UDetails.data.userDetail.TotalBals


                try {

                    await Axios.patch(`/users/${SessionID}`, { "TotalBals": DataBalance + cars.carDetail.carCost.price }, auth,)

                    toast.success("Your Balance Now= " + (DataBalance + cars.carDetail.carCost.price) + " $");

                    try {
                        const id = router.query._id

                        await Axios.patch(`/cars/${id}`,
                            {
                                "IsSold": bool
                            }, auth,)


                        await Axios.post("/bal/",
                            {
                                amount: cars.carDetail.carCost.price,
                                action: "Sold",
                                carId: cars.carDetail._id,
                                userId: SessionID,
                                note: Note

                            }, auth,)

                        toast.success("Car Sold")
                        setRenewPage(true)


                    } catch (err) {

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
            const auth = {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            }


            const userDetails = await Axios.get(`users/detail/${UserID}`, auth)

            const TotaluserBalnce = await userDetails.data.userDetail.TotalBals
            const TotalCurrentPrice = await cars.carDetail.carCost.price
            const DoneBalance = TotaluserBalnce + TotalCurrentPrice

            const userres = await Axios.patch(`/users/${UserID}`, { "TotalBals": DoneBalance }, auth)
            const Resellerres = await Axios.patch(`reseller/{"userId":"${UserID}", "carId":"${id}"}`, {}, auth)
            const SellCar = await Axios.patch(`/cars/${id}`, {
                "IsSold": true
            }, auth,)
            const balres = await Axios.post("/bal/", {
                amount: TotalCurrentPrice,
                action: "gived",
                carId: id,
                userId: UserID,
                isSoled: cars.carDetail.isSold,
                note: Note

            }, auth)
            axios.all([userres, Resellerres, balres, SellCar]).
                then(() => {
                    toast.success("Reseller Balance Now = " + DoneBalance + " $");
                    toast.success("Car gived to Reseller Successfully")
                    setRenewPage(true)


                }).catch(() => {
                    toast.error("something went to wrong *")
                })

        }
        catch (err) {
            toast.error("error to Give Car *")
        }



    }



  const  handleUpdateImage = async () => {
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }



        // save image from canvas
        if (typeof document != "undefined") {
            var canvas = document.getElementById("canvas");
            let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            setCarDamage(imageBlob)
        }

        //! change  data and Image to FormData ----------------------------------

        let FormDataCar = new FormData();

        for (let key in DataUpload) {
            FormDataCar.append(key, DataUpload[key]);
        }

        for (let i = 0; i < pictureandvideorepair.length; i++) {

            FormDataCar.append("Pictureandvideorepair", pictureandvideorepair[i], `image${i}.jpeg`);

        }


        for (let i = 0; i < pictureandvideodamage.length; i++) {

            FormDataCar.append("Pictureandvideodamage", pictureandvideodamage[i], "image.jpeg");

        }

        CarDamage != '' && FormDataCar.append("CarDamage", CarDamage, "image.png");



        Axios.patch(`/cars`, {



        }, auth)

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
            setRenewPage(false)
        }

    }, [detpage, session.status, RenewPage])

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
            doc.addImage(`${baseURL}/${cars?.carDetail?.carDamage?.[0]?.filename}`, 'png', -12, -89, 226, 149 + 12, null, null, 270)
            :
            doc.addImage('/Sedan.png', 'png', -12, -89, 226, 149 + 12, null, null, 270)

        doc.addImage('/Detaile_Car_Damage.png', 'png', 1, 1, 210, 70)

        doc.addImage('/Detail_Taible_Damage.png', 'png', 148, 70, 0, 226)

        doc.save("Car_Damage.pdf");
    }


    const renderVideo = (item) => {


        return (

            <div className="play-button  ">
                {item.taramash != "false" ?
                    <div className=' flex justify-center'>
                        <TransformWrapper  >
                            <TransformComponent>
                                <video controls
                                    className="w-[1920px]">
                                    <source
                                        src={`${baseURL}${item.taramash}`} type="video/mp4" />

                                </video >
                            </TransformComponent>
                        </TransformWrapper>
                    </div >

                    :

                    <div className='play-button grow relative w-full h-full overflow-auto bg-cover flex   justify-center'>

                        <TransformWrapper   >
                            <TransformComponent>
                                <Image width={1920} height={1080}
                                    alt='SliderImage'
                                    objectFit="fill"
                                    className='image-gallery-image '
                                    crossOrigin="anonymous"
                                    src={item.original}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>

                }

            </div >

        );

    }


    const renderThumbInner = (item) => {

        return (
            <div className="">
                {item.taramash != "false" ?
                    <div className=''>
                        <video controls={false}
                            className="">
                            <source
                                src={`${baseURL}${item.taramash}`} type="video/mp4" />
                        </video >
                    </div >
                    :
                    <div className=' w-full'>
                        <Image width={1920} height={1080}
                            alt='SliderImage'
                            // sizes="100%"
                            // objectFit="cover"
                            className='image-gallery-image '
                            src={item.thumbnail}
                        />

                    </div>
                }

            </div >
        );

    }



    const datarepaire = []
    const datadamage = []

    cars.carDetail?.pictureandvideorepair?.map((img, index) => {
        datarepaire.push({
            "original": `${baseURL}${img.filename}`,
            "thumbnail": `${baseURL}${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo,
            "renderThumbInner": renderThumbInner,


        })

    })
    cars.carDetail?.pictureandvideodamage?.map((img, index) => {
        datadamage.push({
            "original": `${baseURL}${img.filename}`,
            "thumbnail": `${baseURL}${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo,
            "renderThumbInner": renderThumbInner,



        })
    })
    cars.carDetail?.carDamage?.map((img, index) => {
        datadamage.push({
            "original": `${baseURL}${img.filename}`,
            "thumbnail": `${baseURL}${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo,
            "renderThumbInner": renderThumbInner,


        })
    })








    return (
        <div className=" container mx-auto">
            <Head>
                <title>{l.detail}</title>
            </Head>

            < >
                <ToastContainer

                    draggablePercent={60}
                />

                <div className="navbar mb-16  flex justify-between scrollbar-hide  max-w-8xl overflow-auto space-x-2  lg:w-[calc(100%-1rem)]  mt-2  bg-opacity-5    backdrop-blur-md bg-slate-300 rounded-2xl   ">


                    {/* <button className="btn btn-success" onClick={() => { setDetpage(3) }}>{l.update}</button> */}
                    <label htmlFor="Update-modal" className="btn btn-success" >{l.update}</label>


                    <label htmlFor="my-modal-3" className="btn btn-error modal-button">{l.delete}</label>
                    <label htmlFor="give-modal-3" className="btn btn-info modal-button">{l.give}</label>
                    {(cars.carDetail.carCost.isSold == true) && <label htmlFor="sold-modal-3" className="btn btn-warning modal-button">{l.retrieve}</label>}
                    {cars.carDetail.carCost.isSold == false && <label htmlFor="sell-modal-3" className="btn btn-warning modal-button">{l.sell}</label>}

                    {(cars.carDetail.tire == "Public") ? <label htmlFor="Public-modal-3" className="btn btn-accent modal-button">{l.public}</label>
                        : <label htmlFor="Private-modal-3" className="btn btn-error modal-button">{l.private}</label>}


                    <label className="btn btn-outline modal-button" onClick={Doc_2_pdf}>PDF</label>



                </div>
                {/* //^ header */}
                <div>



                    <input type="checkbox" id="Update-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="Update-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h3 className="  text-center"><FontAwesomeIcon icon={faWrench} className="text-center text-5xl  text-green-500" /></h3>
                            <p className="py-4">do you want update text or image</p>
                            <div className="space-x-5 text-end">
                                <div></div>
                                {/* <button className="btn btn-success" onClick={() => { setDetpage(3) }}>{l.update}</button> */}
                                <label htmlFor="Update-modal" className="btn btn-success" onClick={() => { setDetpage(3) }} >{l.text}</label>
                                <label htmlFor="Update-modal" className="btn btn-info" onClick={() => { setImageUpdatePage(2) }} >{l.image}</label>

                            </div>
                        </div>

                    </div>





                    <input type="checkbox" id="Public-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal ">
                        <div className="modal-box relative">
                            <label htmlFor="Public-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faLock} className=" text-5xl text-red-700" />  </h3>

                            <p className=" py-4">{l.publicmsg}</p>

                            <div className=" space-x-10">
                                <label htmlFor="Public-modal-3" className="btn   btn-accent" onClick={() => {
                                    handleVisiblity("Private")
                                }}
                                >{l.yes}</label>
                                <label htmlFor="Public-modal-3" className="btn btn-error">{l.no}</label>
                            </div>
                        </div>
                    </div>



                    <input type="checkbox" id="Private-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal ">
                        <div className="modal-box relative">
                            <label htmlFor="Private-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faLockOpen} className=" text-5xl text-green-700" />  </h3>

                            <p className=" py-4">{l.Privatemsg}</p>

                            <div className=" space-x-10">
                                <label htmlFor="Private-modal-3" className="btn   btn-accent" onClick={() => {
                                    handleVisiblity("Public")
                                }}
                                >{l.yes}</label>
                                <label htmlFor="Private-modal-3" className="btn btn-error">{l.no}</label>
                            </div>
                        </div>
                    </div>








                    <input type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal ">
                        <div className="modal-box relative">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faTrashAlt} className=" text-5xl text-red-700" />  </h3>

                            {(cars.carDetail.userGiven?.userName != null || cars?.isPaid == false) && <div className=" flex justify-center w-full text-center my-5" >
                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>this car gived to reseller or it is not paid</span>
                                    </div>
                                </div>
                            </div>}

                            <p className=" py-4">{l.deletemsg}</p>

                            <div className=" space-x-10">
                                <label className="btn btn-error " disabled={(cars.carDetail.userGiven?.userName == null && cars?.isPaid != false) ? false : true} onClick={() => {
                                    (cars.carDetail.userGiven?.userName == null && cars?.isPaid != false) &&
                                        handleDeleteCars()
                                }}
                                >{l.yes}</label>
                                <label htmlFor="my-modal-3" className="btn btn-accent ">{l.no}</label>
                            </div>
                        </div>
                    </div>



                    <input type="checkbox" id="give-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="give-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faPaperPlane} className=" text-5xl" />  </h3>
                            <p className="py-4">{l.givemsg}</p>

                            {(cars.carDetail.userGiven?.userName != null || cars.carDetail.carCost.isSold == true) && <div className=" flex justify-center w-full text-center" >

                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>car already gived to reseller or is Sold</span>
                                    </div>
                                </div>

                            </div>}
                            <div className="space-x-10">
                                <div className=" m-5 space-y-5 text-center">
                                    <select disabled={(cars.carDetail.userGiven?.userName != null || cars.carDetail.carCost.isSold == true) ? true : false}
                                        onChange={(e) => {
                                            setUserID(null)
                                            setChooseUser(e.target.value)
                                        }} type='select' defaultValue={"Select"} className="select select-info w-full max-w-xs">
                                        <option disabled value="Select" >{l.select}</option>
                                        <option value="Reseller_2" >{l.reseler}</option>

                                    </select>

                                    {(ChooseUser == "Reseller_2" && ChooseUser !== "" && cars.carDetail.userGiven?.userName == null && cars.carDetail.carCost.isSold == false) && <>
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

                                        <input type="text" onChange={(e) => { setNote(e.target.value) }} placeholder={l.note} className="input input-bordered input-info w-full max-w-xs" />
                                    </>
                                    }


                                </div>
                                <div className="flex justify-end">
                                    <label htmlFor="give-modal-3" className="btn btn-accent" disabled={(UserID != null && ChooseUser != '' && UserID != 'Select') ? false : true} onClick={
                                        ChooseUser == "Qarz_1" ? handleGiveToQarz : handleGiveToReseller

                                    }>{l.send}</label>
                                </div>

                            </div>
                        </div>
                    </div>






                    <input type="checkbox" id="sold-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="sold-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faArrowsRotate} className=" text-5xl" /></h3>
                            {cars.carDetail.userGiven?.userName != null && <div className=" flex justify-center w-full text-center my-5" >

                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>this car gived to reseller you cant retrieve it</span>
                                    </div>
                                </div>

                            </div>}

                            <p className="py-4">{l.soldmsg}</p>
                            {cars.carDetail.userGiven?.userName == null && <div className="text-center my-5">
                                <input type="text" onChange={(e) => { setNote(e.target.value) }} placeholder={l.note} className="input input-bordered   input-info w-full max-w-xs" />
                            </div>}
                            <div className="space-x-10">
                                <label htmlFor="sold-modal-3" className="btn btn-warning" disabled={cars.carDetail.userGiven?.userName == null ? false : true} onClick={() => {
                                    cars.carDetail.userGiven?.userName == null && handleSoldCars("false")
                                    setNote("")

                                }}>{l.yes}</label>
                                <label htmlFor="sold-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div>


                    <input type="checkbox" id="sell-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="sell-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faHandHoldingUsd} className=" text-5xl" /></h3>
                            {cars.carDetail.userGiven?.userName != null && <div className=" flex justify-center w-full text-center my-5" >

                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>this car gived to reseller you cant sell it</span>
                                    </div>
                                </div>

                            </div>}
                            <p className="py-4">{l.sellmsg}</p>
                            {cars.carDetail.userGiven?.userName == null && <div className="text-center my-5">
                                <input type="text" onChange={(e) => { setNote(e.target.value) }} placeholder={l.note} className="input input-bordered   input-info w-full max-w-xs" />
                            </div>}
                            <div className="space-x-10">

                                <label htmlFor="sell-modal-3" className="btn btn-warning" disabled={cars.carDetail.userGiven?.userName == null ? false : true} onClick={() => {
                                    cars.carDetail.userGiven?.userName == null && handleSoldCars("true")
                                    setNote("")

                                }
                                }>{l.yes}</label>
                                <label htmlFor="sell-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div>

                </div>





                {/* //^ Main */}


                <div className=" 4xl:grid-cols-2 xl:grid-cols-2 z-50 grid grid-cols-1 gap-2 m-auto mb-40 ">

                    <div className="pt-2.5">
                        <button className={`cursor-pointer h-[39px] w-[250px%] ltr:rounded-tl-lg rtl:rounded-tr-lg   border-[1px] border-[#1254ff] ${ImagePage == 1 ? "bg-[#1254ff] text-white" : "bg-white text-[#1254ff]"}  text-md  w-[50%] z-0`} onClick={() => { setImagePage(1) }}>{l.damageimg}</button>
                        <button className={`cursor-pointer h-[39px] w-[250px%] ltr:rounded-tr-lg rtl:rounded-tl-lg   border-[1px] border-[#1254ff] ${ImagePage == 2 ? "bg-[#1254ff] text-white" : "bg-white text-[#1254ff]"}  text-md  w-[50%] z-0`} onClick={() => { setImagePage(2) }}>{l.repairimg}</button>
                        <div className="" hidden={ImagePage == 1 ? false : true} >
                            <div hidden={ImageUpdatePage == 1 ? false : true}>
                                <ImageGallery
                                    thumbnails-swipe-vertical

                                    onErrorImageURL="/Video.svg"
                                    slideInterval={100}
                                    autoPlay={false}
                                    showPlayButton={false}
                                    showBullets={true}
                                    // useTranslate3D={true}
                                    lazyLoad={true}
                                    showThumbnails={true}
                                    items={datadamage}
                                    additionalClass={`  `}
                                    className=""
                                    useBrowserFullscreen={true}
                                    // onScreenChange={(e) => {
                                    //     setFullScreen(e)
                                    // }}
                                    renderRightNav={(onClick,) => {
                                        if (FullScreen) {
                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 right-5 top-1/2 fixed z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            );
                                        }
                                        else {

                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 right-2 top-1/2 absolute z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            );


                                        }
                                    }}
                                    renderLeftNav={(onClick) => {
                                        if (FullScreen) {
                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 left-5 top-1/2 fixed z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronLeft} />
                                                </button>
                                            );
                                        }
                                        else {

                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 left-2 top-1/2 absolute z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronLeft} />
                                                </button>
                                            );


                                        }
                                    }}

                                    renderFullscreenButton={
                                        (onClick, isFullscreen) => {

                                            if (isFullscreen) {
                                                return (
                                                    <button
                                                        className="btn btn-sm btn-circle right-2 top-2 fixed"
                                                        onClick={onClick}
                                                    >
                                                        <FontAwesomeIcon icon={faCompress} />
                                                    </button>
                                                );
                                            } else {
                                                return (
                                                    <button
                                                        className="btn btn-sm btn-circle right-2 top-2 absolute"
                                                        onClick={onClick}
                                                    >
                                                        <FontAwesomeIcon icon={faExpand} />
                                                    </button>
                                                );
                                            }
                                        }
                                    }
                                />
                            </div>
                            <div hidden={ImageUpdatePage == 2 ? false : true} >
                                <div className="grid grid-cols-5   space-x-2  w-full">
                                    {console.log(pictureandvideodamage)}
                                    {cars.carDetail?.pictureandvideodamage?.map((img, idx) => {
                                        return <>
                                            {img.mimetype == 'video/mp4' ?
                                                <div className="w-full h-20 overflow-hidden border-spacing-40 border-4 border-blue-400 flex justify-center" >
                                                    <video controls={false}
                                                        className="w-[144px]"
                                                        onClick={() => {
                                                            setpictureandvideodamage(old=>[...old, img.filename])

                                                        }}
                                                    >
                                                        <source
                                                            src={`${baseURL}${img.filename}`} type="video/mp4" />
                                                    </video >
                                                </div>
                                                :
                                                <div className="w-full h-20 overflow-hidden border-spacing-40 border-4 border-blue-400 flex justify-center items-center" >
                                                    <Image width={100} height={100}
                                                        alt='SliderImage'
                                                        objectFit="fill"
                                                        className='cursor-pointer text-center '
                                                        src={`${baseURL}${img.filename}`}
                                                        onClick={() => {
                                                            setpictureandvideodamage(old=>[...old, img.filename])

                                                        }}
                                                    />
                                                </div>

                                            }
                                        </>
                                    })}

                                </div>

                            </div>
                        </div>
                        <div className="" hidden={ImagePage == 2 ? false : true}>
                            <div hidden={ImageUpdatePage == 1 ? false : true}>

                                <ImageGallery
                                    thumbnails-swipe-vertical

                                    onErrorImageURL="/Video.svg"
                                    slideInterval={10000}
                                    autoPlay={false}
                                    showPlayButton={false}
                                    showBullets={true}
                                    // useTranslate3D={true}
                                    lazyLoad={true}
                                    // showThumbnails={FullScreen ? false : true}
                                    items={datarepaire}
                                    additionalClass={` overflow-auto `}
                                    className=""
                                    useBrowserFullscreen={true}
                                    // onScreenChange={(e) => {
                                    //     setFullScreen(e)
                                    // }}
                                    renderRightNav={(onClick,) => {
                                        if (FullScreen) {
                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 right-5 top-1/2 fixed z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            );
                                        }
                                        else {

                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 right-2 top-1/2 absolute z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            );


                                        }
                                    }}
                                    renderLeftNav={(onClick) => {
                                        if (FullScreen) {
                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 left-5 top-1/2 fixed z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronLeft} />
                                                </button>
                                            );
                                        }
                                        else {

                                            return (
                                                <button
                                                    className="bg-slate-300 opacity-60 left-2 top-1/2 absolute z-30 items-center w-5 h-10 rounded-full"
                                                    onClick={onClick}
                                                >
                                                    <FontAwesomeIcon icon={faChevronLeft} />
                                                </button>
                                            );


                                        }
                                    }}

                                    renderFullscreenButton={
                                        (onClick, isFullscreen) => {

                                            if (isFullscreen) {
                                                return (
                                                    <button
                                                        className="btn btn-sm btn-circle right-2 top-2 fixed"
                                                        onClick={onClick}
                                                    >
                                                        <FontAwesomeIcon icon={faCompress} />
                                                    </button>
                                                );
                                            } else {
                                                return (
                                                    <button
                                                        className="btn btn-sm btn-circle right-2 top-2 absolute"
                                                        onClick={onClick}
                                                    >
                                                        <FontAwesomeIcon icon={faExpand} />
                                                    </button>
                                                );
                                            }
                                        }
                                    }
                                />
                            </div>

                            <div hidden={ImageUpdatePage == 2 ? false : true} >
                                <Image width={100} height={100}
                                    alt='SliderImage'
                                    // objectFit="fill"
                                    className='  '
                                    // crossOrigin="anonymous"
                                    src={`/logo.png`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" p-2">
                        <div className="">
                            <button className={`cursor-pointer h-[39px] w-[250px%] ltr:rounded-tl-lg rtl:rounded-tr-lg   border-[1px] border-[#1254ff] ${detpage == 1 ? "bg-[#1254ff] text-white" : "bg-white text-[#1254ff]"}  text-md  w-[50%] z-0`} onClick={() => { setDetpage(1) }}>{l.info}</button>
                            <button className={`cursor-pointer h-[39px] w-[250px%] ltr:rounded-tr-lg rtl:rounded-tl-lg   border-[1px] border-[#1254ff] ${detpage == 2 ? "bg-[#1254ff] text-white" : "bg-white text-[#1254ff]"}  text-md  w-[50%] z-0`} onClick={() => { setDetpage(2) }}>{l.note}</button>
                        </div>
                        <div className={`overflow-auto overscroll-auto max-w-5xl px-5 ${ShowPage == 2 && " h-[580px]"} border border-t-0 border-gray-300 dark:border-gray-800 rounded-b-lg bg-white dark:bg-[#181A1B]`}>

                            <table className="table   table-compact w-full text-xs bg-whit dark:bg-[#181A1B]  ">
                                <thead className="">
                                    <tr>
                                        <th className="hidden"></th>
                                    </tr>
                                </thead>

                                <tbody className={` ${detpage !== 1 ? "hidden" : ""}`}>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.price} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.price}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.isSold} :</td>
                                        {cars.carDetail.carCost.isSold ? <td className=" text-end bg-white dark:bg-[#181A1B]" >Yes</td> :
                                            <td className=" text-end bg-white dark:bg-[#181A1B]"  >No</td>
                                        }
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.tocar} :</td>
                                        <td className="text-end bg-white dark:bg-[#181A1B] ">{cars.carDetail.tocar}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.tobalance} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.tobalance}</td>
                                    </tr>
                                    {/* <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.tire} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.tire}</td>
                                    </tr> */}
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.date} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.date}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.namecar} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.modeName}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.modelyear} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.model}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.vinnumber} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.VINNumber}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.mileage} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.mileage}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.color} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.color}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.wheeldrivetype} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.wheelDriveType}</td>
                                    </tr>


                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.arivedtoku}:</td>
                                        {cars.carDetail.arrivedToKurd ? <td className=" text-end bg-white dark:bg-[#181A1B]"  >Yes</td> :
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >No</td>
                                        }
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.arivedtodu}:</td>
                                        {cars.carDetail.arrivedToDoubai ? <td className=" text-end bg-white dark:bg-[#181A1B]"  >Yes</td> :
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >No</td>
                                        }
                                    </tr>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.pricepaidorcaratbid}:</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.pricePaidbid}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.storagefee} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.feesinAmericaStoragefee}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.copartoriaafee} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.feesinAmericaCopartorIAAfee}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]"> {l.uslocation} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.fromamericatodubaicost} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.fromamericatodubaigumrg} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}</td>
                                    </tr>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]"> {l.dubairepaircost} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.feesAndRepaidCostDubairepairCost}</td>
                                    </tr>
                                    {/* <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]"> {l.feesinadubai} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.feesAndRepaidCostDubaiFees}</td>
                                    </tr> */}
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]"> {l.feesAndRepaidCostDubaiothers} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.feesAndRepaidCostDubaiothers}</td>
                                    </tr>


                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.coccost} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.coCCost}</td>
                                    </tr>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.fromdubaitokurdistancosts} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.dubaiToIraqGCostTranscost}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.fromdubaitokurdistangumrg} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.dubaiToIraqGCostgumrgCost}</td>
                                    </tr>




                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.numberinkurdistan} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.raqamAndRepairCostinKurdistanRaqam}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.repaircostinkurdistan} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost}</td>
                                    </tr>


                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.fromdubaitokurdistanothers} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers}</td>
                                    </tr>







                                </tbody>
                                <tbody ref={InputUpdate} className={`${detpage !== 3 ? "hidden" : ""} `}>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.price} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="Price" type="number" placeholder={l.price} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.price} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.isSold} :</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <select disabled name="IsSold" defaultValue={cars.carDetail.carCost.isSold} className="select select-info select-sm w-full max-w-xs">
                                                <option value={cars.carDetail.carCost.isSold} >{cars.carDetail.carCost.isSold ? l.yes : l.no}</option>
                                            </select>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.tocar} :</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <select disabled name="Tocar" defaultValue={cars.carDetail.tocar} className="select select-info select-sm w-full max-w-xs">
                                                <option value="Sedan">Sedan</option>
                                                <option value="SUV">SUV</option>
                                                <option value="PickUp">PickUp</option>

                                            </select>



                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.tobalance} :</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <select disabled name="Tobalance" defaultValue={cars.carDetail.tobalance} className="select select-info select-sm w-full max-w-xs">
                                                <option value="Cash"> {l.cash} </option>
                                                <option value="Loan" > {l.loan} </option>
                                                <option value="Rent" > {l.rent} </option>

                                            </select>

                                        </td>
                                    </tr>
                                    {/* <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.tire} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="Tire" type="text" placeholder={l.tire} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.tire} />

                                        </td>
                                    </tr> */}
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.date} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="Date" type="Date" placeholder="Type here" className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.date} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]"> {l.namecar} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="ModeName" type="text" placeholder={l.namecar} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.modeName} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.modelyear} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="Model" type="number" placeholder={l.modelyear} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.model} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.vinnumber} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="VINNumber" type="text" placeholder={l.vinnumber} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.VINNumber} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.mileage} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="Mileage" type="text" placeholder={l.mileage} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.mileage} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.color} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="Color" type="text" placeholder={l.color} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.color} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.wheeldrivetype} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="WheelDriveType" type="text" placeholder={l.wheeldrivetype} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.wheelDriveType} />
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.arivedtoku}:</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <select name="arrivedToKurd" defaultValue={cars.carDetail.arrivedToKurd} className="select select-info select-sm w-full max-w-xs">
                                                <option value={true} >Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.arivedtodu}:</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <select name="arrivedToDoubai" defaultValue={cars.carDetail.arrivedToDoubai} className="select select-info select-sm w-full max-w-xs">
                                                <option value={true} >Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.pricepaidorcaratbid}:</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="PricePaidbid" type="number" placeholder={l.pricepaidorcaratbid} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.pricePaidbid}

                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.storagefee} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="FeesinAmericaStoragefee" type="number" placeholder={l.storagefee} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesinAmericaStoragefee}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.copartoriaafee} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="FeesinAmericaCopartorIAAfee" type="number" placeholder={l.copartoriaafee} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesinAmericaCopartorIAAfee}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]"> {l.uslocation} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostLocation" type="text" placeholder={l.uslocation} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.fromamericatodubaicost} :</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostTranscost" type="number" placeholder={l.fromamericatodubaicost} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.fromamericatodubaigumrg} :</td>
                                        <td className="dark:bg-[#181a1b]">
                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost" type="number" placeholder={l.fromamericatodubaigumrg} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]"> {l.dubairepaircost} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="FeesAndRepaidCostDubairepairCost" type="number" placeholder={l.dubairepaircost} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubairepairCost}
                                            />
                                        </td>
                                    </tr>
                                    {/* <tr className="">
                                        <td className="dark:bg-[#181a1b]"> {l.feesinadubai} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="FeesAndRepaidCostDubaiFees" type="number" placeholder={l.feesinadubai} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubaiFees}
                                            />
                                        </td>
                                    </tr> */}
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]"> {l.feesAndRepaidCostDubaiothers} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="FeesAndRepaidCostDubaiothers" type="number" placeholder={l.feesAndRepaidCostDubaiothers} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubaiothers}
                                            />
                                        </td>
                                    </tr>


                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.coccost} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="CoCCost" type="number" placeholder={l.coccost} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.coCCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.fromdubaitokurdistancosts} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="DubaiToIraqGCostTranscost" type="number" placeholder={l.fromdubaitokurdistancosts} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.dubaiToIraqGCostTranscost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.fromdubaitokurdistangumrg} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="DubaiToIraqGCostgumrgCost" type="number" placeholder={l.fromdubaitokurdistangumrg} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.dubaiToIraqGCostgumrgCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.numberinkurdistan} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="RaqamAndRepairCostinKurdistanRaqam" type="number" placeholder={l.numberinkurdistan} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanRaqam} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.repaircostinkurdistan} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="RaqamAndRepairCostinKurdistanrepairCost" type="number" placeholder={l.repaircostinkurdistan} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td className="dark:bg-[#181a1b]">{l.fromdubaitokurdistanothers} :</td>
                                        <td className="dark:bg-[#181a1b]">

                                            <input name="RaqamAndRepairCostinKurdistanothers" type="number" placeholder={l.fromdubaitokurdistanothers} className="input input-info input-sm w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="dark:bg-[#181a1b] text-center">
                                            <button type="button" className="btn btn-error" onClick={() => { setDetpage(1) }}>{l.cancel}</button>
                                        </td>
                                        <td className="dark:bg-[#181a1b] text-center">
                                            <button type="submit" className="btn btn-success" onClick={

                                                handleUpdateCars
                                            } >{l.update}</button>
                                        </td>
                                    </tr>



                                </tbody>
                            </table>

                            <div className={`${detpage !== 2 ? "hidden" : ""} overflow-hidden p-3 space-y-8  pb-20 [line-break: auto] bg-white dark:bg-[#181A1B]  `}>
                                <div className="link-accent mt-3 text-xl"> {l.DubaiNote} : </div>
                                <div>{cars.carDetail.carCost.feesAndRepaidCostDubainote}</div>
                                <div className="link-accent mt-3 text-xl"> {l.KurdistanNot}: </div>
                                <div>{cars.carDetail.carCost.raqamAndRepairCostinKurdistannote}</div>


                            </div>
                        </div>
                        <div className="text-center">
                            <button className="" onClick={() => {
                                ShowPage == 1 && setShowPage(2)
                                ShowPage == 2 && setShowPage(1)
                            }}>{l.show}{ShowPage == 2 && <span>▲</span>}{ShowPage == 1 && <span>▼</span>}</button>
                        </div>
                    </div>

                    <div className=" grid grid-cols-1 gap-12">
                        <div className=" h-[300px] min-w-[50px] max-w-[420px] shadow mx-2 mt-1 ">

                            <div className=" bg-[#1254ff] rounded-t-lg h-[40px] text-white ">
                                <div className=" flex items-center h-full px-6">{l.price}</div>

                            </div>
                            <div className="w-full h-full  border border-t-0 border-gray-300 dark:border-gray-800  rounded-b-lg  bg-white dark:bg-[#181A1B] px-5 ">
                                <div className=" divide-y">

                                    <div className="text-start flex justify-between">
                                        <dir className="text-start flex items-center p-0">{l.price}</dir>
                                        <dir className=" p-0 text-xl">{cars.carDetail.price}$</dir>

                                    </div>
                                    <div className="text-start flex justify-between">
                                        <dir className="text-start flex items-center p-0">{l.allcosts}</dir>
                                        <dir className=" p-0 text-xl">{TotalCurrentCosts}$</dir>

                                    </div>

                                    <div className="text-start flex justify-between">
                                        <dir className="text-start flex items-center p-0">{l.loan}</dir>
                                        <dir className=" p-0 text-xl">{cars.carDetail.tobalance == "Rent" ? TotalLoan : 0}$</dir>

                                    </div>

                                    <div className="text-start flex justify-between">
                                        <dir className="text-start flex items-center p-0">{l.profit}</dir>
                                        <dir className=" p-0 text-xl">{cars.carDetail.price - TotalCurrentCosts}$</dir>

                                    </div>



                                </div>


                            </div>
                        </div>

                        {/* <div className=" h-[100px] min-w-[200px max-w-[420px] shadow mx-2 mt-1">

                            <div className=" bg-[#1254ff] rounded-t-lg h-[40px] text-white ">
                                <div className=" flex items-center h-full px-6">{l.price}</div>

                            </div>
                            <div className="w-full h-full  border border-t-0 border-gray-300 dark:border-gray-800  rounded-b-lg  bg-white dark:bg-[#181A1B] px-5 ">
                                <div className=" divide-y">

                                    <div className="text-start flex justify-between">
                                        <dir className="text-start flex items-center p-0">{l.price}</dir>
                                        <dir className=" p-0 text-2xl">{cars.carDetail.price}$</dir>

                                    </div>


                                </div>


                            </div>
                        </div> */}
                    </div>


                </div>







            </>

        </div >
    );

}
Detail.Layout = AdminLayout;

export default Detail;