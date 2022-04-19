import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { retrieveData } from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  roleTableData: null,
  error: null,
};

export const retriveRoleList = createAsyncThunk("role/fetch", async () => {
  const res = await retrieveData("Role");
  return res;
});

export const roleSlice = createSlice({
  name: "role",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRoleTableData: (state, action) => {
      state.roleTableData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retriveRoleList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retriveRoleList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retriveRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.roleTableData = action.payload;
      });
  },
});

export const { setLoading, setRoleTableData } = roleSlice.actions;
export const selectLoading = (state) => state.role.loading;
export const selectIsSuccess = (state) => state.role.isSuccess;
export const selectRoleTableData = (state) => state.role.roleTableData;
export const selectError = (state) => state.role.error;

export default roleSlice.reducer;
