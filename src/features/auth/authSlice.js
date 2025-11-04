import { createSlice } from "@reduxjs/toolkit";
import { fetchAuthToken, refreshAccessToken } from "./authThunks";

const LS_KEY = "authToken";
const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveToLS = (state) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
};

const persisted = loadFromLS();

const initialState = {
  accessToken: persisted?.accessToken || null,
  refreshToken: persisted?.refreshToken || null,
  expiresAt: persisted?.expiresAt || 0,
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken ?? state.refreshToken ?? null;
      state.expiresAt = payload.expiresAt ?? state.expiresAt ?? 0;
      saveToLS({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      });
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = 0;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(LS_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthToken.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchAuthToken.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.accessToken = payload.accessToken;
        s.refreshToken = payload.refreshToken ?? null;
        s.expiresAt = payload.expiresAt ?? 0;
        saveToLS({ accessToken: s.accessToken, refreshToken: s.refreshToken, expiresAt: s.expiresAt });
      })
      .addCase(fetchAuthToken.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })

      .addCase(refreshAccessToken.pending, (s) => { s.status = "refreshing"; })
      .addCase(refreshAccessToken.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.accessToken = payload.accessToken;
        s.refreshToken = payload.refreshToken ?? s.refreshToken ?? null;
        s.expiresAt = payload.expiresAt ?? s.expiresAt;
        saveToLS({ accessToken: s.accessToken, refreshToken: s.refreshToken, expiresAt: s.expiresAt });
      })
      .addCase(refreshAccessToken.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  },
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;

export const isTokenExpired = (state) => !state.auth.expiresAt || Date.now() >= state.auth.expiresAt - 5000; // 5s skew
export const selectAccessToken = (state) => state.auth.accessToken;
