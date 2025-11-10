// src/features/domainData/domainDataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";

// Action string similar to your login slice
const FETCH_COUNTRIES_ACTION = `domaindata${API_ENDPOINTS.DOMAIN_DATA.BASE}`;

// GET /tradingpost/api/v1/domaindata/countries  ->  [ { code, name }, ... ]
export const fetchCountries = createAsyncThunk(
  FETCH_COUNTRIES_ACTION,
  async (_, { rejectWithValue }) => {
    try {     
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.COUNTRIES));
      // Depending on your backend, this might be res.data or res.data.data
      // Adjust if your API wraps payloads.
      console.log(res)
      return res.data;
    } catch (err) {
      console.error("Error fetching countries:", err);
      return rejectWithValue(err.response?.data || "Failed to load countries");
    }
  }
);

const slice = createSlice({
  name: "domainData",
  initialState: {
    countries: [],       // [{ code, name }]
    status: "idle",      // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    lastFetched: null,
  },
  reducers: {
    resetDomainData: (state) => {
      state.countries = [];
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCountries.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(fetchCountries.fulfilled, (s, { payload }) => {
      console.log("Fetched countries:", payload);
      // If API uses { success, data }, switch to payload.data
      s.countries = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchCountries.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load countries";
    });
  },
});

export const { resetDomainData } = slice.actions;
export default slice.reducer;

// Selectors
export const selectCountries = (st) => st.domainData.countries;
export const selectCountriesStatus = (st) => st.domainData.status;
export const selectCountriesError = (st) => st.domainData.error;
export const selectCountryOptions = (st) =>
  (st.domainData.countries || []).map((c) => ({
    value: c.countryCode || c.code,
    label: c.countryName ?? c.label ?? String(c),
         
  }));
