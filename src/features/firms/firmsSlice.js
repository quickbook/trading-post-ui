import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
const FETCH_FIRMS_ACTION = `firms${API_ENDPOINTS.FIRMS.BASE}`;

const initialState = {
  content: [],          // firms data
  pagination: {
    pageNumber: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
  },
  status: "idle",
  error: null,
  message: null
};


export const fetchFirmsData = createAsyncThunk(
 FETCH_FIRMS_ACTION,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.FIRMS.BASE));
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
   initialState,
  reducers: {
    // 🔹 Manually add a firm (local only)
    addFirm: (state, action) => {
      state.data.push(action.payload);
    },

    // 🔹 Update a firm by ID or index
    updateFirm: (state, action) => {
      const { id, updatedData } = action.payload.data;
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
         const { data, message, success } = action.payload;
        console.log("Fetched firms data:", action);
        state.status = "succeeded";
        if (success) {
          state.content = data.content;
          state.pagination = {
            pageNumber: data.pageable.pageNumber,
            pageSize: data.pageable.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages
          };
          state.message = message;
        }
      })
      .addCase(fetchFirmsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "Failed to fetch firms data";
      });
  },
});

export default firmsSlice.reducer;
