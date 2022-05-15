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
  staffTableData: null,
  newStaffData: null,
  willBeUpdatedStaffData: null,
  willUpdatingStaffData: null,
  updatedStaffData: null,
  selectedStaffForEdit: null,
  deletedStaffData: null,
  error: null,
};

export const retriveStaffList = createAsyncThunk("staff/fetch", async () => {
  const res = await retrieveData("Staff");
  return res;
});

export const createNewStaff = createAsyncThunk("staff/create", async (data) => {
  const res = await createNewRecord("Staff", data);
  return res;
});

export const updateExistingStaff = createAsyncThunk(
  "staff/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Staff", recordId, updateData);
    return res;
  }
);

export const deleteExistingStaff = createAsyncThunk(
  "staff/delete",
  async (data) => {
    const res = await deleteRecord("Staff", data);
    return res;
  }
);

export const staffSlice = createSlice({
  name: "staff",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNewStaffData: (state, action) => {
      state.newStaffData = action.payload;
    },
    setSelectedStaffForEdit: (state, action) => {
      state.selectedStaffForEdit = action.payload;
    },
    setWillBeUpdatedStaffData: (state, action) => {
      state.willBeUpdatedStaffData = action.payload;
    },
    setWillUpdatingStaffData: (state, action) => {
      state.willUpdatingStaffData = action.payload;
    },
    setUpdatedStaffData: (state, action) => {
      state.updatedStaffData = action.payload;
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
      .addCase(retriveStaffList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.staffTableData = null;
        state.progressing = action.type;
      })
      .addCase(retriveStaffList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.staffTableData = null;
        state.progressing = action.type;
      })
      .addCase(retriveStaffList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.staffTableData = action.payload;
        state.progressing = action.type;
      })
      .addCase(createNewStaff.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.newStaffData = null;
        state.progressing = action.type;
      })
      .addCase(createNewStaff.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.newStaffData = null;
        state.progressing = action.type;
      })
      .addCase(createNewStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.newStaffData = action.payload;
        state.progressing = action.type;
      })
      .addCase(updateExistingStaff.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.willUpdatingStaffData = null;
        state.updatedStaffData = null;
        state.progressing = action.type;
      })
      .addCase(updateExistingStaff.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.willUpdatingStaffData = action.meta.arg;
        state.updatedStaffData = null;
        state.progressing = action.type;
      })
      .addCase(updateExistingStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.willUpdatingStaffData = action.meta.arg;
        state.updatedStaffData = action.payload;
        state.progressing = action.type;
      })
      .addCase(deleteExistingStaff.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.deletedStaffData = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingStaff.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.deletedStaffData = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.deletedStaffData = action.payload;
        state.selectedStaffForEdit = null;
        state.progressing = action.type;
      });
  },
});

export const {
  setLoading,
  setNewStaffData,
  setSelectedStaffForEdit,
  setWillBeUpdatedStaffData,
  setWillUpdatingStaffData,
  setUpdatedStaffData,
  setProgressing,
  setError,
} = staffSlice.actions;
export const selectLoading = (state) => state.staff.loading;
export const selectIsSuccess = (state) => state.staff.isSuccess;
export const selectProgressing = (state) => state.staff.progressing;
export const selectStaffTableData = (state) => state.staff.staffTableData;
export const selectNewStaffData = (state) => state.staff.newStaffData;
export const selectSelectedStaffForEdit = (state) =>
  state.staff.selectedStaffForEdit;
export const selectWillBeUpdatedStaffData = (state) =>
  state.staff.willBeUpdatedStaffData;
export const selectWillUpdatingStaffData = (state) =>
  state.staff.willUpdatingStaffData;
export const selectUpdatedStaffData = (state) => state.staff.updatedStaffData;
export const selectDeletedStaffData = (state) => state.staff.deletedStaffData;
export const selectError = (state) => state.staff.error;

export default staffSlice.reducer;
