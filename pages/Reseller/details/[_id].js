import axios from "axios"
import Axios, { baseURL } from "../../api/Axios"
import Head from 'next/head'
import useLanguage from '../../../Component/language';
import ResellerLayout from '../../../Layouts/ResellerLayout';
import Image from "next/image";
import ImageGallery from 'react-image-gallery';
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCompress, faDollar, faExpand } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";


export const getServerSideProps = async (context) => {


    const session = await getSession({ req: context.req })


    if (!session || session.userRole != "Reseller") {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        }
    }


    const _id = context.params?._id;

    const response = await Axios.get('/reseller/details/' + _id, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session?.Token}`
        }
    },)
    const data = await response.data
    return {
        props: { cars: data },

    }



}





const Detail = ({ cars }) => {

    const router = useRouter()
    const { status, data: session } = useSession()
    const [FullScreen, setFullScreen] = useState()
    if (status == "unauthenticated") {
        router.push('/');
    }
    const l = useLanguage();


    // const handlesell = async (bool) => {

    //     const auth = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': `Bearer ${session?.Token}`
    //         }
    //     }

    //     const UDetails = await Axios.get(`/users/detail/${session?.id}`, auth)

    //     const DataBalance = UDetails.data.userDetail.TotalBals
    //     if (DataBalance >= cars.carDetail.price || bool) {
    //         try {
    //             await Axios.patch(`/cars/${router.query._id}`,
    //                 {
    //                     IsSold: bool
    //                 }, auth)
    //             await Axios.patch('/users/' + session?.id,
    //                 {
    //                     "TotalBals": bool ? DataBalance + cars.carDetail.price : DataBalance - cars.carDetail.price
    //                 }, auth)

    //             await Axios.post("/bal/",
    //                 {
    //                     amount: bool ? cars.carDetail.price : -cars.carDetail.price,
    //                     action: bool ? "Sell" : "Retrieved",
    //                     userId: session?.id,
    //                     carId: cars.carDetail._id,
    //                     isSoled: bool

    //                 }, auth)

    //             toast.success("Your Balance Now= " + (bool ? DataBalance + cars.carDetail.price : DataBalance - cars.carDetail.price) + " $");


    //             router.reload()
    //         }
    //         catch {

    //         }
    //     } else {

    //         toast.error("your balance is not enough")

    //     }



    // }



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

            <ToastContainer
                draggablePercent={60}
            />
            < >
                {/* <div className="flex  w-full h-full p-4 justify-end    ">

                    {cars.carDetail?.isSold || <label htmlFor="my-modal-3" className="btn btn-accent modal-button">{l.sell}</label>}
                    {cars.carDetail?.isSold && <label htmlFor="my-modal-3" className="btn btn-error modal-button">{l.retrieve}</label>}

                    <input type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faDollar} className="text-5xl text-green-700 " />  </h3>
                            {cars.carDetail?.isSold || <p className="py-4 ">{l.sellmsg}</p>}
                            {cars.carDetail?.isSold && <p className="py-4 ">{l.retrievemsg}</p>}
                            <div className="  ">
                                <label className=" btn btn-accent " onClick={() => {
                                    cars.carDetail?.isSold && handlesell(false)
                                    cars.carDetail?.isSold || handlesell(true)
                                }}>{l.yes}</label>
                                <label htmlFor="my-modal-3" className=" btn btn-error mx-10">{l.no}</label>
                            </div>
                        </div>
                    </div>




                </div> */}

                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto container mx-auto">


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



                        <div className="overflow-x-auto max-w-5xl ">
                            <table className="table table-compact w-full text-center  ">

                                <thead className="">
                                    <tr className=" text-center ">
                                        <td className="  w-[50%] bg-[#1254ff] py-4 text-center " > </td>
                                        <td className="  w-[50%] bg-[#1254ff] py-4 text-center " > </td>

                                    </tr>
                                </thead>
                                <tbody  >


                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.price} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.price}</td>
                                    </tr>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.namecar} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.modeName}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.modelyear} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.model}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.tocar} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.tocar}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.tire} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.tire}</td>
                                    </tr>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.vinnumber} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.VINNumber}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.mileage} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.mileage}</td>
                                    </tr>
                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.color} :</td>
                                        <td className=" text-end bg-white dark:bg-[#181A1B]     ">{cars.carDetail.color}</td>
                                    </tr>

                                    <tr className="">
                                        <td className=" text-start bg-white dark:bg-[#181A1B]     ">{l.isSold} :</td>
                                        {cars.carDetail?.isSold ? <td className=" text-end bg-white dark:bg-[#181A1B]     ">{l.yes}</td> : <td className=" text-end bg-white dark:bg-[#181A1B]     ">{l.no}</td>}
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
Detail.Layout = ResellerLayout;

export default Detail;