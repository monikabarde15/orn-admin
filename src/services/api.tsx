import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api/v1",

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   SESSION CHECK
====================================================== */

const isSessionExpired = (): boolean => {
  const expiresAtRaw =
    localStorage.getItem(
      "session_expires_at"
    );

  if (!expiresAtRaw) {
    return false;
  }

  const expiresAt = Number(
    expiresAtRaw
  );

  return (
    !Number.isFinite(expiresAt) ||
    Date.now() > expiresAt
  );
};

/* ======================================================
   LOGOUT
====================================================== */

const hardLogout = () => {
  localStorage.removeItem("token");

  localStorage.removeItem(
    "session_expires_at"
  );

  localStorage.removeItem("user");

  localStorage.removeItem("userId");

  window.location.href = "/login";
};

/* ======================================================
   REQUEST INTERCEPTOR
====================================================== */

api.interceptors.request.use(
  (config) => {
    // SESSION EXPIRED
    if (isSessionExpired()) {
      hardLogout();

      return Promise.reject(
        new Error("Session expired")
      );
    }

    // TOKEN
    const token =
      localStorage.getItem("token");

    // ATTACH TOKEN
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/* ======================================================
   RESPONSE INTERCEPTOR
====================================================== */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    // UNAUTHORIZED
    if (
      error.response?.status === 401
    ) {
      hardLogout();
    }

    // SERVER ERROR
    if (
      error.response?.status >= 500
    ) {
      console.error(
        "Server Error:",
        error.response?.data
      );
    }

    return Promise.reject(error);
  }
);

export default api;
