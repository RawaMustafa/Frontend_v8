import Image from "next/image";
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from "react";
import useLanguage from "./language";
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faMoon, faSun, faYinYang, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";




const Header = () => {


    const session = useSession()
    const router = useRouter();

    const l = useLanguage();
    const [lang, setLang] = useState("");
    const [themee, setThemee] = useState("");
    const { theme, setTheme } = useTheme(null)


    const patata = (lang) => {
        router.push(router.asPath, router.asPath, { locale: lang })
    }

    useEffect(() => {

        if (theme === "dark") {

            // themeall.classList.add("dark")
            document.body.classList.add("dark");


        }
        else if (theme === "light") {

            // themeall.classList.remove("dark")
            document.body.classList.remove("dark");

            // sun.classList.add("hidden")

        }

        else if (theme == "system") {
            localStorage.setItem("theme", "dark")
            document.body.classList.add("dark");
        }


    }, [themee]);


    useEffect(() => {





        if (lang == "ku") {

            document.body.dir = "rtl";

        }

        else if (lang == "en") {

            document.body.dir = "ltr";
        }



        if (lang === 'en') {
            localStorage.setItem("language", "en")

        }

        else if (lang === 'ku') {
            localStorage.setItem("language", "ku")
        }







    }, [router?.locale]);



    return (

        //  transition-all duration-300
        <div className="">
             <div className="hidden  standalone:block bg-[#3ea7e1]  h-10 fixed z-50  w-full "></div>
            <div className="navbar  z-[60] flex justify-between lg:justify-end lg:w-[calc(100%-17rem)] max-w-8xl lg:ml-64  rtl:lg:mr-64 mt-2 lg:fixed absolute  standalone:mt-12 bg-opacity-100   bg-[#3ea7e1]  rounded-2xl  ">




                <FontAwesomeIcon icon={faAlignLeft}
                    id="menu" className="w-10 h-10 p-1 rounded-full cursor-pointer lg:hidden active:scale-90 hover:scale-95 "

                    onClick={() => {
                        document.getElementById("sidebar").classList.remove("ltr:nactive")
                        document.getElementById("sidebar").classList.add("ltr:active")
                        if (document.body.dir === "rtl") {
                            document.getElementById("sidebar").classList.remove("rtl:rtlnactive")
                            document.getElementById("sidebar").classList.add("rtl:rtlactive")

                        }

                    }}
                />

                <div className="flex navbar-end ltr:mr-10 rtl:ml-5 ltr:space-x-10 ">

                    <div className="w-8 dropdown rtl:dropdown-right ltr:dropdown-left ">
                        <label tabIndex="0" className="w-20 text-3xl cursor-pointer active:text-2xl active:outline-0 ">
                            <FontAwesomeIcon icon={faGlobe} className="active:scale-[.85] text-4xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700 rounded-full hover:duration-300 transition ease-in-out    hover:rotate-90   " />

                        </label>

                        <ul tabIndex="0" className="p-2 text-center border shadow dropdown-content menu bg-base-100 rounded-box w-44">
                            <li> <a className="" value="ku" onClick={() => {
                                setLang("ku")
                                // router.reload()
                                patata('ku')

                            }}><Image alt="FlaKu" className="active:scale-[.85] text-5xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700  " src="/flag_kurd.png" height={35} width={38} /> كوردی</a> </li>
                            <li> <a className="" value="en" onClick={() => {
                                setLang("en")
                                // router.reload()
                                // Cookies.set('foo', 'ff')

                                patata('en')
                            }}><Image alt="FlaEn" className="active:scale-[.85] text-5xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700 " src="/flag_english.png" height={35} width={35} />English</a></li>
                        </ul>

                    </div>



                    <div className="w-5 mx-6 dropdown rtl:dropdown-right ltr:dropdown-left rtl:mr-10 ">
                        <label tabIndex="0" className="w-20 text-3xl cursor-pointer active:outline-0 ">
                            <FontAwesomeIcon icon={faYinYang} className="active:scale-[.85] text-4xl p-2 hover:bg-slate-300 hover:dark:bg-slate-700 rounded-full hover:duration-300 transition ease-in-out hover:rotate-90  " />

                        </label>

                        <ul tabIndex="0" className="p-2 m-0 text-center shadow dropdown-content bg-base-100 rounded-box w-44">
                            <div className="flex items-center justify-around m-1 text-2xl transition duration-300 ease-in-out cursor-pointer hover:scale-110" viewBox="0 0 24 24" onClick={() => { setTheme('light'); setThemee("light") }} > <FontAwesomeIcon icon={faSun} className="text-3xl transition duration-300 ease-in-out hover:scale-110 hover:rotate-45" />  Light </div>
                            <div className="flex items-center justify-around text-2xl transition duration-300 ease-in-out cursor-pointer hover:scale-110" viewBox="0 0 24 24" onClick={() => { { setTheme('dark'); setThemee("dark") } }}  ><FontAwesomeIcon icon={faMoon} id="moon" className="text-3xl transition duration-300 ease-in-out hover:scale-110 hover:rotate-45" />  Dark </div>

                        </ul>

                    </div>




                </div>
            </div >
        </div >
    );



}

export default Header;
