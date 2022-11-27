
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
import { faDollar } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";


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
    if (status == "unauthenticated") {
        router.push('/');
    }
    const l = useLanguage();


    const handlesell = async (bool) => {

        const auth = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.Token}`
            }
        }

        const UDetails = await Axios.get(`/users/detail/${session?.id}`, auth)

        const DataBalance = UDetails.data.userDetail.TotalBals
        if (DataBalance >= cars.carDetail.price || bool) {
            try {
                await Axios.patch(`/cars/${router.query._id}`,
                    {
                        IsSold: bool
                    }, auth)
                await Axios.patch('/users/' + session?.id,
                    {
                        "TotalBals": bool ? DataBalance + cars.carDetail.price : DataBalance - cars.carDetail.price
                    }, auth)

                await Axios.post("/bal/",
                    {
                        amount: bool ? cars.carDetail.price : -cars.carDetail.price,
                        action: bool ? "Sell" : "Retrieved",
                        userId: session?.id,
                        carId: cars.carDetail._id,
                        isSoled: bool

                    }, auth)

                toast.success("Your Balance Now= " + (bool ? DataBalance + cars.carDetail.price : DataBalance - cars.carDetail.price) + " $");


                router.reload()
            }
            catch {

            }
        } else {

            toast.error("your balance is not enough")

        }



    }



    const renderVideo = (item) => {
        return (
            <div>



                {item.taramash != "false" ?
                    <div className='video-wrapper flex text-center items-center justify-center '>



                        <video width="1900" height="1000" controls className="h-auto max-w-full flex text-center items-center justify-center">
                            <source src={`${baseURL}/${item.taramash}`} type="video/mp4" />
                        </video>


                    </div>


                    :
                    <div className='play-button'>
                        <Image alt="SliderImage" width={1900} height={1000} className='image-gallery-image' src={item.original} />


                    </div>
                }

            </div >
        );

    }


    const dataa = []

    cars.carDetail?.pictureandvideorepair?.map((img, index) => {
        dataa.push({
            "original": `${baseURL}/${img.filename}`,
            "thumbnail": `${baseURL}/${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo

        })

    })
    cars.carDetail?.pictureandvideodamage?.map((img, index) => {
        dataa.push({
            "original": `${baseURL}/${img.filename}`,
            "thumbnail": `${baseURL}/${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo

        })
    })
    cars.carDetail?.carDamage?.map((img, index) => {
        dataa.push({
            "original": `${baseURL}/${img.filename}`,
            "thumbnail": `${baseURL}/${img.filename}`,
            "taramash": `${img.mimetype == "video/mp4" && img.filename}`,
            "renderItem": renderVideo

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
                <div className="flex  w-full h-full p-4 justify-end    ">

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




                </div>

                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto container mx-auto">


                    <ImageGallery
                        onErrorImageURL="/Video.svg"
                        slideInterval={10000}
                        slideDuration={50}
                        flickThreshold={0.6}
                        swipeThreshold={40}
                        slideOnThumbnailOver="true"
                        lazyLoad={true}
                        showFullscreenButton="true"
                        showThumbnails={true}
                        items={dataa}
                    // additionalClass="  "

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
                                <tbody  >


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
Detail.Layout = ResellerLayout;

export default Detail;