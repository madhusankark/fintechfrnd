import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE_URL });


const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
};

api.interceptors.request.use((config) => {
  const token = getCookie("kf_token");
  if (token) {
    
    config.headers["Authorization"] = token;
  }
  return config;
});


export const registerInvestor = (data) => api.post("/investors", data);
export const loginInvestor = (data) => api.post("/investors/login", data);
export const getInvestorById = (id) => api.get(`/investors/${id}`);
export const getInvestorHoldings = (id) => api.get(`/investors/${id}/holdings`);
export const getNetWorth = (id) => api.get(`/investors/${id}/networth`);

export const getFunds = () => api.get("/funds");
export const getFundById = (id) => api.get(`/funds/${id}`);
export const addFund = (data) => api.post("/funds", data);
export const updateFundNav = (id, nav) => api.put(`/funds/${id}/nav`, { current_nav: nav });
export const calculateNav = (data) => api.post("/funds/calculate", data);


export const createSIP = (data) => api.post("/sips/register", data);
export const getSipById = (id) => api.get(`/sips/${id}`);
export const processSIP = (id) => api.post(`/sips/${id}/process`);
export const getTransactions = (investorId) => api.get(`/sips/transactions/investor/${investorId}`);

export const getSipsByInvestor = (investorId) => api.get(`/sips/investor/${investorId}`);


export const logoutInvestor = () => api.post("/sips/logout");

export default api;