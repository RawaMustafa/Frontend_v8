import axios from "axios";
import { getSession } from 'next-auth/react'


// export default axios.create({

//     baseURL: "http://localhost:4000/_API/",
//     headers: {
//         "Content-Type": "application/json",
//         // Authorization: `Bearer ${token}`,




//         // "Authorization": "Bearer " + session.accessToken
//     },

// })


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
    //         // console.log(session)
    //         req.headers.common = {
    //             Authorization: `Bearer ${session?.Token}`
    //         }

    //     }
    //     return req
    // })




    // Axios.interceptors.response.use(async (res) => {
    //     console.log(res)

    //     // const session = await getSession({ res })

    //     // if (session) {
    //     //     res.headers.common = {
    //     //         Authorization: `Bearer ${session?.Token}`
    //     //     }

    //     // }
    //     return res
    // })



    return Axios
}

export default Axios()