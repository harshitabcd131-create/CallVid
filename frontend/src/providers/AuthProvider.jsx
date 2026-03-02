import { createContext,useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios.js";
import toast  from "react-hot-toast";

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
    const {getToken}= useAuth();

    useEffect(()=>{
        //setup axios interceptor to attach the token to every request 
        const interceptor = axiosInstance.interceptors.request.use(
            async (config)=>{
                try{
                    const token = await getToken();
                    if(token){
                        config.headers.Authorization = `Bearer ${token}`;
                    }

                }catch(error){
                    if(error.message?.includes("auth")){
                        toast.error("Authentication error. Please refresh the page and sign in again")
                    }

                    console.log("Error fetching auth token",error);
                }

                return config;

            },
            (error)=>{
                console.log("Error in request interceptor",error);
                return Promise.reject(error);
            }
        )
        //cleanup function to remove the interceptor when the component unmounts, this is important to  prevents memory leaks
        return ()=> axiosInstance.interceptors.request.eject(interceptor);

    },[getToken])
    
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
    
}