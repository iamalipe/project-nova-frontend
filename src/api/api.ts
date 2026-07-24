import { API_URL } from "@/config/env";
import axios from "axios";

// import all api
import { authAPI } from "./auth-api";
import { categoryAPI } from "./category-api";
import { subcategoryAPI } from "./subcategory-api";
import { oauthAPI } from "./oauth-api";
import { productAPI } from "./product-api";
import { userAPI } from "./user-api";
import { countryAPI } from "./country-api";
import { stateAPI } from "./state-api";
import { storeAPI } from "./store-api";
import { warehouseAPI } from "./warehouse-api";
import { stockAPI } from "./stock-api";
import { stockTransactionAPI } from "./stock-transaction-api";
import { sellAPI } from "./sell-api";

// Axios instance configuration
export const axiosInstance = axios.create({
  baseURL: `${API_URL}/v1`,
  withCredentials: true,
});

// Separate instance: /oauth/* routes are mounted on the backend outside the
// /v1 prefix, so they can't share axiosInstance's baseURL.
export const oauthAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Export all APIs
const api = {
  auth: authAPI(axiosInstance),
  category: categoryAPI(axiosInstance),
  subcategory: subcategoryAPI(axiosInstance),
  product: productAPI(axiosInstance),
  user: userAPI(axiosInstance),
  country: countryAPI(axiosInstance),
  state: stateAPI(axiosInstance),
  store: storeAPI(axiosInstance),
  warehouse: warehouseAPI(axiosInstance),
  stock: stockAPI(axiosInstance),
  stockTransaction: stockTransactionAPI(axiosInstance),
  sell: sellAPI(axiosInstance),
  oauth: oauthAPI(oauthAxiosInstance),
};

export type ApiType = typeof api;

export default api;
