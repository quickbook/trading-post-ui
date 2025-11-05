// src/features/auth/loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// POST /api/auth/login -> { id, name, role: "admin"|"user" }
export const login = createAsyncThunk(
  "login/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/auth/login", credentials);
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
      s.status = "succeeded";
      s.user = payload;
      try { localStorage.setItem("user", JSON.stringify(payload)); } catch {}
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
export const selectRole = (st) => st.login.user?.role || "guest";
export const selectUserId = (st) => st.login.user?.id || null;
