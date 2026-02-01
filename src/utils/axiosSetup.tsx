import axios from "axios";
console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
axios.defaults.baseURL = `${VIT}/api/v1`;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axios;
