import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./../features/userSlice";
import windowReducer from "./../features/windowSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    window: windowReducer,
  },
});
