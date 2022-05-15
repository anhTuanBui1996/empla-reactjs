import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewRecord,
  deleteRecord,
  updateRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  error: null,
  logsData: null,
};

export const createNewLog = createAsyncThunk("logs/create", async (data) => {
  const res = await createNewRecord("Logs", data);
  return res;
});

export const updateExistedLog = createAsyncThunk(
  "logs/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Logs", recordId, updateData);
    return res;
  }
);

export const deleteExistedRecord = createAsyncThunk(
  "logs/delete",
  async (data) => {
    const res = await deleteRecord("Logs", data);
    return res;
  }
);

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setLogsData: (state, action) => {
      state.logsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewLog.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.logsData = null;
      })
      .addCase(createNewLog.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.logsData = action.payload;
      })
      .addCase(createNewLog.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.logsData = null;
      })
      .addCase(updateExistedLog.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.logsData = null;
      })
      .addCase(updateExistedLog.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.logsData = action.payload;
      })
      .addCase(updateExistedLog.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.logsData = null;
      })
      .addCase(deleteExistedRecord.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.logsData = null;
      })
      .addCase(deleteExistedRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.logsData = action.payload;
      })
      .addCase(deleteExistedRecord.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.logsData = null;
      });
  },
});

export const { setLogsData } = logsSlice.actions;
export const selectLoading = (state) => state.logs.loading;
export const selectIsSuccess = (state) => state.logs.isSuccess;
export const selectError = (state) => state.logs.error;
export const selectLogsData = (state) => state.logs.logsData;

export default logsSlice.reducer;
