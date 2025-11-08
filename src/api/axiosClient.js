import axios from "axios";
 
import { API_ENDPOINTS,getFullUrl } from "../config/apiEndpoints";
 
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
  //baseURL: process.env.REACT_APP_API_BASE_URL || "https://dev01-api.pranalyticx.cloud",
  baseURL: "https://dev01-api.pranalyticx.cloud",
  headers: { "Content-Type": "application/json" },
});

  
// Initialize auth on app start
export const initializeAuth = async () => {
  try {
    const store = getStore();
    const response = await axiosClient.post(getFullUrl(API_ENDPOINTS.AUTH.TOKEN));
    console.log(response)
    const { accessToken, refreshToken, expiresIn } = response.data;
    
      if (!accessToken) {
      throw new Error('No access token received from server');
    }
      // Format token if needed
    const formattedToken = accessToken.startsWith('Bearer ') 
      ? accessToken 
      : `Bearer ${accessToken}`;

    // Dispatch the token data to store
    await store.dispatch({
      type: 'auth/setCredentials',
      payload: {
        accessToken: formattedToken,
        refreshToken: refreshToken ?? null,
        expiresAt: Date.now() + (expiresIn ?? 0) * 1000
      }
    });
      console.debug('Auth initialized, token stored');
    return response.data;
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    throw error;
  }
};
const AUTH_PATHS = [
  API_ENDPOINTS.AUTH.TOKEN,
  API_ENDPOINTS.AUTH.REFRESH
];
 

const getTokenFromStore = () => {
  const store = getStore();
  const token = store.getState().auth.accessToken;
  console.debug('Token from store:', token ? 'exists' : 'missing');
  return token;
};
// Add a pre-request configuration
axiosClient.defaults.transformRequest = [
  (data, headers) => {
    const currentUrl = headers.common?.url || '';    
    const isAuthEndpoint = AUTH_PATHS.some(path => currentUrl.includes(path));

    if (!isAuthEndpoint) {
      const token = getTokenFromStore();
      if (token) {
        headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        console.debug('Request URL:', currentUrl);
        console.debug('Authorization header set:', headers.Authorization ? 'yes' : 'no');
      }
    }
    
    return data;
  },
  ...axios.defaults.transformRequest
];

// Error handling
axiosClient.defaults.validateStatus = (status) => {
  return status >= 200 && status < 300;
};
export default axiosClient;
