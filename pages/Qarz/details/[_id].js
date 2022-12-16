import axios from "axios"
import Axios, { baseURL } from "../../api/Axios"
import Head from 'next/head'
import useLanguage from '../../../Component/language';
import QarzLayout from '../../../Layouts/QarzLayout';
import Image from "next/image";
import ImageGallery from 'react-image-gallery';
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";

export const getServerSideProps = async (context) => {


    const session = await getSession({ req: context.req })


    if (!session || session.userRole != "Qarz") {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        }
    }


    const _id = context.params?._id;

    const response = await Axios.get('/qarz/details/' + _id, {
        headers: {
            Authorization: `Bearer ${session.Token}`
        }
    })
    const data = await response.data
    return {
        props: { cars: data },

    }



}





const Detail = ({ cars }) => {

    const l = useLanguage();
    const router = useRouter()
    const { status } = useSession()
    const [ImagePage, setImagePage] = useState(1);


    if (status == "unauthenticated") {
        router.push('/');
    }


    if (status == "loading") {
        return (<>
            <Head>
                <title >{l.detail}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>
            <div className="text-center">
                {l.loading}
            </div>
        </>)

    }


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
    if (status == "authenticated") {


        return (
            <>
                <Head>
                    <title>{l.detail}</title>
                </Head>

                < >

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
                                            <td className="  w-[50%]  bg-[#1254ff] py-4 text-center " > </td>
                                            <td className="  w-[50%]  bg-[#1254ff] py-4 text-center " > </td>

                                        </tr>
                                    </thead>
                                    <tbody  >


                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.price} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.price}</td>
                                        </tr>

                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.namecar} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.modeName}</td>
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.wheeldrivetype} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.wheelDriveType}</td>
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.isSold} :</td>
                                            {cars.carDetail.isSold ? <td className="text-green-700 text-end bg-white dark:bg-[#181A1B]">{l.yes}</td> : <td className="text-red-700 text-end bg-white dark:bg-[#181A1B]">{l.no}</td>}
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.arivedtoku} :</td>
                                            {cars.carDetail.arrivedToKurd ? <td className="text-green-700 text-end bg-white dark:bg-[#181A1B]">{l.yes}</td> : <td className="text-red-700 text-end bg-white dark:bg-[#181A1B]">{l.no}</td>}
                                        </tr>

                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.arivedtodu} :</td>
                                            {cars.carDetail.arrivedToDoubai ? <td className="text-green-700 text-end bg-white dark:bg-[#181A1B]">{l.yes}</td> : <td className="text-red-700 text-end bg-white dark:bg-[#181A1B]">{l.no}</td>}
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.modelyear} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.model}</td>
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.tocar} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.tocar}</td>
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.tire} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.tire}</td>
                                        </tr>

                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.vinnumber} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.VINNumber}</td>
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.mileage} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.mileage}</td>
                                        </tr>
                                        <tr className="">
                                            <td className=" text-start bg-white dark:bg-[#181A1B]" >{l.color} :</td>
                                            <td className=" text-end bg-white dark:bg-[#181A1B]" >{cars.carDetail.color}</td>
                                        </tr>

                                    </tbody>

                                </table>
                            </div>


                        </div>

                    </div>







                </>

            </>
        );
    }
}

Detail.Layout = QarzLayout;

export default Detail;