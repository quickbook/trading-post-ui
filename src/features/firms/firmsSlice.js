import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

/**
 * ============================
 * ASYNC THUNKS (API CALLS)
 * ============================
 */

// 🔹 GET all firms
export const fetchFirmsData = createAsyncThunk(
  "firms/fetchFirmsData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/v1/firms");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch firms");
    }
  }
);

// 🔹 CREATE a new firm
export const createFirm = createAsyncThunk(
  "firms/createFirm",
  async (newFirm, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/v1/firms", newFirm);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create firm");
    }
  }
);

// 🔹 UPDATE existing firm
export const updateFirm = createAsyncThunk(
  "firms/updateFirm",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/api/v1/firms/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update firm");
    }
  }
);

// 🔹 DELETE firm
export const deleteFirm = createAsyncThunk(
  "firms/deleteFirm",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/api/v1/firms/${id}`);
      return id; // Return the deleted firm's ID
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete firm");
    }
  }
);

/**
 * ============================
 * SLICE
 * ============================
 */

const firmsSlice = createSlice({
  name: "firms",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearFirms: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH FIRMS
    builder
      .addCase(fetchFirmsData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFirmsData.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.data = payload;
      })
      .addCase(fetchFirmsData.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });

    // CREATE FIRM
    builder
      .addCase(createFirm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createFirm.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.data.push(payload);
      })
      .addCase(createFirm.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });

    // UPDATE FIRM
    builder
      .addCase(updateFirm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFirm.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        const index = state.data.findIndex((f) => f.id === payload.id);
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(updateFirm.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });

    // DELETE FIRM
    builder
      .addCase(deleteFirm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFirm.fulfilled, (state, { payload: id }) => {
        state.status = "succeeded";
        state.data = state.data.filter((f) => f.id !== id);
      })
      .addCase(deleteFirm.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });
  },
});

export const { clearFirms } = firmsSlice.actions;
export default firmsSlice.reducer;

/**
 * ============================
 * SELECTORS
 * ============================
 */
export const selectFirms = (state) => state.firms.data;
export const selectFirmsStatus = (state) => state.firms.status;
export const selectFirmsError = (state) => state.firms.error;
