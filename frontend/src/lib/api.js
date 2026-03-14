import { axiosInstance } from "./axios";

export async function generateToken() {
  const response = await axiosInstance.get("/api/chat/token");
  return response.data;
}
