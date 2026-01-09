import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
import axiosAdmin from "../../api/axiosAdmin";

export const getAllEnquiries = createAsyncThunk(
  API_ENDPOINTS.USERS.ENQUIRIES,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosAdmin.get(
        getFullUrl(API_ENDPOINTS.USERS.ENQUIRIES)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Failed to fetch enquiries" }
      );
    }
  }
);

const initialState = {
  contacts: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const getAllEnquiriesSlice = createSlice({
  name: "getAllEnquiries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEnquiries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllEnquiries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(getAllEnquiries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default getAllEnquiriesSlice.reducer;

export const selectAllEnquiries = (state) => state.getAllEnquiries?.contacts || [];
export const getAllEnquiriesStatus = (state) => state.getAllEnquiries?.status;
export const getAllEnquiriesError = (state) => state.getAllEnquiries?.error;
