import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  deleteRecord,
  retrieveData,
  updateRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  progressing: null,
  statusTableData: null,
  newStatusData: null,
  willBeUpdatedStatusData: null,
  willUpdatingStatusData: null,
  updatedStatusData: null,
  selectedStatusForEdit: null,
  deletedStatusData: null,
  error: null,
};

export const retrieveStatusList = createAsyncThunk("status/fetch", async () => {
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

export const deleteExistingStatus = createAsyncThunk(
  "status/delete",
  async (data) => {
    const res = await deleteRecord("Status", data);
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
    setNewStatusData: (state, action) => {
      state.newStatusData = action.payload;
    },
    setSelectedStatusForEdit: (state, action) => {
      state.selectedStatusForEdit = action.payload;
    },
    setWillBeUpdatedStatusData: (state, action) => {
      state.willBeUpdatedStatusData = action.payload;
    },
    setWillUpdatingStatusData: (state, action) => {
      state.willUpdatingStatusData = action.payload;
    },
    setUpdatedStatusData: (state, action) => {
      state.updatedStatusData = action.payload;
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
      .addCase(retrieveStatusList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.statusTableData = null;
        state.progressing = action.type;
      })
      .addCase(retrieveStatusList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.statusTableData = null;
        state.progressing = action.type;
      })
      .addCase(retrieveStatusList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.statusTableData = action.payload;
        state.progressing = action.type;
      })
      .addCase(createNewStatus.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.newStatusData = null;
        state.progressing = action.type;
      })
      .addCase(createNewStatus.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.newStatusData = null;
        state.progressing = action.type;
      })
      .addCase(createNewStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.newStatusData = action.payload;
        state.progressing = action.type;
      })
      .addCase(updateExistingStatus.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.willUpdatingStatusData = null;
        state.updatedStatusData = null;
        state.progressing = action.type;
      })
      .addCase(updateExistingStatus.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.willUpdatingStatusData = action.meta.arg;
        state.updatedStatusData = null;
        state.progressing = action.type;
      })
      .addCase(updateExistingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.willUpdatingStatusData = action.meta.arg;
        state.updatedStatusData = action.payload;
        state.progressing = action.type;
      })
      .addCase(deleteExistingStatus.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.deletedStatusData = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingStatus.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.deletedStatusData = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.deletedStatusData = action.payload;
        state.selectedStatusForEdit = null;
        state.progressing = action.type;
      });
  },
});

export const {
  setLoading,
  setNewStatusData,
  setSelectedStatusForEdit,
  setWillBeUpdatedStatusData,
  setWillUpdatingStatusData,
  setUpdatedStatusData,
  setProgressing,
  setError,
} = statusSlice.actions;
export const selectLoading = (state) => state.status.loading;
export const selectIsSuccess = (state) => state.status.isSuccess;
export const selectProgressing = (state) => state.status.progressing;
export const selectStatusTableData = (state) => state.status.statusTableData;
export const selectNewStatusData = (state) => state.status.newStatusData;
export const selectWillBeUpdatedStatusData = (state) =>
  state.status.willBeUpdatedStatusData;
export const selectWillUpdatingStatusData = (state) =>
  state.status.willUpdatingStatusData;
export const selectUpdatedStatusData = (state) =>
  state.status.updatedStatusData;
export const selectSelectedStatusForEdit = (state) =>
  state.status.selectedStatusForEdit;
export const selectDeletedStatusData = (state) =>
  state.status.deletedStatusData;
export const selectError = (state) => state.status.error;

export default statusSlice.reducer;
