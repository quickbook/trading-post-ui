// src/features/auth/registrationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
// POST /api/auth/register -> { id, name, role }
export const registerUser = createAsyncThunk(
  "registration/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(getFullUrl(API_ENDPOINTS.USERS.REGISTER), payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

const slice = createSlice({
  name: "registration",
  initialState: { status: "idle", error: null, createdUser: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(registerUser.pending, (s) => { s.status = "loading"; s.error = null; s.createdUser = null; });
    b.addCase(registerUser.fulfilled, (s, { payload }) => { s.status = "succeeded"; s.createdUser = payload; });
    b.addCase(registerUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  },
});

export default slice.reducer;
