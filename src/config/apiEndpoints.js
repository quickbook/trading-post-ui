export const API_BASE_URL = '/tradingpost';

export const API_ENDPOINTS = {
  AUTH: {
    TOKEN: '/auth/token',
    REFRESH: '/auth/refresh'
  },

  USERS: {
    BASE: '/api/v1/users',
    REGISTER: '/api/v1/users/register',
    LOGIN: '/api/v1/users/login'
  },

  DOMAIN_DATA: {
    BASE: '/api/v1/domain',
    COUNTRIES: '/api/v1/domain/countries',
    ROLES: '/api/v1/domain/roles',
    PLATFORMS: '/api/v1/domain/platforms',
    INSTRUMENTS: '/api/v1/domain/instruments',
    TIERS: "/api/v1/domain/tiers",
    PHASES: "/api/v1/domain/challenge-phases",
    PAYOUT_FREQUENCIES: "api/v1/domain/payout-frequencies",
    CURRENCIES: "/tradingpost/api/v1/domain/currencies",
  },

  FIRMS: {
    BASE: '/api/v1/firms',
    FILTER_OPTIONS: '/api/v1/firms/firmDmnList',
    BY_ID: (id) => `/api/v1/firms/${id}`,
    CHALLENGES: (firmId) => `/api/v1/firms/${firmId}/challenges`
  },

  CHALLENGES: {
    BASE: '/api/v1/challenges',
    BY_ID: (challengeId) => `/api/v1/challenges/${challengeId}`,
    BY_FIRM: (firmId) => `/api/v1/challenges/firm/${firmId}`,
  },

  REVIEWS: {
    BASE: '/api/v1/reviews',
    BY_FIRM: (firmId) => `/api/v1/reviews/firm/${firmId}`,
    BY_ID: (reviewId) => `/api/v1/reviews/${reviewId}`
  }
};

// Utility function to get full URL
export const getFullUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;