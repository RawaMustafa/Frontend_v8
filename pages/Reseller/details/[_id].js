
import axios from "axios"
import Axios, { baseURL } from "../../api/Axios"
import Head from 'next/head'

import useLanguage from '../../../Component/language';
import ResellerLayout from '../../../Layouts/ResellerLayout';

import Image from "next/image";

import ImageGallery from 'react-image-gallery';
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";


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
    const { status } = useSession()
    if (status == "unauthenticated") {
        router.push('/');
    }
    const l = useLanguage();







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
        <>
            <Head>
                <title>{l.detail}</title>
            </Head>

            < >


                <div className="grid grid-cols-1  xl:grid-cols-2 gap-3 2xl:gap-20 4xl:gap-32  m-auto container mx-auto">


                    <ImageGallery
                        onErrorImageURL="https://picsum.photos/id/1018/1000/600/"
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






                                </tbody>

                            </table>


                        </div>


                    </div>

                </div>







            </>

        </>
    );

}
Detail.Layout = ResellerLayout;

export default Detail;