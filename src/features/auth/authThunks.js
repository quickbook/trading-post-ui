import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";

/**
 * Example auth endpoints (adjust to your API):
 * POST /api/auth/token     -> returns { accessToken, refreshToken, expiresIn }
 * POST /api/auth/refresh   -> returns { accessToken, refreshToken?, expiresIn }
 *
 * expiresIn in seconds; we convert to expiresAt (ms).
 */

const toExpiresAt = (expiresInSec) => Date.now() + expiresInSec * 1000;

export const fetchAuthToken = createAsyncThunk(
   `auth${API_ENDPOINTS.AUTH.TOKEN}`,
  async (_, { rejectWithValue }) => {
    try {
     const res = await axios.post(getFullUrl(API_ENDPOINTS.AUTH.TOKEN));
      const { accessToken, refreshToken, expiresIn } = res.data;
      return {
        accessToken,
        refreshToken: refreshToken ?? null,
        expiresAt: toExpiresAt(expiresIn ?? 0),
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Token fetch failed");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  `auth${API_ENDPOINTS.AUTH.REFRESH}`,
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
    const res = await axios.post(
        getFullUrl(API_ENDPOINTS.AUTH.REFRESH), 
        { refreshToken }
      );
      const { accessToken, refreshToken: newRefresh, expiresIn } = res.data;
      return {
        accessToken,
        refreshToken: newRefresh || refreshToken || null,
        expiresAt: toExpiresAt(expiresIn ?? 0),
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Refresh failed");
    }
  }
);
