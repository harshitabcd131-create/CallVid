import { axiosInstance } from "./axios";

    export async function generateToken() {
        const response = await axiosInstance.get("/chat/token");
        return response.data;
    }