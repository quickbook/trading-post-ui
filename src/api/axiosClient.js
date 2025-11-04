import axios from "axios";
import {
  fetchAuthToken,
  refreshAccessToken,
} from "../features/auth/authThunks";
import { selectAccessToken } from "../features/auth/authSlice";

let storeInstance;

// Injected later from index.js/main.jsx
export const injectStore = (store) => {
  storeInstance = store;
};

const getStore = () => {
  if (!storeInstance) throw new Error("Redux store not initialized!");
  return storeInstance;
};

const axiosClient = axios.create({
  baseURL: "https://your-api-url.com",
});

// Attach Bearer token
axiosClient.interceptors.request.use((config) => {
  const token = selectAccessToken(getStore().getState());
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → refresh + retry
let refreshPromise = null;

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!error.response || error.response.status !== 401 || original._retry)
      return Promise.reject(error);

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const state = getStore().getState();
          const hasRefresh = !!state.auth.refreshToken;
          const action = hasRefresh ? refreshAccessToken() : fetchAuthToken();
          const result = await getStore().dispatch(action);
          if (result.meta.requestStatus !== "fulfilled")
            throw new Error("Token refresh failed");
        } finally {
          setTimeout(() => {
            refreshPromise = null;
          }, 0);
        }
      })();
    }

    await refreshPromise;
    const token = selectAccessToken(getStore().getState());
    if (token) original.headers.Authorization = `Bearer ${token}`;
    return axiosClient(original);
  }
);

export default axiosClient;
