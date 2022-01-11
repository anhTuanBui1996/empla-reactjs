import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  now: Date.now(),
};

export const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setTimeNow: (state, action) => {
      state.now = action.payload;
    },
  },
});

export const { setTimeNow } = timeSlice.actions;
export const selectTimeNow = (state) => state.time.now;

export default timeSlice.reducer;
