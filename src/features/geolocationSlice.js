import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pos: null,
  coords: null,
  timestamp: null,
  isBrowserSupport: false,
};

export const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    setCoords: (state, action) => {
      state.coords = action.payload;
    },
    setTimestamp: (state, action) => {
      state.timestamp = action.payload;
    },
    setPos: (state, action) => {
      state.pos = action.payload;
    },
    setIsBrowserSupport: (state, action) => {
      state.isBrowserSupport = action.payload;
    },
  },
});

export const { setPos, setCoords, setTimestamp, setIsBrowserSupport } =
  geolocationSlice.actions;
export const selectPos = (state) => state.geolocation.pos;
export const selectCoords = (state) => state.geolocation.coords;
export const selectTimestamp = (state) => state.geolocation.timestamp;
export const selectIsBrowserSupport = (state) =>
  state.geolocation.isBrowserSupport;

export default geolocationSlice.reducer;
