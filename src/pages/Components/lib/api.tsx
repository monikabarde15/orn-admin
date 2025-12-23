import axios from "axios"

export const api = axios.create({
  baseURL: "https://dev.backend.onrequestlab.com",
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
