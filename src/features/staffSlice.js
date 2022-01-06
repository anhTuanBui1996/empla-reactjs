import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  retrieveData,
  updateRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  staffTableData: null,
  newStaffData: null,
  updatedStaffData: null,
  selectedStaffForEdit: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(retriveStaffList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retriveStaffList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retriveStaffList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.staffTableData = action.payload;
      })
      .addCase(createNewStaff.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(createNewStaff.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(createNewStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.newStaffData = action.payload;
      })
      .addCase(updateExistingStaff.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(updateExistingStaff.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(updateExistingStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.updatedStaffData = action.payload;
      });
  },
});

export const { setLoading, setNewStaffData, setSelectedStaffForEdit } =
  staffSlice.actions;
export const selectLoading = (state) => state.staff.loading;
export const selectIsSuccess = (state) => state.staff.isSuccess;
export const selectStaffTableData = (state) => state.staff.staffTableData;
export const selectNewStaffData = (state) => state.staff.newStaffData;
export const selectUpdatedStaffData = (state) => state.staff.updatedStaffData;
export const selectSelectedStaffForEdit = (state) =>
  state.staff.selectedStaffForEdit;
export const selectError = (state) => state.staff.error;

export default staffSlice.reducer;
