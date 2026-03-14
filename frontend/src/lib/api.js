import { axiosInstance } from "./axios";

export async function generateToken() {
  // Some deployments set VITE_API_BASE_URL to include "/api" (e.g. https://call-vid.vercel.app/api)
  // while local development uses a base URL without /api.
  // Normalize to avoid double "/api/api" and to support both setups.
  const baseUrl = axiosInstance.defaults.baseURL || "";
  const needsApiPrefix = !baseUrl.endsWith("/api");
  const path = needsApiPrefix ? "/api/chat/token" : "/chat/token";

  const response = await axiosInstance.get(path);
  return response.data;
}
