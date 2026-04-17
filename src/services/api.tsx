import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const isSessionExpired = () => {
  const expiresAtRaw = localStorage.getItem("session_expires_at");
  if (!expiresAtRaw) return false; // don’t break existing sessions without this key
  const expiresAt = Number(expiresAtRaw);
  return !Number.isFinite(expiresAt) || Date.now() > expiresAt;
};

const hardLogout = () => {
  localStorage.setItem("logout_at", String(Date.now()));
  localStorage.removeItem("session_expires_at");
  localStorage.removeItem("login_at");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
};

// ✅ attach access token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

api.interceptors.request.use((config) => {
  if (isSessionExpired()) {
    hardLogout();
    return Promise.reject(new Error("Session expired"));
  }
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ handle expired token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      if (isSessionExpired()) {
        hardLogout();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/users/auth/token/refresh/`,
          { refresh }
        );

        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (e) {
        // refresh bhi expire → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
