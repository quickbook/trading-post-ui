import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";
import axiosAdmin from "../../api/axiosAdmin";
const FETCH_FIRMS_ACTION = `firms${API_ENDPOINTS.FIRMS.BASE}`;

const initialState = {
  content: [], // firms data
  currentFirm: null,
  filterOptions: [],
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },
  status: {
    firms: "idle",
    filterOptions: "idle",
    currentFirm: "idle",
  },
  error: null,
  message: null,
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

export const fetchFirmsFilterOptions = createAsyncThunk(
  `${FETCH_FIRMS_ACTION}/filter-options`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(
        getFullUrl(API_ENDPOINTS.FIRMS.FILTER_OPTIONS)
      );
      return res.data; // expect array/object per your API
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch firms data"
      );
    }
  }
);

// Fetch firm by ID
export const fetchFirmById = createAsyncThunk(
  `${FETCH_FIRMS_ACTION}/id`,
  async (firmId, { rejectWithValue }) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.FIRMS.BY_ID(firmId));
      const res = await axiosClient.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch firm details"
      );
    }
  }
);

// Create new firm
export const createFirm = createAsyncThunk(
  `${FETCH_FIRMS_ACTION}/new`,
  async (firmData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(
        getFullUrl(API_ENDPOINTS.FIRMS.BASE),
        firmData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create firm");
    }
  }
);

// Update firm
export const updateFirm = createAsyncThunk(
  `${FETCH_FIRMS_ACTION}/id`,
  async ({ id, firmData }, { rejectWithValue }) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.FIRMS.BY_ID(id));
      const res = await axiosAdmin.put(url, firmData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update firm");
    }
  }
);

// Delete firm
export const deleteFirm = createAsyncThunk(
  `${FETCH_FIRMS_ACTION}/id`,
  async (firmId, { rejectWithValue }) => {
    try {
      const url = getFullUrl(API_ENDPOINTS.FIRMS.BY_ID(firmId));
      const res = await axiosAdmin.delete(url);
      return { ...res.data, firmId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete firm");
    }
  }
);

const firmsSlice = createSlice({
  name: "firms",
  initialState,
  reducers: {
    // 🔹 Clear all firms (e.g., on logout)
    clearFirms: (state) => {
      state.content = [];
      state.currentFirm = null;
      state.pagination = {
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
      };
      state.status.firms = "idle";
      state.error = null;
      state.message = null;
    },
    // 🔹 Clear errors
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
  },

  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      // fetch firms
      .addCase(fetchFirmsData.pending, (state) => {
        state.status.firms = "loading";
        state.error = null;
      })
      .addCase(fetchFirmsData.fulfilled, (state, action) => {
        const { data, message, success } = action.payload;
        console.log("Fetched firms data:", action);
        state.status.firms = "succeeded";
        if (success) {
          state.content = data.content;
          state.pagination = {
            pageNumber: data.pageable.pageNumber,
            pageSize: data.pageable.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
          };
          state.message = message;
        }
      })
      .addCase(fetchFirmsData.rejected, (state, action) => {
        state.status.firms = "failed";
        state.error = action.payload.message || "Failed to fetch firms data";
      })
      // Fetch Firm Filter Options
      .addCase(fetchFirmsFilterOptions.pending, (state) => {
        state.status.filterOptions = "loading";
        state.error = null;
      })
      .addCase(fetchFirmsFilterOptions.fulfilled, (state, action) => {
        const { data, message, success } = action.payload;
        state.status.filterOptions = "succeeded";
        if (success) {
          state.filterOptions = data;
          state.message = message;
        }
      })
      .addCase(fetchFirmsFilterOptions.rejected, (state, action) => {
        state.status.filterOptions = "failed";
        state.error = action.payload?.message || "Failed to fetch firm details";
      })
      // Fetch Firm by ID
      .addCase(fetchFirmById.pending, (state) => {
        state.status.currentFirm = "loading";
        state.error = null;
      })
      .addCase(fetchFirmById.fulfilled, (state, action) => {
        const { data, message, success } = action.payload;
        state.status.currentFirm = "succeeded";
        if (success) {
          state.currentFirm = data;
          state.message = message;
        }
      })
      .addCase(fetchFirmById.rejected, (state, action) => {
        state.status.currentFirm = "failed";
        state.error = action.payload?.message || "Failed to fetch firm details";
      })
      // Create Firm
      .addCase(createFirm.fulfilled, (state, action) => {
        const { data, message, success } = action.payload;
        if (success) {
          // Add new firm to the beginning of the list
          state.content.unshift(data);
          state.pagination.totalElements += 1;
          state.message = message;
        }
      })
      .addCase(createFirm.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create firm";
      });

    // Update Firm
    // .addCase(updateFirm.fulfilled, (state, action) => {
    //   const { data, message, success } = action.payload;
    //   if (success) {
    //     // Update in content list
    //     const index = state.content.findIndex(firm => firm.id === data.id);
    //     if (index !== -1) {
    //       state.content[index] = data;
    //     }
    //     // Update current firm if it's the same
    //     if (state.currentFirm && state.currentFirm.id === data.id) {
    //       state.currentFirm = data;
    //     }
    //     state.message = message;
    //   }
    // })
    // .addCase(updateFirm.rejected, (state, action) => {
    //   state.error = action.payload?.message || "Failed to update firm";
    // })

    // Delete Firm
    // .addCase(deleteFirm.fulfilled, (state, action) => {
    //   const { success, firmId, message } = action.payload;
    //   if (success) {
    //     state.content = state.content.filter(firm => firm.id !== firmId);
    //     state.pagination.totalElements -= 1;
    //     // Clear current firm if it's the deleted one
    //     if (state.currentFirm && state.currentFirm.id === firmId) {
    //       state.currentFirm = null;
    //     }
    //     state.message = message;
    //   }
    // })
    // .addCase(deleteFirm.rejected, (state, action) => {
    //   state.error = action.payload?.message || "Failed to delete firm";
    // });
  },
});

export default firmsSlice.reducer;
