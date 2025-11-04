import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import firmsReducer from "../features/firms/firmsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    firms: firmsReducer,
  },
  // middleware: (gDM) => gDM() // default is fine; RTK includes thunk
});

export default store;
