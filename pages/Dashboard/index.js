import Link from "next/link";
import useLanguage from "../../Component/language";
import Head from 'next/head'

import Axios from "../api/Axios";
import axios from "axios";
import { useEffect, useState } from "react";


import AdminLayout from '../../Layouts/AdminLayout';


import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCar, faMoneyCheckDollar, faSackDollar, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";



export const getServerSideProps = async ({ req }) => {

    const session = await getSession({ req })



    if (!session || session?.userRole !== "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }



    return {
        props: {}

    }
}



const Dashboard = (props) => {
    const l = useLanguage();
    const router = useRouter()

    const [Data, setData] = useState()
    const [DataQarz, setDataQarz] = useState()
    const [DataownCost, setDataownCost] = useState()

    const { status } = useSession()




    useEffect(() => {


        const ddashboard = async () => {
            const one = "/cost"
            const two = "/cost/qarz"
            const three = "/cost/ownCost"

            const requestTwo = await Axios.get(two).then((res) => {
                return res
            }).catch((err) => {
                // err.response.status == 404 || err.response.status == 500 || err.response.status == 400 || err.response.status == 401 || err.response.status == 403 && null


            });

            const requestOne = await Axios.get(one).then((res) => {
                return res
            }).catch((err) => {
                // err.response.status == 404 || err.response.status == 500 || err.response.status == 400 || err.response.status == 401 || err.response.status == 403 && null

            });
            const requestThree = await Axios.get(three).then((res) => {
                return res
            }).catch((err) => {
                // err.response.status == 404 || err.response.status == 500 || err.response.status == 400 || err.response.status == 401 || err.response.status == 403 && null

            })


            await axios.all([requestOne, requestThree, requestTwo]).

                then(
                    await axios.spread((...responses) => {

                        const dataFertch = responses?.[0]?.data?.TotalList[0];
                        const dataFertchqarz = responses?.[2]?.data?.QarzTotal[0];
                        const dataFertchownCost = responses?.[1]?.data?.QarzTotal[0];

                        setData(dataFertch)
                        setDataQarz(dataFertchqarz)
                        setDataownCost(dataFertchownCost)


                    })).catch(errors => {
                        // errors.response.status == 404 || errors.response.status == 500 || errors.response.status == 400 || errors.response.status == 401 || errors.response.status == 403 && null

                    })

        }

        ddashboard()

    }, [props]);



    const dataChart = {
        labels: [l.totalTransportationCost, l.totalpricePaidbid, l.totalCoCCost, l.totalFeesAndRepaidCostDubai, l.totalFeesRaqamAndRepairCostinKurdistan, l.totalFeesinAmerica, l.totalTransportationCost],
        // AdminLayout: "backgroundColor": "rgba(255, 255, 255, 0.5)"},
        datasets: [
            {
                label: '# of Votes',
                data: [Data?.totalTransportationCost, Data?.totalpricePaidbid, Data?.totalCoCCost, Data?.totalFeesAndRepaidCostDubai, Data?.totalFeesRaqamAndRepairCostinKurdistan, Data?.totalFeesinAmerica, Data?.totalTransportationCost],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 159, 264, 0.2)',
                    'rgba(25, 100, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 264, 0.2)',
                    'rgba(25, 100, 64, 0.2)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {

        plugins: {
            legend: {
                display: 'true',

                position: 'bottom',
                labels: {

                    font: {
                        size: 12,

                    },
                    padding: 10,
                    boxWidth: 5,
                    boxHeight: 5,
                    usePointStyle: true,

                }
            }
        }
    }


    if (status == "unauthenticated") {
        return router.push('/');
    }


    return (

        <div className="mb-52  first-line: container mx-auto">

            <Head>
                <title >{l.dashboard}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>


            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4  gap-5 lg:gap-5 mx-4      ">


                <Link href="/Dashboard/ListofCars/AllCars"><a><div className="p-5  border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                    <div className="flex items-center  justify-around  ">

                        <div>
                            <div className="">{l.allcars}</div>
                            <div className="text-2xl font-bold  first-letter:">{Data?.carNumber}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500">

                                <FontAwesomeIcon icon={faCar} className="text-2xl " />

                            </div>
                        </div>

                    </div>
                </div></a></Link>

                <Link href="/Dashboard/ListofCars/SalesList"><a><div className="p-5 border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                    <div className="flex items-center  justify-around  ">

                        <div>
                            <div className="">{l.sold}</div>
                            <div className="text-2xl font-bold ">${Data?.totalpriceSold}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-2xl" />

                            </div>
                        </div>

                    </div>
                </div></a></Link>

                <Link href="/Dashboard/"><a><div className="p-5 border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                    <div className="flex items-center  justify-around  ">

                        <div>
                            <div className=""> {l.totalpricePaidbid}</div>
                            <div className="text-2xl font-bold ">${Data?.totalpricePaidbid}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                <FontAwesomeIcon icon={faHandHoldingDollar} className="text-2xl" />

                            </div>
                        </div>

                    </div>
                </div></a></Link>

                <Link href="/Dashboard/"><a><div className="p-5 border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl  drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                    <div className="flex items-center  justify-around  ">

                        <div>
                            <div className="">{l.profit} </div>
                            <div className="text-2xl font-bold ">${Data?.totalbenefit}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500">

                                <FontAwesomeIcon icon={faSackDollar} className="text-2xl" />

                            </div>
                        </div>

                    </div>
                </div></a></Link>


                {/* <lottie-player src="https://assets9.lottiefiles.com/datafiles/gUENLc1262ccKIO/data.json" background="transparent" speed="1" hover autoplay></lottie-player> */}

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 px-4 pt-10 ">


                <div className="   max-w-[700px] -top-96  ">

                    <Pie options={options} data={dataChart} />

                </div>

                <div className="overflow-hidden shadow-xl  bg-white dark:bg-[#1E2021]  sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 ">{l.allcosts}</h3>
                    </div>
                    <div className="border-t border-gray-200 dark:bg-[#1E2021]">
                        <div >



                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                <div className="text-sm font-medium ">{l.expense}</div>
                                <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{DataownCost?.owenCost}</div>
                            </div>



                            <div className="collapse collapse-arrow ">

                                <label htmlFor="totalloan" >totalloan :</label>
                                <input id="totalloan" type="checkbox" className=" w-full  " />

                                <div className="collapse-title text-xl font-medium">

                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                        <div className="text-sm font-medium ">{l.totalloan}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{DataQarz?.qarzTotal}</div>
                                    </div>

                                </div>
                                <div className="collapse-content">



                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                        <div className="text-sm font-medium ">{l.qarzAmountTotal}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{DataQarz?.qarzAmountTotal}</div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                        <div className="text-sm font-medium ">{l.qarzCarTotalByAmount}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{DataQarz?.qarzCarTotalByAmount}</div>
                                    </div>


                                </div>
                            </div>



                            <div className="collapse collapse-open ">
                                {/*                                 
                                <input type="checkbox" className=" w-full 
                                "onChange={(e) => { e.target.value = '1' }} value={1} /> */}

                                <div className="collapse-title text-xl font-medium">

                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                        <div className="text-sm font-medium ">{l.cost}</div>
                                        {/* <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{DataQarz?.qarzCarTotalByAmount}</div> */}
                                    </div>

                                </div>
                                <div className="collapse-content">



                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                        <div className="text-sm font-medium ">{l.totalCoCCost}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{Data?.totalCoCCost}</div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                        <div className="text-sm font-medium ">{l.totalFeesAndRepaidCostDubai}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{Data?.totalFeesAndRepaidCostDubai}</div>
                                    </div>

                                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                        <div className="text-sm font-medium ">{l.totalFeesRaqamAndRepairCostinKurdistan}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{Data?.totalFeesRaqamAndRepairCostinKurdistan}</div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                        <div className="text-sm font-medium ">{l.totalFeesinAmerica}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{Data?.totalFeesinAmerica}</div>
                                    </div>

                                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[1E2021]">
                                        <div className="text-sm font-medium ">{l.totalTransportationCost}</div>
                                        <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">{Data?.totalTransportationCost}</div>
                                    </div>


                                </div>
                            </div>




                        </div>
                    </div>
                </div>




            </div>

        </div>


    )


}

Dashboard.Layout = AdminLayout
export default Dashboard;


