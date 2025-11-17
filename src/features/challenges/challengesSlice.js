import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";

/**
 * ===================================
 * ASYNC THUNKS — CRUD API OPERATIONS
 * ===================================
 */

// 🔹 Fetch all challenges
export const fetchChallenges = createAsyncThunk(
  "challenges/fetchChallenges",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.CHALLENGES.BASE));
      return res.data; // should be an array of challenges
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch challenges");
    }
  }
);

// 🔹 Create a new challenge
export const createChallenge = createAsyncThunk(
  "challenges/createChallenge",
  async ({newChallenge, Firm_id}, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/v1/firms/${Firm_id}/challenges`, newChallenge);
      return res.data; // created challenge object
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create challenge");
    }
  }
);

// 🔹 Update an existing challenge
export const updateChallenge = createAsyncThunk(
  "challenges/updateChallenge",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(`/api/v1/challenges/${id}`, updatedData);
      return res.data; // updated challenge object
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update challenge");
    }
  }
);

// 🔹 Delete a challenge
export const deleteChallenge = createAsyncThunk(
  "challenges/deleteChallenge",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/api/v1/challenges/${id}`);
      return id; // return deleted challenge ID
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete challenge");
    }
  }
);

/**
 * ===================================
 * SLICE DEFINITION
 * ===================================
 */

const challengesSlice = createSlice({
  name: "challenges",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearChallenges: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 🟢 FETCH
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, { payload }) => {
        state.data = Array.isArray(payload?.data) ? payload.data : payload;
        state.status = "succeeded";
        state.error = payload;
      })
      .addCase(fetchChallenges.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });

    // 🟢 CREATE
    builder
      .addCase(createChallenge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createChallenge.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.data.push(payload);
      })
      .addCase(createChallenge.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });

    // 🟢 UPDATE
    builder
      .addCase(updateChallenge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateChallenge.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        const index = state.data.findIndex((c) => c.id === payload.id);
        if (index !== -1) {
          state.data[index] = payload;
        }
      })
      .addCase(updateChallenge.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });

    // 🟢 DELETE
    builder
      .addCase(deleteChallenge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteChallenge.fulfilled, (state, { payload: id }) => {
        state.status = "succeeded";
        state.data = state.data.filter((c) => c.id !== id);
      })
      .addCase(deleteChallenge.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });
  },
});

export const { clearChallenges } = challengesSlice.actions;
export default challengesSlice.reducer;

/**
 * ===================================
 * SELECTORS
 * ===================================
 */
export const selectChallenges = (state) => state.challenges.data;
export const selectChallengesStatus = (state) => state.challenges.status;
export const selectChallengesError = (state) => state.challenges.error;