import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchFirmsData = createAsyncThunk(
  "firms/fetchFirmsData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/firmsData");
      return res.data; // expect array/object per your API
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch firms data"
      );
    }
  }
);

const firmsSlice = createSlice({
  name: "firms",
  initialState: {
    data: [], // All firms data
    status: "idle", // loading | succeeded | failed
    error: null, // error message if any
  },
  reducers: {
    // 🔹 Manually add a firm (local only)
    addFirm: (state, action) => {
      state.data.push(action.payload);
    },

    // 🔹 Update a firm by ID or index
    updateFirm: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.data.findIndex((firm) => firm.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updatedData };
      }
    },

    // 🔹 Remove a firm
    removeFirm: (state, action) => {
      const firmId = action.payload;
      state.data = state.data.filter((firm) => firm.id !== firmId);
    },

    // 🔹 Clear all firms (e.g., on logout)
    clearFirms: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },

  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      .addCase(fetchFirmsData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFirmsData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // set new data
      })
      .addCase(fetchFirmsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default firmsSlice.reducer;
