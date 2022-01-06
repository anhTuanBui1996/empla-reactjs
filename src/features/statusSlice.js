import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  retrieveData,
  updateRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  statusTableData: null,
  newStatusData: null,
  updatedStatusData: null,
  selectedStatusForEdit: null,
  error: null,
};

export const retriveStatusList = createAsyncThunk("status/fetch", async () => {
  const res = await retrieveData("Status");
  return res;
});

export const createNewStatus = createAsyncThunk(
  "status/create",
  async (data) => {
    const res = await createNewRecord("Status", data);
    return res;
  }
);

export const updateExistingStatus = createAsyncThunk(
  "status/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Status", recordId, updateData);
    return res;
  }
);

export const statusSlice = createSlice({
  name: "status",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSelectedStatusForEdit: (state, action) => {
      state.selectedStatusForEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retriveStatusList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retriveStatusList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retriveStatusList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.statusTableData = action.payload;
      })
      .addCase(createNewStatus.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(createNewStatus.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(createNewStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.newStatusData = action.payload;
      })
      .addCase(updateExistingStatus.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(updateExistingStatus.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(updateExistingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.updatedStatusData = action.payload;
      });
  },
});

export const { setLoading, setSelectedStatusForEdit } = statusSlice.actions;
export const selectLoading = (state) => state.status.loading;
export const selectIsSuccess = (state) => state.status.isSuccess;
export const selectStatusTableData = (state) => state.status.statusTableData;
export const selectNewStatusData = (state) => state.status.newStatusData;
export const selectUpdatedStatusData = (state) =>
  state.status.updatedStatusData;
export const selectSelectedStatusForEdit = (state) =>
  state.status.selectedStatusForEdit;
export const selectError = (state) => state.status.error;

export default statusSlice.reducer;
