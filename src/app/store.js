import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./../features/userSlice";
import windowReducer from "./../features/windowSlice";
import timeReducer from "../features/timeSlice";
import selectListReducer from "../features/selectListSlice";
import staffReducer from "../features/staffSlice";
import checkinReducer from "../features/checkinSlice";
import geolocationSlice from "../features/geolocationSlice";
import roleSlice from "../features/roleSlice";
import logsSlice from "../features/logsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    window: windowReducer,
    time: timeReducer,
    selectList: selectListReducer,
    staff: staffReducer,
    checkin: checkinReducer,
    geolocation: geolocationSlice,
    role: roleSlice,
    logs: logsSlice,
  },
});
