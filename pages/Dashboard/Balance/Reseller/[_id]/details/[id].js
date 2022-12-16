
import { useState } from "react"
import Axios, { baseURL } from "../../../../../api/Axios"
import Head from 'next/head'
import { useRouter } from 'next/router'
import useLanguage from '../../../../../../Component/language';
import Link from "next/link";
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faChevronLeft, faChevronRight, faCompress, faExpand, faHandHoldingUsd, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../../../../../Layouts/AdminLayout';
import Image from "next/image";
import { ToastContainer, toast, } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import { getSession, useSession } from "next-auth/react";
import axios from "axios";




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
    const id = context.params?.id;

    const response = await Axios.get('/Reseller/details/' + id, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session?.Token}`
        }
    },)
    const data = await response.data

    return {
        props: { cars: data, ID: id },

    }



}





const Detail = ({ cars, ID }) => {

    const session = useSession();
    const router = useRouter()
    const [detpage, setDetpage] = useState(1);
    const [Note, setNote] = useState("");
    const [ImagePage, setImagePage] = useState(1);
    const [RenewPage, setRenewPage] = useState(false)
    const l = useLanguage();

    const [FullScreen, setFullScreen] = useState(false);



    const renderVideo = (item) => {


        return (
            <div className="play-button grow relative w-full h-full overflow-auto bg-cover">
                {item.taramash != "false" ?
                    <div className=' flex justify-center'>
                        <video controls
                            className="w-full bg-cover ">
                            <source
                                src={`${baseURL}${item.taramash}`} type="video/mp4" />
                        </video >
                    </div >
                    :
                    <div className='play-button grow relative w-full h-full overflow-auto bg-cover'>
                        <Image width={1920} height={1080}
                            alt='SliderImage'
                            sizes="100%"
                            objectFit="cover"
                            className='image-gallery-image '
                            crossOrigin="anonymous"
                            src={item.original}
                        />

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


    const handleRetrieveCar = async () => {
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }

        const UserId = router.query._id

        try {

            const resDetail = await Axios.get(`/users/detail/${UserId}`, auth)
            const ResellerBalance = resDetail.data.userDetail.TotalBals


            const userUpdate = await Axios.patch(`/users/${UserId}`, { TotalBals: ResellerBalance - cars?.carDetail.price }, auth)
            const userCar = await Axios.delete(`/Reseller/${ID}`, auth)
            await Axios.patch(`/cars/${cars.carDetail._id}`,
                {
                    "IsSold": false
                }, auth,)
            const userBale = await Axios.post("/bal/", {
                amount: -cars?.carDetail.price,
                action: "Retrieved",
                carId: router?.query.id,
                userId: router?.query._id,
                isSoled: false,
                note: Note

            }, auth)

            axios.all([userUpdate, userCar, userBale]).then(() => {

                router.push(`/Dashboard/Balance/Reseller/${router?.query._id}`)
            })

        } catch (err) {

            toast.error("Car not Retrieved")
        }

    }



    const handleSoldCars = async (bool) => {

        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }



        try {
            const id = router.query._id

            await Axios.patch(`/cars/${cars.carDetail._id}`,
                {
                    "IsSold": bool
                }, auth,)


            await Axios.post("/bal/",
                {
                    // amount: bool == "true" ? cars.carDetail.price : - cars.carDetail.price,
                    amount: 0,
                    action: bool == "true" ? "Sold" : "Retrieved",
                    carId: cars.carDetail._id,
                    userId: id,
                    isSoled: bool

                }, auth,)

            toast.success("Car Sold")
            router.reload()

        } catch (err) {

            toast.error("error to sold")

        }





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
        <div className="container mx-auto">
            <Head>
                <title>{l.detail}</title>
            </Head>

            < >
                <ToastContainer
                    draggablePercent={60}
                />
                <div className="flex  w-full h-full p-4 justify-end    ">

                    {/* {(cars.carDetail.isSold == true) && <label htmlFor="sold-modal-3" className="btn btn-warning modal-button">{l.retrieve}</label>}
                    {cars.carDetail.isSold == false && <label htmlFor="sell-modal-3" className="btn btn-warning modal-button">{l.sell}</label>} */}



                    {/* <input type="checkbox" id="sold-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="sold-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faArrowsRotate} className=" text-5xl" /></h3>
                            <p className="py-4">{l.soldmsg}</p>
                            <div className="space-x-10">
                                <label htmlFor="sold-modal-3" className="btn btn-warning" onClick={() => { handleSoldCars("false") }}>{l.yes}</label>
                                <label htmlFor="sold-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div> */}


                    {/* <input type="checkbox" id="sell-modal-3" className="modal-toggle btn btn-error" />
                    <div className="modal">
                        <div className="modal-box relative">
                            <label htmlFor="sell-modal-3" className="btn btn-sm btn-circle right-2 top-2 absolute">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faHandHoldingUsd} className=" text-5xl" /></h3>

                            <p className="py-4">{l.sellmsg}</p>
                            <div className="space-x-10">

                                <label htmlFor="sell-modal-3" className="btn btn-warning" onClick={() => {
                                    handleSoldCars("true")

                                }
                                }>{l.yes}</label>
                                <label htmlFor="sell-modal-3" className="btn btn-error" >{l.no}</label>
                            </div>
                        </div>
                    </div> */}





                    <Link rel="noopener noreferrer" href={`/Dashboard/ListofCars/AllCars/${router.query.id}`}><a target="_blank" className="btn btn-info mx-10">{l.detail}</a></Link>
                    <label htmlFor="my-modal-3" className="btn btn-error modal-button">{l.retrieve}</label>

                    <input type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faTrashAlt} className="text-5xl text-red-700 " />  </h3>
                            <p className="py-4 ">{l.retrievemsg}</p>
                            <div className="text-center my-5">
                                <input type="text" placeholder={l.note} onChange={(e) => { setNote(e.target.value) }} className="input input-bordered input-info w-full max-w-xs" />
                            </div>
                            <div className="space-x-10 ">
                                <label className="btn btn-error " onClick={handleRetrieveCar}>{l.yes}</label>
                                <label htmlFor="my-modal-3" className="btn btn-accent ">{l.no}</label>
                            </div>
                        </div>
                    </div>

                </div>




                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto ">

                <div className="pt-2.5">
                        <button className={`cursor-pointer h-[39px] w-[250px%] ltr:rounded-tl-lg rtl:rounded-tr-lg   border-[1px] border-[#1254ff] ${ImagePage == 1 ? "bg-[#1254ff] text-white" : "bg-white text-[#1254ff]"}  text-md  w-[50%] z-0`} onClick={() => { setImagePage(1) }}>{l.damageimg}</button>
                        <button className={`cursor-pointer h-[39px] w-[250px%] ltr:rounded-tr-lg rtl:rounded-tl-lg   border-[1px] border-[#1254ff] ${ImagePage == 2 ? "bg-[#1254ff] text-white" : "bg-white text-[#1254ff]"}  text-md  w-[50%] z-0`} onClick={() => { setImagePage(2) }}>{l.repairimg}</button>
                        <div className="" hidden={ImagePage == 1 ? false : true} >
                            <ImageGallery
                                thumbnails-swipe-vertical

                                onErrorImageURL="/Video.svg"
                                slideInterval={10000}
                                autoPlay={true}
                                // showPlayButton={false}
                                showBullets={true}
                                // useTranslate3D={true}
                                lazyLoad={true}
                                // showThumbnails={FullScreen ? false : true}
                                items={datadamage}
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
                        <div className="" hidden={ImagePage == 2 ? false : true}>
                            <ImageGallery
                                thumbnails-swipe-vertical

                                onErrorImageURL="/Video.svg"
                                slideInterval={10000}
                                autoPlay={true}
                                // showPlayButton={false}
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
                    </div>


                    <div className="  mb-40 mx-2  ">



                        <div className="overflow-x-auto max-w-5xl   ">

                            <table className="table table-compact w-full text-center  ">

                                <thead className="">
                                    <tr className=" text-center py-5 ">
                                        <td className="  w-[50%] bg-[#1254ff]  py-4   text-center " > </td>
                                        <td className="  w-[50%] bg-[#1254ff]  py-4 text-center " > </td>

                                    </tr>
                                </thead>
                                <tbody className={`${detpage !== 1 ? "hidden" : ""} `}>


                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.price} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.price}</td>
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
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.tocar} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.tocar}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.tire} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]">{cars.carDetail.tire}</td>
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
                                        <td className=" text-start bg-white dark:bg-[#181A1B]">{l.isSold} :</td>
                                        {cars.carDetail?.isSold ? <td className=" text-end bg-white dark:bg-[#181A1B]">{l.yes}</td> : <td className=" text-end bg-white dark:bg-[#181A1B]">{l.no}</td>}
                                    </tr>





                                </tbody>

                            </table>


                        </div>


                    </div>

                </div>







            </>

        </div>
    );

}
Detail.Layout = AdminLayout;

export default Detail;