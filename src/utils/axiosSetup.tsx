import axios from "axios";

axios.defaults.baseURL = "https://backend.onrequestlab.com/api/v1";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axios;
