import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import firmsReducer from "../features/firms/firmsSlice";
import loginReducer from "../features/auth/loginSlice";
import registrationReducer from "../features/auth/registrationSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";
import domainDataReducer from "../features/domain/domainDataSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    firms: firmsReducer,
    login: loginReducer,
    registration: registrationReducer,
    reviews: reviewsReducer,
    domainData: domainDataReducer,
  },
  // middleware: (gDM) => gDM() // default is fine; RTK includes thunk
});

export default store;
