import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import firmsReducer from "../features/firms/firmsSlice";
import loginReducer from "../features/auth/loginSlice";
import registrationReducer from "../features/auth/registrationSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";
import domainDataReducer from "../features/domain/domainDataSlice.js";
import challengesReducer from "../features/challenges/challengesSlice.js"
import getAllUsersReducer from "../features/auth/getAllUsersSlice.js";
import getAllEnquiriesReducer from "../features/auth/getAllEnquiriesSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    getAllUsers: getAllUsersReducer,
    getAllEnquiries: getAllEnquiriesReducer,
    firms: firmsReducer,
    challenges: challengesReducer,
    login: loginReducer,
    registration: registrationReducer,
    reviews: reviewsReducer,
    domainData: domainDataReducer,
  },
  // middleware: (gDM) => gDM() // default is fine; RTK includes thunk
});

export default store;
