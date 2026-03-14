import axios from "axios";

// Normalize the API base to avoid double "/api" in requests.
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const normalizedBaseUrl = trimmedBaseUrl.replace(/\/api$/i, "");

export const axiosInstance = axios.create({
  baseURL: normalizedBaseUrl || undefined,
  withCredentials: true,
});
