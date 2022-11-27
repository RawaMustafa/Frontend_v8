
import { useState } from "react"
import Axios, { baseURL } from "../../../../../api/Axios"
import Head from 'next/head'
import { useRouter } from 'next/router'
import useLanguage from '../../../../../../Component/language';
import Link from "next/link";
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../../../../../Layouts/AdminLayout';
import Image from "next/image";
import { ToastContainer, toast, } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import { getSession, useSession } from "next-auth/react";




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
    const _id = context.params?.id;

    const response = await Axios.get('/Reseller/details/' + _id, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session?.Token}`
        }
    },)
    const data = await response.data
    return {
        props: { cars: data, ID: _id },

    }



}





const Detail = ({ cars, ID }) => {

    const session = useSession();
    const router = useRouter()
    const [detpage, setDetpage] = useState(1);
    const l = useLanguage();



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

    const handleDeleteCar = async () => {
        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        }
        try {
            await Axios.delete(`/Reseller/${ID}`, auth)

            await Axios.post("/bal/", {
                // amount: TotalCurrentCosts,
                action: "Retrieved",
                carId: router?.query.id,
                userId: router?.query._id,
                isSoled: cars.carDetail.isSold ,

            }, auth)



            router.push(`/Dashboard/Balance/Reseller/${router?.query._id}`)

        } catch (err) {

            toast.error("Car not Retrieved")
        }

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
        <div className="container mx-auto">
            <Head>
                <title>{l.detail}</title>
            </Head>

            < >
                <ToastContainer
                    draggablePercent={60}
                />
                <div className="flex  w-full h-full p-4 justify-end    ">

                    <Link rel="noopener noreferrer" href={`/Dashboard/ListofCars/AllCars/${router.query.id}`}><a target="_blank" className="btn btn-info mx-10">{l.detail}</a></Link>
                    <label htmlFor="my-modal-3" className="btn btn-error modal-button">{l.retrieve}</label>

                    <input type="checkbox" id="my-modal-3" className="modal-toggle btn btn-error " />
                    <div className="modal  ">
                        <div className="modal-box relative ">
                            <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2 ">✕</label>
                            <h3 className="text-lg font-bold text-center"><FontAwesomeIcon icon={faTrashAlt} className="text-5xl text-red-700 " />  </h3>
                            <p className="py-4 ">{l.retrievemsg}</p>
                            <div className="space-x-10 ">
                                <label className="btn btn-error " onClick={handleDeleteCar}>{l.yes}</label>
                                <label htmlFor="my-modal-3" className="btn btn-accent ">{l.no}</label>
                            </div>
                        </div>
                    </div>




                </div>




                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto ">

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



                        <div className="overflow-x-auto max-w-5xl ">
                            <table className="table table-zebra w-full text-center  ">

                                <thead className="">
                                    <tr className=" text-center ">
                                        <td className="  w-[50%] bg-slate-500 text-center " > </td>
                                        <td className="  w-[50%] bg-slate-500 text-center " > </td>

                                    </tr>
                                </thead>
                                <tbody className={`${detpage !== 1 ? "hidden" : ""} `}>


                                    <tr className="">
                                        <td>{l.price} :</td>
                                        <td>{cars.carDetail.price}</td>
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
                                        <td>{l.tocar} :</td>
                                        <td>{cars.carDetail.tocar}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.tire} :</td>
                                        <td>{cars.carDetail.tire}</td>
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
                                        <td>{l.wheeldrivetype} :</td>
                                        <td>{cars.carDetail.wheelDriveType}</td>
                                    </tr>
                                    <tr className="">
                                        <td>{l.isSold} :</td>
                                        {cars.carDetail?.isSold ? <td>{l.yes}</td> : <td>{l.no}</td>}
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