
import { useMemo, useState, useEffect, useRef } from "react"
import axios from "axios"
import Axios, { baseURL } from '../../../api/Axios';

import Head from 'next/head'
import { useRouter } from 'next/router'
import useLanguage from '../../../../Component/language';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPaperPlane, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../../../Layouts/AdminLayout';
import Image from "next/image";
import { ToastContainer, toast, } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import { getSession } from "next-auth/react";
import jsPDF from "jspdf";



// export const getServerSidePaths = async () => {
//     const res = await Axios.get('http://localhost:4000/cars')

//     const posts = await res.data

//     return {

//         paths: posts.carDetail?.map((post) => {


//             return {
//                 params: { _id: post._id }
//             }
//         }),


//         fallback: false
//     };
// }




export const getServerSideProps = async (context) => {

    const session = await getSession({ req: context.req })



    if (!session || !session?.userRole == "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }
    const _id = context.params?._id;

    const response = await Axios.get('/cars/' + _id)
    const data = await response.data
    return {
        props: { cars: data },

    }



}


const Detail = ({ cars }) => {


    const InputUpdate = useRef()

    const router = useRouter()
    const [User, setUser] = useState([]);
    const [ChooseUser, setChooseUser] = useState("");
    const [UserID, setUserID] = useState(null);
    const [detpage, setDetpage] = useState(1);
    const l = useLanguage();



    const HandleAddCars = (e) => {




    }

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



    const handleDeleteCars = async () => {

        try {
            const id = router.query._id

            await Axios.delete("/cars/" + id)

            toast.error("Car has been Deleted")
            router.back()

        } catch (err) {

            toast.error("error to Deleting Car")


        }


    }


    const handleUpdateCars = async () => {

        const DataUpload = {


            "Price": V_B_N("Price"),
            "IsSold": V_B_N("IsSold"),
            "ModeName": V_B_N("ModeName"),
            "Model": V_B_N("Model"),
            "Color": V_B_N("Color"),
            "Mileage": V_B_N("Mileage"),
            "VINNumber": V_B_N("VINNumber"),
            "WheelDriveType": V_B_N("WheelDriveType"),

            "PricePaidbid": V_B_N("PricePaidbid"),
            "Tocar": V_B_N("Tocar"),
            "Tobalance": V_B_N("Tobalance"),
            "Tire": V_B_N("Tire"),
            "Date": V_B_N("Date"),
            Arrived: V_B_N("Arrived"),
            "FeesinAmericaStoragefee": V_B_N("FeesinAmericaStoragefee"),
            "FeesinAmericaCopartorIAAfee": V_B_N("FeesinAmericaCopartorIAAfee"),

            "FeesAndRepaidCostDubairepairCost": V_B_N("FeesAndRepaidCostDubairepairCost"),
            "FeesAndRepaidCostDubaiFees": V_B_N("FeesAndRepaidCostDubaiFees"),
            "FeesAndRepaidCostDubaiothers": V_B_N("FeesAndRepaidCostDubaiothers"),
            // "FeesAndRepaidCostDubainote": V_B_N("FeesAndRepaidCostDubainote"),

            "CoCCost": V_B_N("CoCCost"),

            "TransportationCostFromAmericaLocationtoDubaiGCostLocation": V_B_N("TransportationCostFromAmericaLocationtoDubaiGCostLocation"),
            "TransportationCostFromAmericaLocationtoDubaiGCostTranscost": V_B_N("TransportationCostFromAmericaLocationtoDubaiGCostTranscost"),
            "TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost": V_B_N("TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost"),

            "DubaiToIraqGCostTranscost": V_B_N("DubaiToIraqGCostTranscost"),
            "DubaiToIraqGCostgumrgCost": V_B_N("DubaiToIraqGCostgumrgCost"),

            "RaqamAndRepairCostinKurdistanrepairCost": V_B_N("RaqamAndRepairCostinKurdistanrepairCost"),
            "RaqamAndRepairCostinKurdistanRaqam": V_B_N("RaqamAndRepairCostinKurdistanRaqam"),
            "RaqamAndRepairCostinKurdistanothers": V_B_N("RaqamAndRepairCostinKurdistanothers"),
            // "RaqamAndRepairCostinKurdistannote": V_B_N("RaqamAndRepairCostinKurdistannote"),

        }


        try {
            const id = router.query._id
            const res = await Axios.patch(`/cars/${id}`,
                DataUpload
            )

            toast.done("success to updated car")
            router.reload()

        } catch (err) {


            toast.error("error to updated car")

        }
    }

    const handleSoldCars = async () => {
        try {
            const id = router.query._id

            await Axios.patch(`/cars/${id}`,
                {
                    "IsSold": true
                })

            toast.success("Car Sold")
            router.reload()

        } catch (err) {

            (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&
                toast.error("error to sold")


        }


    }


    const id = router.query._id
    useEffect(() => {

        const handleGetUsers = async () => {

            try {


                const res = await Axios.get(`/users`)

                setUser(res.data.userDetail)

            } catch (err) {

                (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&
                    toast.error("error to Get Users")
            }
        }

        handleGetUsers()
    }, [id])

    const handleGiveToReseller = async () => {

        try {
            const id = router.query._id
            await Axios.patch(`reseller/{"userId":"${UserID}", "carId":"${id}"}`)
            toast.success("Car Geven to Reseller Successfully")

        }
        catch (err) {

            (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&
                toast.error("error to Give Car")

        }



    }
    const handleGiveToQarz = async () => {


        try {
            const id = router.query._id

            await Axios.post(`/qarz/`, {
                userId: UserID,
                carId: id
            })

            toast.success("Car Geven to Qarz Successfully")

        }
        catch (err) {

            (err.response.status == 404 || err.response.status == 400 || err.response.status == 500 || err.response.status == 401 || err.response.status == 403 || err.response.status == 409) &&

                toast.error("error to Give Car to Qarz")

        }


    }




    const Doc_2_pdf = () => {

        const doc = new jsPDF("p", "mm", "a4");

        cars?.carDetail?.carDamage ?
            doc.addImage(`${baseURL}${cars?.carDetail?.carDamage?.[0]?.filename}`, 'PNG', -12, -89, 226, 149 + 12, null, null, 270)
            :
            doc.addImage('/Sedan.PNG', 'PNG', -12, -89, 226, 149 + 12, null, null, 270)

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

                <div className="navbar mb-16  flex justify-between  max-w-8xl    lg:w-[calc(100%-1rem)]  mt-2  bg-opacity-5    backdrop-blur-md bg-slate-300 rounded-2xl   ">


                    <button className="btn btn-success" onClick={() => { setDetpage(3) }}>{l.update}</button>
                    <label htmlFor="my-modal-3" className="btn btn-error modal-button">{l.delete}</label>
                    <label htmlFor="give-modal-3" className="btn btn-info modal-button">{l.give}</label>
                    <label htmlFor="sold-modal-3" className="btn btn-warning modal-button">{l.sold}</label>
                    <label className="btn btn-ghost modal-button" onClick={Doc_2_pdf}>PDF</label>




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
                                <div className="text-center m-5 space-y-10 ">
                                    <select onChange={(e) => {
                                        setUserID(null)
                                        setChooseUser(e.target.value)
                                    }} type='select' name="Tocar" defaultValue={cars.carDetail.tocar} className="select select-info w-full max-w-xs">
                                        <option value="" >Select</option>
                                        <option value="Qarz_1" >Qarz</option>
                                        <option value="Reseller_2" >Geve to Reseller</option>

                                    </select>
                                    {(ChooseUser == "Qarz_1" && ChooseUser !== "") &&

                                        <select onChange={(event) => { setUserID(event.target.value) }} onClick={(event) => { setUserID(event.target.value) }} className="select select-info w-full max-w-xs">
                                            <option disabled >Select Reseller</option>
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
                                    }


                                    {(ChooseUser == "Reseller_2" && ChooseUser !== "") &&
                                        <select onChange={(event) => { setUserID(event.target.value) }} onClick={(event) => { setUserID(event.target.value) }} className="select select-info w-full max-w-xs">
                                            <option disabled >Select Reseller</option>
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
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faHandHoldingUsd} className="text-5xl " /></h3>
                            <p className="py-4">{l.soldmsg}</p>
                            <div className="space-x-10">
                                <label htmlFor="sold-modal-3" className="btn btn-warning" onClick={handleSoldCars}>{l.yes}</label>
                                <label htmlFor="sold-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto z-50 ">


                    <ImageGallery
                        onErrorImageURL="/Video.svg"
                        slideInterval={10000}
                        autoPlay={true}
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
                                        <td>{l.fromamericatodubai} :</td>
                                        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost} :</td>
                                        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}</td>

                                    </tr>


                                    <tr className="">
                                        <td>{l.fromdubaitokurdistan} :</td>
                                        <td>{cars.carDetail.carCost.dubaiToIraqGCostTranscost}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.dubaiToIraqGCostgumrgCost} :</td>
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
                                        <td>{l.raqamAndRepairCostinKurdistanothers} :</td>
                                        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers}</td>
                                    </tr>







                                </tbody>
                                <tbody ref={InputUpdate} className={`${detpage !== 3 ? "hidden" : ""} `}>
                                    <tr className="">
                                        <td>{l.tocar} :</td>
                                        <td>

                                            <select onChange={(e) => { HandleAddCars(e) }} type='select' name="Tocar" defaultValue={cars.carDetail.tocar} className="select select-info w-full max-w-xs">
                                                <option >Sedan</option>
                                                <option >SUV</option>
                                                <option >PickUp</option>

                                            </select>


                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.tire} :</td>
                                        <td>

                                            <input onChange={(e) => { HandleAddCars(e) }} name="Tire" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.tire} />

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
                                        <td>{l.namecar} :</td>
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

                                            <select name="IsSold" defaultValue={cars.carDetail.carCost.isSold} className="select select-info w-full max-w-xs">
                                                <option value={true} >Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.tobalance} :</td>
                                        <td>
                                            <select name="Tobalance" defaultValue={cars.carDetail.tobalance} className="select select-info w-full max-w-xs">
                                                <option value="Cash"> {l.cash} </option>
                                                <option value="Loan" > {l.loan} </option>

                                            </select>

                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.pricepaidorcaratbid}:</td>
                                        <td>

                                            <input name="PricePaidbid" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.pricePaidbid} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.storagefee} :</td>
                                        <td>

                                            <input name="FeesinAmericaStoragefee" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesinAmericaStoragefee} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.copartoriaafee} :</td>
                                        <td>

                                            <input name="FeesinAmericaCopartorIAAfee" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesinAmericaCopartorIAAfee} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.dubairepaircost} :</td>
                                        <td>

                                            <input name="FeesAndRepaidCostDubairepairCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubairepairCost} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.feesinadubai} :</td>
                                        <td>

                                            <input name="FeesAndRepaidCostDubaiFees" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubaiFees} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.feesinadubai} :</td>
                                        <td>

                                            <input name="FeesAndRepaidCostDubaiothers" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.feesAndRepaidCostDubaiothers} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.coccost} :</td>
                                        <td>

                                            <input name="CoCCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.coCCost} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td> {l.uslocation} :</td>
                                        <td>

                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostLocation" type="text" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromamericatodubai} :</td>
                                        <td>
                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostTranscost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromamericatodubai} :</td>
                                        <td>
                                            <input name="TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromdubaitokurdistan} :</td>
                                        <td>

                                            <input name="DubaiToIraqGCostTranscost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.dubaiToIraqGCostTranscost} />
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.fromdubaitokurdistan} :</td>
                                        <td>

                                            <input name="DubaiToIraqGCostgumrgCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.dubaiToIraqGCostgumrgCost} />
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

                                            <input name="RaqamAndRepairCostinKurdistanrepairCost" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost} />
                                        </td>
                                    </tr>

                                    <tr className="">
                                        <td>{l.numberinkurdistan} :</td>
                                        <td>

                                            <input name="RaqamAndRepairCostinKurdistanothers" type="number" placeholder="Type here" className="input input-info w-full max-w-xs" defaultValue={cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers} />
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