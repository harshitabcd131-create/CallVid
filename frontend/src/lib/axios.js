import axios from 'axios';
//https://call-vid.vercel.app/

 const BASE_URL= import.meta.env.MODE==="development" ? "http://localhost:5001" : "https://call-vid.vercel.app/"

 export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
 })