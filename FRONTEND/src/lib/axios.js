import axios from "axios";

 const axiosinstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
    withCredentials: true,
})

export default axiosinstance;