import { useState, useEffect } from "react";
import { en } from "./en";
import { ku } from "./ku";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'
import i18next from 'i18next';
const useLanguage = () => {

    const [language, setLanguage] = useState();
    const router = useRouter();
    const { locale } = router
    const l = locale == 'ku' ? ku : en;



    // useEffect(() => {


    //     if (locale == "en") {
    //         localStorage.setItem('language', "en")
    //     }
    //     else if (locale == "ku") {
    //         localStorage.setItem('language', "ku")
    //     }

    // }, [locale]);




    return l;

}

export default useLanguage;