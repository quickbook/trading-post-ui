import { isTokenExpired } from "../features/auth/authSlice";
import { fetchAuthToken, refreshAccessToken } from "../features/auth/authThunks";
import { fetchFirmsData } from "../features/firms/firmsSlice";

/**
 * initApp() should be dispatched once on app start.
 * It ensures you have a valid token, then loads firms data immediately.
 */
export const initApp = () => async (dispatch, getState) => {
  // 1) Ensure we have an access token
  const state = getState();
  const hasToken = !!state.auth.accessToken;

  if (!hasToken) {
    const r = await dispatch(fetchAuthToken());
    if (r.meta.requestStatus !== "fulfilled") return; // stop if failed
  } else if (isTokenExpired(getState())) {
    const r = await dispatch(refreshAccessToken());
    if (r.meta.requestStatus !== "fulfilled") return; // stop if failed
  }

  // 2) Immediately fetch firms data
  await dispatch(fetchFirmsData());
};
