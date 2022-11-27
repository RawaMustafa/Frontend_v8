import axios from "axios";
import { getSession, signOut } from 'next-auth/react'

export const baseURL = "http://localhost:4000/api/uploads/"

const Axios = () => {

    const Axios = axios.create({

        baseURL: "http://localhost:4000/_API/",
        headers: {
            "Content-Type": "application/json",
        },

    })

    // Axios.interceptors.request.use(async (req) => {

    //     const session = await getSession({ req })

    //     if (session) {
    //         req.headers.common = {
    //             Authorization: `Bearer ${session?.Token}`
    //         }
    //         return req

    //     }

    //     if (!session) {


    //         return req

    //     }
    // })




    // Axios.interceptors.response.use(async (res) => {


    //     // const session = await getSession({ res })

    //     // if (session) {
    //     //     res.headers.common = {
    //     //         Authorization: `Bearer ${session?.Token}`
    //     //     }

    //     // }


    //     // if (res?.status == 401) {
    //     //     signOut({
    //     //         callbackUrl: "/",
    //     //         failureRedirect: "/login",
    //     //         redirect: "/",


    //     //     })

    //     // }
    //     return res
    // })



    return Axios
}

export default Axios()