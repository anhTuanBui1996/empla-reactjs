import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userCredential: null,
  error: {
    status: false,
    type: "",
    message: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserCredential: (state, action) => {
      state.userCredential = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserCredential, setLoading, setError } = userSlice.actions;
export const selectUserCredential = (state) => state.user.userCredential;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
