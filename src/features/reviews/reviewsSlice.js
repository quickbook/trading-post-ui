// src/features/reviews/reviewsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";

// Shapes expected:
// GET    /api/reviews                 -> Review[]
// POST   /api/reviews                 -> created Review
// PUT    /api/reviews/:id             -> updated Review
// DELETE /api/reviews/:id             -> { ok: true }
// Review: { id, product_id, prop_name, reviewer_name, reviewer_id, rating, description, created_at, updated_at, is_deleted }

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.REVIEWS.BASE));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch reviews");
    }
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(getFullUrl(API_ENDPOINTS.REVIEWS.BASE), payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create review");
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(getFullUrl(API_ENDPOINTS.REVIEWS.BY_ID(id)), data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.deletegetFullUrl(API_ENDPOINTS.REVIEWS.BY_ID(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete review");
    }
  }
);

const slice = createSlice({
  name: "reviews",
  initialState: { data: [], status: "idle", error: null },
  reducers: {
    clearReviews: (s) => { s.data = []; s.status = "idle"; s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchReviews.pending, (s) => { s.status = "loading"; s.error = null; });
    b.addCase(fetchReviews.fulfilled, (s, { payload }) => { s.status = "succeeded"; s.data = payload || []; });
    b.addCase(fetchReviews.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });

    b.addCase(createReview.fulfilled, (s, { payload }) => { s.data.unshift(payload); });
    b.addCase(updateReview.fulfilled, (s, { payload }) => {
      const i = s.data.findIndex(r => r.id === payload.id);
      if (i !== -1) s.data[i] = payload;
    });
    b.addCase(deleteReview.fulfilled, (s, { payload: id }) => {
      s.data = s.data.filter(r => r.id !== id);
    });
  },
});

export const { clearReviews } = slice.actions;
export default slice.reducer;

export const selectReviews = (st) => st.reviews.data;
export const selectReviewsStatus = (st) => st.reviews.status;
export const selectReviewsError = (st) => st.reviews.error;
