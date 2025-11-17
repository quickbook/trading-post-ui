// src/features/domainData/domainDataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { API_ENDPOINTS, getFullUrl } from "../../config/apiEndpoints";

// Action string similar to your login slice
const FETCH_DOMAIN_DATA = `domaindata${API_ENDPOINTS.DOMAIN_DATA.BASE}`;

// GET /tradingpost/api/v1/domaindata/countries  ->  [ { code, name }, ... ]
export const fetchCountries = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/countries`,
  async (_, { rejectWithValue }) => {
    try {     
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.COUNTRIES));
      return res.data;
    } catch (err) {
      console.error("Error fetching countries:", err);
      return rejectWithValue(err.response?.data || "Failed to load countries");
    }
  }
);

// GET platforms
export const fetchPlatforms = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/platforms`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.PLATFORMS));
      return res.data;
    } catch (err) {
      console.error("Error fetching platforms:", err);
      return rejectWithValue(err.response?.data || "Failed to load platforms");
    }
  }
);

// GET instruments
export const fetchInstruments = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/instruments`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.INSTRUMENTS));
      return res.data;
    } catch (err) {
      console.error("Error fetching instruments:", err);
      return rejectWithValue(err.response?.data || "Failed to load instruments");
    }
  }
);

// GET tiers
export const fetchTiers = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/tiers`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.TIERS));
      return res.data;
    } catch (err) {
      console.error("Error fetching tiers:", err);
      return rejectWithValue(err.response?.data || "Failed to load tiers");
    }
  }
);

// GET phases
export const fetchPhases = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/phases`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.PHASES));
      return res.data;
    } catch (err) {
      console.error("Error fetching phases:", err);
      return rejectWithValue(err.response?.data || "Failed to load phases");
    }
  }
);

// GET payout frequencies
export const fetchPayoutFrequencies = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/payoutfrq`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.PAYOUT_FREQUENCIES));
      return res.data;
    } catch (err) {
      console.error("Error fetching payout frequencies:", err);
      return rejectWithValue(err.response?.data || "Failed to load payout frequencies");
    }
  }
);

// GET currencies
export const fetchCurrencies = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/currencies`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(getFullUrl(API_ENDPOINTS.DOMAIN_DATA.CURRENCIES));
      return res.data;
    } catch (err) {
      console.error("Error fetching currencies:", err);
      return rejectWithValue(err.response?.data || "Failed to load currencies");
    }
  }
);

// Fetch all domain data at once
export const fetchAllDomainData = createAsyncThunk(
  `${FETCH_DOMAIN_DATA}/all`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all([
        dispatch(fetchCountries()),
        dispatch(fetchPlatforms()),
        dispatch(fetchInstruments()),
        dispatch(fetchTiers()),
        dispatch(fetchPhases()),
        dispatch(fetchPayoutFrequencies()),
        dispatch(fetchCurrencies()),
      ]);
      return true;
    } catch (err) {
      console.error("Error fetching all domain data:", err);
      return rejectWithValue(err.response?.data || "Failed to load domain data");
    }
  }
);

const slice = createSlice({
  name: "domainData",
  initialState: {
    countries: [],
    platforms: [],
    instruments: [],
    tiers: [],
    phases: [],
    payoutfrq: [],
    currencies: [],
    status: "idle",      // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    lastFetched: null,
  },
  reducers: {
    resetDomainData: (state) => {
      state.countries = [];
      state.platforms = [];
      state.instruments = [];
      state.tiers = [];
      state.phases = [];
      state.payoutfrq = [];
      state.currencies = [];
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (b) => {
    // Countries
    b.addCase(fetchCountries.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(fetchCountries.fulfilled, (s, { payload }) => {
      s.countries = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchCountries.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load countries";
    });

    // Platforms
    b.addCase(fetchPlatforms.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchPlatforms.fulfilled, (s, { payload }) => {
      s.platforms = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchPlatforms.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load platforms";
    });

    // Instruments
    b.addCase(fetchInstruments.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchInstruments.fulfilled, (s, { payload }) => {
      s.instruments = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchInstruments.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load instruments";
    });

    // Tiers
    b.addCase(fetchTiers.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchTiers.fulfilled, (s, { payload }) => {
      s.tiers = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchTiers.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load tiers";
    });

    // Phases
    b.addCase(fetchPhases.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchPhases.fulfilled, (s, { payload }) => {
      s.phases = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchPhases.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load phases";
    });

    // Payout Frequencies
    b.addCase(fetchPayoutFrequencies.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchPayoutFrequencies.fulfilled, (s, { payload }) => {
      s.payoutfrq = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchPayoutFrequencies.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load payout frequencies";
    });

    // Currencies
    b.addCase(fetchCurrencies.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchCurrencies.fulfilled, (s, { payload }) => {
      s.currencies = Array.isArray(payload?.data) ? payload.data : payload;
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchCurrencies.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load currencies";
    });

    // Fetch All
    b.addCase(fetchAllDomainData.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(fetchAllDomainData.fulfilled, (s) => {
      s.status = "succeeded";
      s.lastFetched = Date.now();
    });
    b.addCase(fetchAllDomainData.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload || "Failed to load domain data";
    });
  },
});

export const { resetDomainData } = slice.actions;
export default slice.reducer;

// Selectors
export const selectCountries = (st) => st.domainData.countries;
export const selectPlatforms = (st) => st.domainData.platforms;
export const selectInstruments = (st) => st.domainData.instruments;
export const selectTiers = (st) => st.domainData.tiers;
export const selectPhases = (st) => st.domainData.phases;
export const selectPayoutFrequencies = (st) => st.domainData.payoutfrq;
export const selectCurrencies = (st) => st.domainData.currencies;
export const selectDomainDataStatus = (st) => st.domainData.status;
export const selectDomainDataError = (st) => st.domainData.error;

// Country selectors
export const selectCountryOptions = (state) => {
  const countries = state.domainData.countries || [];
  
  return countries.map((country) => {
    const code = country.countryCode || country.code || country.id || country.value;
    const name = country.countryName || country.name || country.label || String(country);
    
    return {
      value: code,
      label: name,
    };
  }).filter(option => option.value && option.label);
};

export const selectCountryNameByCode = (state, code) => {
  const countries = state.domainData.countries || [];
  const country = countries.find(
    c => (c.countryCode || c.code) === code
  );
  return country ? (country.countryName || country.name) : null;
};

// Generic selector factory for creating options from any domain data
const createOptionsSelector = (dataKey, codeField, nameField) => (state) => {
  const data = state.domainData[dataKey] || [];
  
  return data.map((item) => {
    const code = item[codeField] || item.code || item.id || item.value;
    const name = item[nameField] || item.name || item.label || String(item);
    
    return {
      value: code,
      label: name,
    };
  }).filter(option => option.value && option.label);
};