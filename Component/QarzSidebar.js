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

        <section id="sidebar" className="rtl:rtlnactive ltr:nactive bg-opacity-100 backdrop-blur-3xl fixed lg:ltr:left-0 lg:rtl:right-0 bottom-0 h-full pt-5 px-4 w-60  duration-300 ease-in-out   overflow-y-auto scrollbar-hide shadow-2xl z-[60]">

            <div>

                <div className="footer-center py-5 cursor-pointer  ">
                    <Link href="/Qarz"><a><Image className="active:scale-95  rounded-full" alt="Logo" src="/logo.png" height={55} width={55} /></a></Link>
                </div>

                <div onClick={async () => {
                    await logOut()
                    signOut({ callbackUrl: "/", redirect: true })
                }} className="cursor-pointer   my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faArrowRightFromBracket} className="text-xl" /> </span><span> {l.logout}</span></div>


            </div>


            <hr className="  bg-black dark:bg-slate-100 text-xl h-0.5" />

            <div className="  space-y-6  mt-5  ">
                <ul id="list_li" className="">
                    <li><Link href="/Qarz"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faChartLine} className="text-xl active:text-lg" />  </span>{l.dashboard}<span> </span></a></Link></li>
                    <li className="mt-5 mb-3"><h1>{l.listofloan}</h1> </li>

                    <li><Link href="/Qarz/ListofCars"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faCar} className="text-xl" /> </span><span> {l.listofcars}</span></a></Link></li>
                    <li><Link href="/Qarz/ListofLoan"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faHandHoldingDollar} className="text-xl" /> </span><span> {l.listofloan}</span></a></Link></li>
                    <li className="mt-5 mb-3"><h1>{l.balance}</h1> </li>
                    <li><Link href="/Qarz/Mybalance"><a className=" my-custom-style"><span className="px-2"><FontAwesomeIcon icon={faMoneyCheckDollar} className="text-xl" /> </span><span> {l.mybalance}</span></a></Link></li>



                </ul>

            </div>

        </section>

    )

}
export default Sidebar