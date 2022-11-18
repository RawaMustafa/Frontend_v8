import { useState, useEffect } from "react";
import { en } from "./en";
import { ku } from "./ku";
import { useRouter } from "next/router";

const useLanguage = () => {

    const [language, setLanguage] = useState();
    const router = useRouter();
    const { locale } = router
    const l = locale == 'ku' ? ku : en;


    return l;

}

export default useLanguage;