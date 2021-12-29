import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
};

export const windowSlice = createSlice({
  name: "window",
  initialState,
  reducers: {
    setInnerWidth: (state, action) => {
      state.innerWidth = action.payload;
    },
    setInnerHeight: (state, action) => {
      state.innerHeight = action.payload;
    },
  },
});

export const { setInnerWidth, setInnerHeight } = windowSlice.actions;
export const selectInnerWidth = (state) => state.window.innerWidth;
export const selectInnerHeight = (state) => state.window.innerHeight;

export default windowSlice.reducer;
