import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./../features/userSlice";
import windowReducer from "./../features/windowSlice";
import timeReducer from "../features/timeSlice";
import staffReducer from "../features/tables/staffSlice";
import checkinReducer from "../features/tables/checkinSlice";
import geolocationSlice from "../features/geolocationSlice";
import roleSlice from "../features/tables/roleSlice";
import workingPlaceSlice from "../features/tables/workingPlaceSlice";
import collaboratorySlice from "../features/tables/collaboratorySlice";
import tasksSlice from "../features/tables/tasksSlice";
import logsSlice from "../features/tables/logsSlice";
import metadataSlice from "../features/metadataSlice";
import editorSlice from "../features/editorSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    window: windowReducer,
    time: timeReducer,
    geolocation: geolocationSlice,
    staff: staffReducer,
    role: roleSlice,
    workingPlace: workingPlaceSlice,
    collaboratory: collaboratorySlice,
    tasks: tasksSlice,
    checkin: checkinReducer,
    logs: logsSlice,
    metadata: metadataSlice,
    editor: editorSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["editor/setFormData", "editor/setFormChange"],
        // Ignore these paths in the state
        ignoredPaths: ["editor"],
      },
    }),
});
