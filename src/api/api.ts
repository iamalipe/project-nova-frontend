import { API_URL } from "@/config/env";
import axios from "axios";

// import all api
import { authAPI } from "./auth-api";
import { productAPI } from "./product-api";

// Axios instance configuration
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Export all APIs
const api = {
  auth: authAPI(axiosInstance),
  product: productAPI(axiosInstance),
};

export type ApiType = typeof api;

export default api;
