// src/features/auth/loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
const FETCH_LOGIN_ACTION = `login${API_ENDPOINTS.USERS.BASE}`;

// ✅ Read stored user from sessionStorage (preferred)
const storedUser = (() => {
  try {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
})();
// POST /api/auth/login -> { id, name, role: "admin"|"user" }
export const login = createAsyncThunk(
  FETCH_LOGIN_ACTION,
  async (credentials, { rejectWithValue }) => {
    try {
      let body = {
        username: credentials.username,
        password: credentials.password,
      }
      const res = await axiosClient.post(getFullUrl(API_ENDPOINTS.USERS.LOGIN), body);
      return res.data.data.user; // { id, name, role }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Async thunk for requesting password reset
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email"
      );
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
    user: storedUser, // ✅ initialize from storage
    status: "idle",
    error: null,
  },
  reducers: {
    setUserFromStorage: (state, { payload }) => {
      state.user = payload || null;
    },
    //has to change
    setLogout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      try {
        sessionStorage.removeItem("user");
      } catch {
        /* ignore */
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.status = "loading"; s.error = null; });
    b.addCase(login.fulfilled, (s, { payload }) => {
      s.status = "succeeded";
      s.user = payload;
      try { sessionStorage.setItem("user", JSON.stringify(payload)); } catch { /* empty */ }
    });
    b.addCase(login.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  },
});

export const { setUserFromStorage, setLogout } = slice.actions;
export default slice.reducer;

export const selectUser = (st) => st.login.user;
export const selectRole = (st) => st.login.user?.roleName || null;
export const selectUserId = (st) => st.login.user?.id || null;
export const selectIsLoginSuccess = (st) => st.login.status === "succeeded";
