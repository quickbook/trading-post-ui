// src/features/auth/loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
const FETCH_LOGIN_ACTION = `login${API_ENDPOINTS.USERS.BASE}`;

// POST /api/auth/login -> { id, name, role: "admin"|"user" }
export const login = createAsyncThunk(
  FETCH_LOGIN_ACTION,
  async (credentials, { rejectWithValue }) => {
    try {
      let body = {
        username: credentials.email,
        password: credentials.password,
      }
      const res = await axiosClient.post(getFullUrl(API_ENDPOINTS.USERS.LOGIN), body);
      return res.data; // { id, name, role }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("login/logout", async () => {
  // optional: tell server; interceptors will carry token if needed
  await axiosClient.post("/api/auth/logout").catch(() => {});
  return true;
});

const slice = createSlice({
  name: "login",
  initialState: {
    user: null, // {id, name, role}
    status: "idle",
    error: null,
  },
  reducers: {
    setUserFromStorage: (state, { payload }) => {
      state.user = payload || null;
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.status = "loading"; s.error = null; });
    b.addCase(login.fulfilled, (s, { payload }) => {
      console.log(payload)
      s.status = "succeeded";
      s.user = payload;
      try { localStorage.setItem("user", JSON.stringify(payload)); } catch { /* empty */ }
    });
    b.addCase(login.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });

    b.addCase(logout.fulfilled, (s) => {
      s.user = null;
      s.status = "idle";
      s.error = null;
      localStorage.removeItem("user");
    });
  },
});

export const { setUserFromStorage } = slice.actions;
export default slice.reducer;

export const selectUser = (st) => st.login.user;
export const selectRole = (st) => st.login.user?.role || null;
export const selectUserId = (st) => st.login.user?.id || null;
export const selectIsLoginSuccess = (st) => st.login.status === "succeeded";
