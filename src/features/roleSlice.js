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
  progressing: null,
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

export const createNewRole = createAsyncThunk("role/create", async (data) => {
  const res = await createNewRecord("Role", data);
  return res;
});

export const updateExistingRole = createAsyncThunk(
  "role/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Role", recordId, updateData);
    return res;
  }
);

export const deleteExistingRole = createAsyncThunk(
  "role/delete",
  async (data) => {
    const res = await deleteRecord("Role", data);
    return res;
  }
);

export const roleSlice = createSlice({
  name: "role",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNewRoleData: (state, action) => {
      state.newRoleData = action.payload;
    },
    setSelectedRoleData: (state, action) => {
      state.selectedRoleData = action.payload;
    },
    setWillBeUpdatedRoleData: (state, action) => {
      state.willBeUpdatedRoleData = action.payload;
    },
    setWillUpdatingRoleData: (state, action) => {
      state.willUpdatingRoleData = action.payload;
    },
    setUpdatedRoleData: (state, action) => {
      state.updatedRoleData = action.payload;
    },
    setProgressing: (state, action) => {
      state.progressing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
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
  setNewRoleData,
  setSelectedRoleData,
  setWillUpdatingRoleData,
  setWillBeUpdatedRoleData,
  setUpdatedRoleData,
  setProgressing,
  setError,
} = roleSlice.actions;
export const selectStateOfSlice = (state) => state.role;
export const selectLoading = (state) => state.role.loading;
export const selectIsSuccess = (state) => state.role.isSuccess;
export const selectProgressing = (state) => state.role.progressing;
export const selectRoleTableData = (state) => state.role.roleTableData;
export const selectNewRoleData = (state) => state.role.newRoleData;
export const selectSelectedRoleForEdit = (state) =>
  state.role.selectedRoleForEdit;
export const selectWillBeUpdatedRoleData = (state) =>
  state.role.willBeUpdatedRoleData;
export const selectWillUpdatingRoleData = (state) =>
  state.role.willUpdatingRoleData;
export const selectUpdatedRoleData = (state) => state.role.updatedRoleData;
export const selectSelectedRoleData = (state) => state.role.selectedRoleData;
export const selectDeletedRoleData = (state) => state.role.deletedRoleData;
export const selectError = (state) => state.role.error;

export default roleSlice.reducer;
