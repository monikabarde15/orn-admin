import axios from "axios"
console.log(import.meta.env.VITE_API_URL);
const VIT=import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: `${VIT}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

export const getCSRFToken = () => {
  if (typeof document === "undefined") return ""
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrftoken="))
    ?.split("=")[1]
}
