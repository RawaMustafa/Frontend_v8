import Link from "next/link";
import useLanguage from "../../Component/language";
import Head from 'next/head'

import Axios from "../api/Axios";
import axios from "axios";
import { useEffect, useState } from "react";


import AdminLayout from '../../Layouts/AdminLayout';
import { ToastContainer, toast, } from 'react-toastify';


import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCar, faMoneyCheckDollar, faSackDollar, faHandHoldingDollar, faDollar } from '@fortawesome/free-solid-svg-icons';


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
    const session = useSession()
    const { status } = useSession()

    const [Data, setData] = useState()
    const [DataQarz, setDataQarz] = useState()
    const [DataownCost, setDataownCost] = useState()
    const [UserInfo, setUserInfo] = useState()





    useEffect(() => {
        if (status == "authenticated") {

            const Auth = {

                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${session?.data?.Token}`

                }
            }
            const ddashboard = async () => {
                const one = "/cost"
                const two = "/cost/qarz"
                const three = "/cost/ownCost"
                const Forth = `users/detail/${session?.data?.id}`

                const requestOne = Axios.get(one, Auth).then((res) => {
                    return res
                }).catch(() => {

                })
                const requestTwo = Axios.get(two, Auth).then((res) => {
                    return res
                }).catch(() => {

                })
                const requestThree = Axios.get(three, Auth).then((res) => {
                    return res
                }).catch(() => {

                })
                const requestForth = Axios.get(Forth, Auth).then((res) => {
                    return res
                }).catch((e) => {
                })

                await axios.all([requestOne, requestThree, requestTwo, requestForth]).

                    then(
                        axios.spread((...responses) => {

                            const dataFertch = responses?.[0]?.data?.TotalList[0];
                            const dataFertchqarz = responses?.[2]?.data?.QarzTotal[0];
                            const dataFertchownCost = responses?.[1]?.data?.QarzTotal[0];
                            const UserBalance = responses?.[3]?.data.userDetail

                            setUserInfo(UserBalance)
                            setData(dataFertch)
                            setDataQarz(dataFertchqarz)
                            setDataownCost(dataFertchownCost)


                        })).catch((err) => {
                            if (err.response.status == 404) {
                                toast.error("Not Found")
                            }
                            if (err.response.status == 401) {
                                toast.error("Unauthorized")
                            }
                        })

            }
            ddashboard()
        }


    }, [status]);


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

    if (status == "loading") {
        return (
            <>
                <Head>
                    <title >{l.dashboard}</title>
                    <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
                </Head>
                <div className="text-center">
                    {l.loading}
                </div>
            </>

        )
    }

    if (status == "unauthenticated") {
        return router.push('/');
    }

    if (status == "authenticated") {

        return (

            <div className="mb-52  first-line: container mx-auto">

                <Head>
                    <title >{l.dashboard}</title>
                    <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
                </Head>


                <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5 lg:gap-5 mx-4       ">


                    <Link href="/Dashboard/ListofCars/AllCars"><a><div className="p-5  border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.allcars}</div>
                                <div className="text-2xl font-bold  first-letter:">{Data?.carNumber || " 0"}</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500">

                                    <FontAwesomeIcon icon={faCar} className="text-2xl " />

                                </div>
                            </div>

                        </div>
                    </div></a></Link>
                    <Link href="/Dashboard/Balance/Mybalance"><a><div className="p-5  border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.balance}</div>
                                <div className="text-2xl font-bold  first-letter:">${UserInfo?.TotalBals || " 0"}</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500">

                                    <FontAwesomeIcon icon={faDollar} className="text-2xl " />

                                </div>
                            </div>

                        </div>
                    </div></a></Link>

                    <Link href="/Dashboard/Balance/Mybalance"><a><div className="p-5 border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.sold}</div>
                                <div className="text-2xl font-bold ">${Data?.totalpriceSold || " 0"}</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500 ">

                                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-2xl" />

                                </div>
                            </div>

                        </div>
                    </div></a></Link>



                    <Link href="/Dashboard/"><a><div className="p-5 border bg-white dark:bg-[#1E2021]  rounded-2xl shadow-xl  drop-shadow-lg   active:scale-[98%] hover:scale-[99%]">
                        <div className="flex items-center  justify-around  ">

                            <div>
                                <div className="">{l.profit} </div>
                                <div className="text-2xl font-bold ">${Data?.totalbenefit || " 0"}</div>
                            </div>
                            <div>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-slate-500">

                                    <FontAwesomeIcon icon={faSackDollar} className="text-2xl" />

                                </div>
                            </div>

                        </div>
                    </div></a></Link>



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
                                    <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${DataownCost?.owenCost || " 0"}</div>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                    <div className="text-sm font-medium ">{l.totalpricePaidbid}</div>
                                    <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${Data?.totalpricePaidbid || " 0"}</div>
                                </div>



                                <div className="collapse collapse-arrow ">


                                    <input id="totalloan" type="checkbox" className=" w-full  " />

                                    <div className="collapse-title text-xl font-medium">

                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                            <div className="text-sm font-medium ">{l.totalloan}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${DataQarz?.qarzTotal || " 0"}</div>
                                        </div>

                                    </div>
                                    <div className="collapse-content">



                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                            <div className="text-sm font-medium ">{l.qarzAmountTotal}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${DataQarz?.qarzAmountTotal || " 0"}</div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                            <div className="text-sm font-medium ">{l.qarzCarTotalByAmount}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${DataQarz?.qarzCarTotalByAmount || " 0"}</div>
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
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${Data?.totalCoCCost || " 0"}</div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                            <div className="text-sm font-medium ">{l.totalFeesAndRepaidCostDubai}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${Data?.totalFeesAndRepaidCostDubai || " 0"}</div>
                                        </div>

                                        <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#1E2021]">
                                            <div className="text-sm font-medium ">{l.totalFeesRaqamAndRepairCostinKurdistan}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${Data?.totalFeesRaqamAndRepairCostinKurdistan || " 0"}</div>
                                        </div>

                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[#44444466]">
                                            <div className="text-sm font-medium ">{l.totalFeesinAmerica}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${Data?.totalFeesinAmerica || " 0"}</div>
                                        </div>

                                        <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 dark:bg-[1E2021]">
                                            <div className="text-sm font-medium ">{l.totalTransportationCost}</div>
                                            <div className="mt-1 text-sm  sm:col-span-2 sm:mt-0 justify-self-center">${Data?.totalTransportationCost || " 0"}</div>
                                        </div>


                                    </div>
                                </div>




                            </div>
                        </div>
                    </div>




                </div>
                <ToastContainer
                    label={1}

                />
            </div>


        )
    }

}


Dashboard.Layout = AdminLayout
export default Dashboard;


