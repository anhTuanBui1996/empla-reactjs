import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./../features/userSlice";
import windowReducer from "./../features/windowSlice";
import selectListReducer from "../features/selectListSlice";
import staffReducer from "../features/staffSlice";
import accountReducer from "../features/accountSlice";
import statusReducer from "../features/statusSlice";
import checkinReducer from "../features/checkinSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    window: windowReducer,
    selectList: selectListReducer,
    staff: staffReducer,
    account: accountReducer,
    status: statusReducer,
    checkin: checkinReducer,
  },
});
