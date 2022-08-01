import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  retrieveData,
  updateRecord,
  deleteRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  roleTableData: null,
  newRoleData: null,
  willBeUpdatedRoleData: null,
  willUpdatingRoleData: null,
  updatedRoleData: null,
  selectedRoleData: null,
  deletedRoleData: null,
  error: null,
};

export const retrieveRoleList = createAsyncThunk("role/retrieve", async () => {
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
      .addCase(retrieveRoleList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retrieveRoleList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retrieveRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.roleTableData = action.payload;
      });
  },
});

export const { 
  setLoading, 
  setRoleTableData,
  setError,
 } = roleSlice.actions;
export const selectLoading = (state) => state.role.loading;
export const selectIsSuccess = (state) => state.role.isSuccess;
export const selectRoleTableData = (state) => state.role.roleTableData;
export const selectNewRoleData = (state) => state.role.newRoleData;
export const selectWillBeUpdatedRoleData = (state) => state.role.willBeUpdatedRoleData;
export const selectWillUpdatingRoleData = (state) => state.role.willUpdatingRoleData;
export const selectUpdatedRoleData = (state) => state.role.updatedRoleData;
export const selectSelectedRoleData = (state) => state.role.selectedRoleData;
export const selectDeletedRoleData = (state) => state.role.deletedRoleData;
export const selectError = (state) => state.role.error;

export default roleSlice.reducer;
