import Link from "next/link"
import Image from "next/image"
import useLanguage from "./language";
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faCartPlus, faCar, faCircleUser, faChartLine, faMoneyCheckDollar, faUserTag, faArrowRightFromBracket, faHandHoldingDollar, faCommentsDollar } from '@fortawesome/free-solid-svg-icons';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Axios from "../pages/api/Axios";



const Sidebar = () => {
    const l = useLanguage();
    const session = useSession()
    const router = useRouter()


    const logOut = async () => {
        await Axios.get("/users/logOut", {}, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session?.data?.Token}`
            }
        },
        );
    }

    if (typeof window !== 'undefined') {
        document.onclick = (e) => {

            const menu = document.getElementById("menu")
            if (document.body.dir == "ltr" && e.target != menu && e.target != menu?.children?.[0]) {
                document.getElementById("sidebar")?.classList.add("ltr:nactive")
                document.getElementById("sidebar")?.classList.remove("ltr:active")

            }

            if (document.body.dir == "rtl" && e.target != menu && e.target != menu?.children?.[0]) {
                document.getElementById("sidebar")?.classList.add("rtl:rtlnactive")
                document.getElementById("sidebar")?.classList.remove("rtl:rtlactive")
            }

        }
    }

    if (session?.status === "unauthenticated") {
        router?.push("/Login")
    }
    return (

        <section id="sidebar" className="rtl:rtlnactive ltr:nactive standalone:top-10  fixed lg:ltr:left-0 lg:rtl:right-0 bottom-0 h-full pt-5 px-4 w-60 ease-in-out duration-100  backdrop-blur-3xl   bg-base-100   overflow-y-auto scrollbar-hide drop-shadow-xl z-[60]">

            <div className=" ">

                <div className="footer-center py-5 cursor-pointer  ">
                    <Link href="/Dashboard"><a><Image className="active:scale-95  rounded-full" alt="Logo" src="/alwand-blue.jpg" height={55} width={55} /></a></Link>
                </div>

                <div onClick={async () => {
                    await logOut()
                    signOut({ callbackUrl: "/", redirect: true })
                }} className="cursor-pointer   my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faArrowRightFromBracket} className="text-xl" /> </span><span> {l.logout}</span></div>


            </div>


            <hr className="  bg-black dark:bg-slate-100 text-xl h-0.5" />

            <div className="  space-y-6  mt-5  ">
                <ul id="list_li" className="">
                    <li><Link href="/Dashboard"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faChartLine} className="text-xl active:text-lg" />  </span>{l.dashboard}<span> </span></a></Link></li>
                    <li className="mt-5 mb-3"><h1>{l.balance}</h1> </li>

                    <li><Link href="/Dashboard/Balance/Mybalance"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faMoneyCheckDollar} className="text-xl" /> </span><span> {l.mybalance}</span></a></Link></li>
                    <li><Link href="/Dashboard/Balance/Expense"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faCommentsDollar} className="text-xl" /> </span><span> {l.expense}</span></a></Link></li>
                    <li><Link href="/Dashboard/Balance/ListofOwe"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faHandHoldingDollar} className="text-xl" /> </span><span> {l.owe}</span></a></Link></li>
                    <li><Link href="/Dashboard/Balance/Reseller"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faUserTag} className="text-xl" /> </span><span> {l.reseler}</span></a></Link></li>

                    <li className="mt-5 mb-3"><h1>{l.car}</h1> </li>

                    <li><Link href="/Dashboard/ListofCars/NewCars"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faCartPlus} className="text-xl" /> </span><span> {l.newcard} </span></a></Link></li>
                    <li><Link href="/Dashboard/ListofCars/AllCars"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faCar} className="text-xl" /> </span><span> {l.allcars} </span></a></Link></li>

                    <li className="mt-5 mb-3"><h1>{l.account}</h1> </li>

                    <li><Link href="/Dashboard/Accounts/"><a className=" my-custom-style mb-20"><span className="px-2"><FontAwesomeIcon icon={faCircleUser} className="text-xl" /> </span><span> {l.account}</span></a></Link></li>

                </ul>

            </div>

        </section>

    )

}
export default Sidebar