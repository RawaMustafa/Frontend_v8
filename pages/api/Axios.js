import axios from "axios";



export default axios.create({

    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },

})


export const baseURL = "http://localhost:4000/uploads/"
