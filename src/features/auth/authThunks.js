import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Example auth endpoints (adjust to your API):
 * POST /api/auth/token     -> returns { accessToken, refreshToken, expiresIn }
 * POST /api/auth/refresh   -> returns { accessToken, refreshToken?, expiresIn }
 *
 * expiresIn in seconds; we convert to expiresAt (ms).
 */

const toExpiresAt = (expiresInSec) => Date.now() + expiresInSec * 1000;

export const fetchAuthToken = createAsyncThunk(
  "auth/fetchAuthToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/token");
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
  "auth/refreshAccessToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      const res = await axios.post("/api/auth/refresh", { refreshToken });
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
