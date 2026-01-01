import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
import axiosAdmin from "../../api/axiosAdmin";

export const getAllUsers = createAsyncThunk(
  API_ENDPOINTS.USERS.ALL_USERS,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosAdmin.get(
        getFullUrl(API_ENDPOINTS.USERS.ALL_USERS)
      );
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Failed to fetch users" }
      );
    }
  }
);

const initialState = {
  users: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const getAllUsersSlice = createSlice({
  name: "getAllUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default getAllUsersSlice.reducer;

export const selectAllUsers = (state) => state.getAllUsers?.users || [];
export const getUsersStatus = (state) => state.getAllUsers?.status;
export const getUsersError = (state) => state.getAllUsers?.error;
