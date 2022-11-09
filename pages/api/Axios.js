import axios from "axios";

// async (response) => {
//     const session = await getSession();
//     if (session) {
//         request.headers.Authorization = `Bearer ${session.accessToken}`;
//     }
//     return response;
// }

// const token = await getToken({ req })
export default axios.create({

    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + session.accessToken
    },

})

export const baseURL = "http://localhost:4000/uploads/"
