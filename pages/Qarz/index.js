import { InView } from 'react-intersection-observer';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faSearch, } from '@fortawesome/free-solid-svg-icons';

import useLanguage from '../../Component/language';
import ResellerLayout from '../../Layouts/ResellerLayout';

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import axios from 'axios';
import Axios, { baseURL } from '../api/Axios';


import ImageGallery from 'react-image-gallery';




import { useRouter } from "next/router";
import { getSession } from "next-auth/react";


export async function getServerSideProps({ req, query }) {
    const session = await getSession({ req })
    if (!session || session.userRole != "Qarz") {
        return {
            redirect: {
                destination: '/Login',
                permanent: false,
            },
        }

    }
    return {
        props: {
            initQuery: session.id
        }
    }
}







import Image from 'next/image';

const Qarz = ({ initQuery }) => {

    const l = useLanguage();

    const router = useRouter()
    const [dataQarz, setData] = useState()
    const [Search, setSearch] = useState("");
    const [Page, setPage] = useState(1);
    const [Limit, setLimit] = useState(4);
    const [NoCars, setNoCars] = useState(false);




    useMemo(() => {

        const GetCars = async () => {
            try {
                const res = await Axios.get(`/qarz/${initQuery}/?search=${Search}&page=${Page}&limit=${Limit}`);
                setNoCars(false)
                const dataFetch = await res.data;
                setData(dataFetch)



            } catch (e) {
                setNoCars(true)
                e.response.status == 404 &&
                    setNoCars(true)
            }

        }
        GetCars()

    }, [Search, Page, Limit, initQuery])



    const renderVideo = (item) => {

        return (
            <div>
                <Image width={1600} height={1040}
                    alt='Cars'
                    // objectFit='contain'
                    // lazyBoundary='20px'
                    quality={'1'}
                    className='image-gallery-image  '
                    // crossOrigin="anonymous"
                    src={item.original} />
            </div >
        );

    }



    return (

        <div className="container mx-auto  footer-center ">

            <Head>
                <title >{l.allcars}</title>
            </Head>

            <div className="pt-5  mb-32">


                <div className="   z-30  mx-5   ">

                    <label className="relative block max-w-[150px] lg:max-w-[300px] ">
                        <span className="sr-only">Search</span>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input onChange={(s) => { setSearch(s.target.value) }} className="placeholder:italic placeholder:text-slate-400 block  bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder={l.search} type="text" name="search" />
                    </label>



                </div>
            </div>


            <>
                {
                    NoCars &&
                    <div className="text-center  ">
                        < Image alt="NoCar" src="/No_Cars.svg" width={400} height={400} quality={'1'} />
                    </div>
                }

                {
                    !NoCars &&
                    <>


                        <div className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-40  ">
                            {
                                dataQarz?.qarzList?.map((e, idx) => {
                                    if (!e.carId) {
                                        return null;
                                    }

                                    const dataImage = []

                                    e.carId.pictureandvideorepair?.map((img, index) => {
                                        img.mimetype != "video/mp4" && dataImage.push({
                                            "original": `${baseURL}/${img.filename}`,
                                            "thumbnail": `/uploads/${img.filename}`,
                                            "renderItem": renderVideo


                                        })
                                    })
                                    e.carId.pictureandvideodamage?.map((img, index) => {
                                        img.mimetype != "video/mp4" && dataImage.push({
                                            "original": `${baseURL}/${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
                                            "renderItem": renderVideo,
                                        })
                                    })
                                    e.carId.carDamage?.map((img, index) => {
                                        img.mimetype != "video/mp4" && dataImage.push({
                                            "original": `${baseURL}/${img.filename}`, "thumbnail": `/uploads/${img.filename}`,
                                            "renderItem": renderVideo,
                                        })
                                    })

                                    return (

                                        <div className="card   max-w-[400px] min-w-[300px]    bg-base-300 shadow-xl  " key={idx}>
                                            <figure className="  h-48 overflow-hidden scrollbar-hide  ">
                                                < ImageGallery
                                                    width={100}
                                                    onErrorImageURL="/Video.svg"
                                                    slideInterval={100000}
                                                    showThumbnails={false}
                                                    autoPlay={true}
                                                    lazyLoad={true}
                                                    showFullscreenButton={false}
                                                    showPlayButton={false}
                                                    items={dataImage}
                                                    className="bg-base-content "
                                                />

                                            </figure>
                                            <Link href={`/Qarz/details/${e.carId._id}`} ><a><div>

                                                <div className="card-body z-50">
                                                    <div className="flex justify-between  modal-middle card-title">
                                                        <h1 >{e.carId.modeName}</h1>

                                                        <div id="new_car" className=" text-info text-xs p-3">{`${l.price} ` + ":"}<label className="text-xl text-accent "> {e.carId.price}$</label> </div>

                                                    </div>

                                                    <div className="text-xl text-opacity-10">
                                                        <span className='text-xs' >VIN :</span> {e.carId.VINNumber}
                                                    </div>

                                                    <div className="card-actions justify-end">
                                                    </div>
                                                </div>

                                            </div></a></Link>
                                        </div>



                                    )

                                })



                            }
                        </div >
                        {dataQarz?.qarzList.length >= Limit &&
                            <InView rootMargin='300px'
                                as="div" onChange={(inView, entry) => {

                                    inView && setLimit(Limit + 4)
                                }} className=" grid grid-cols-1 sm:grid-cols-2   xl:grid-cols-3 2xl:grid-cols-4  gap-8  gap-y-20 mb-20  ">


                                <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>

                                <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>

                                <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>

                                <div role="status" className="p-4 max-w-sm w-full  border border-gray-200  animate-pulse md:p-6 dark:border-gray-700 rounded-2xl shadow-xl">
                                    <div className="flex justify-center items-center mb-12 h-48 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                                    </div>
                                    <div className="flex  justify-between mb-6">
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-6"></div>

                                    <span className="sr-only">Loading...</span>
                                </div>



                            </InView >
                        }
                    </ >
                }




            </ >

        </div >
    );



}

Qarz.Layout = ResellerLayout;
export default Qarz;




