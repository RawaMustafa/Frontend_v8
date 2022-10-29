import { useState, useEffect } from "react";
import { en } from "./en";
import { ku } from "./ku";

const useLanguage = () => {

    const [language, setLanguage] = useState();



    useEffect(() => {

        if (localStorage.getItem('language') == "en") {
            setLanguage(en);
        }
        else if (localStorage.getItem('language') == "ku") {
            setLanguage(ku);
        }

    }, [language]);

    const l = language === ku ? ku : en;



    return l;

}

export default useLanguage;