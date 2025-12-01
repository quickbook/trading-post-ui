// src/api/axiosAdmin.js
import axios from "axios";

const BASE_URL = "https://dev01-api.pranalyticx.cloud";

const axiosAdmin = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

const refreshTokenRequest = async () => {
  const stored = JSON.parse(sessionStorage.getItem("authSession"));

  if (!stored?.refreshToken) return null;

  try {
    const res = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: stored.refreshToken,
    });

    const updatedSession = {
      ...stored,
      accessToken: res.data.accessToken,
      expiresIn: Date.now() + res.data.expiresIn * 1000,
    };

    sessionStorage.setItem("authSession", JSON.stringify(updatedSession));

    return updatedSession.accessToken;
  } catch (err) {
    return null; // ✨ signal failure
  }
};

axiosAdmin.interceptors.request.use(
  async (config) => {
    const stored = JSON.parse(sessionStorage.getItem("authSession"));

    if (!stored?.accessToken) return config;

    // Token expired? refresh first.
    if (Date.now() > stored.expiresIn) {
      if (!isRefreshing) {
        isRefreshing = true;

        const newToken = await refreshTokenRequest();
        isRefreshing = false;

        if (!newToken) {
          // ❌ Refresh failed → logout user
          sessionStorage.clear();
          window.location.href = "/login?session-expired=true";
          return Promise.reject("Session expired");
        }

        processQueue(null, newToken);
      }

      // Queue pending requests until refresh done
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(config);
          },
          reject: (err) => reject(err),
        });
      });
    }

    config.headers.Authorization = `Bearer ${stored.accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle *direct* 401 from server (refresh token invalid or removed)
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login?expired=true";
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;
