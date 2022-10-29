// import Link from "next/link";
import Image from "next/image";

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from "react";
import useLanguage from "./language";


import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faMoon, faSun, faYinYang, faGlobe } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from "next/router";

import { useSession } from "next-auth/react";













const Header = () => {


    const patapa = useSession()
    const router = useRouter();
    if (patapa?.status === "unauthenticated") {
        router?.push("/Login")
    }


    const l = useLanguage();

    //for inserting the language switcher
    const [lang, setLang] = useState();

    const [themee, setThemee] = useState("");
    const { theme, setTheme } = useTheme()
    const menu = useRef(null)


    useEffect(() => {


        // for inserting the dark mode

        if (localStorage.getItem("theme") === "dark") {

            // themeall.classList.add("dark")
            document.body.classList.add("dark");


        }
        else if (localStorage.getItem("theme") === "light") {

            // themeall.classList.remove("dark")
            document.body.classList.remove("dark");

            // sun.classList.add("hidden")

        }

        else if (localStorage.getItem("theme") == null) {
            localStorage.setItem("theme", "dark")

            // themeall.classList.remove("dark")
            document.body.classList.add("dark");


            // sun.classList.add("hidden")

        }


    }, [themee], []);

    console.log()
    useEffect(() => {

        if (lang === 'en') {
            localStorage.setItem("language", "en")

        }

        else if (lang === 'ku') {
            localStorage.setItem("language", "ku")
        }
        else if (localStorage.getItem("language") == null) {
            localStorage.setItem("language", "en")
        }

    }, [lang]);

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         if (localStorage.getItem("language") === "ku") {

    //             document.body.dir = "rtl";

    //         }
    //         else if (localStorage.getItem("language") === "en") {

    //             document.body.dir = "ltr";
    //         }
    //     }
    // }, []);



    return (


        <div className="container  ">
            <div className="navbar  z-[60] flex justify-between lg:justify-end lg:w-[calc(100%-17rem)] max-w-8xl lg:ml-64  rtl:lg:mr-64 mt-2 fixed  bg-opacity-5  transition-all duration-300  backdrop-blur-md bg-slate-300 rounded-2xl  bg-base-1">








                <FontAwesomeIcon icon={faAlignLeft}
                    id="menu" className="lg:hidden cursor-pointer active:scale-90 hover:scale-95  w-10 h-10   p-1 rounded-full   "

                    onClick={() => {
                        document.getElementById("sidebar").classList.remove("ltr:nactive")
                        document.getElementById("sidebar").classList.add("ltr:active")
                        if (document.body.dir === "rtl") {
                            document.getElementById("sidebar").classList.remove("rtl:rtlnactive")
                            document.getElementById("sidebar").classList.add("rtl:rtlactive")

                        }

                    }}
                />

                <div className="navbar-end flex ltr:mr-10 rtl:ml-5 ltr:space-x-10   ">

                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left w-8  ">
                        <label tabIndex="0" className="text-3xl  w-20 cursor-pointer active:text-2xl  active:outline-0 ">
                            <FontAwesomeIcon icon={faGlobe} className="active:scale-[.85] text-4xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700 rounded-full hover:duration-300 transition ease-in-out    hover:rotate-90   " />

                        </label>

                        <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44 text-center border">
                            <li> <a href={router.pathname} className="" value="ku" onClick={() => { setLang("ku") }}><Image alt="FlaKu" className="active:scale-[.85] text-5xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700  " src="/flag_kurd.png" height={35} width={38} /> كوردی</a> </li>
                            <li> <a href={router.pathname} className="" value="en" onClick={() => { setLang("en") }}><Image alt="FlaEn" className="active:scale-[.85] text-5xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700 " src="/flag_english.png" height={35} width={35} />English</a></li>
                        </ul>

                    </div>



                    <div className="dropdown rtl:dropdown-right ltr:dropdown-left rtl:mr-10  w-5  mx-6 ">
                        <label tabIndex="0" className="text-3xl   w-20 cursor-pointer     active:outline-0  ">
                            <FontAwesomeIcon icon={faYinYang} className="active:scale-[.85] text-4xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700 rounded-full hover:duration-300 transition ease-in-out hover:rotate-90  " />

                        </label>

                        <ul tabIndex="0" className="dropdown-content   p-2 shadow bg-base-100 rounded-box w-44 text-center m-0">
                            <div className="  flex items-center justify-around text-2xl cursor-pointer m-1 transition ease-in-out hover:scale-110   duration-300 " viewBox="0 0 24 24" onClick={() => { setTheme('light'); setThemee("light") }} > <FontAwesomeIcon icon={faSun} className=" transition ease-in-out      hover:scale-110   duration-300  text-3xl hover:rotate-45   " />  Light </div>
                            <div className="  flex items-center justify-around text-2xl cursor-pointer transition ease-in-out  hover:scale-110   duration-300   " viewBox="0 0 24 24" onClick={() => { { setTheme('dark'); setThemee("dark") } }}  ><FontAwesomeIcon icon={faMoon} id="moon" className="transition ease-in-out    hover:scale-110   duration-300  text-3xl hover:rotate-45" />  Dark </div>

                        </ul>

                    </div>




                </div>
            </div >
        </div >
    );



}

export default Header;
