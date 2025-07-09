import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  retrieveAllData,
  updateRecord,
  deleteRecord,
} from "../../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  progressing: null,
  workingPlaceTableData: null,
  newWorkingPlaceData: null,
  willBeUpdatedWorkingPlaceData: null,
  willUpdatingWorkingPlaceData: null,
  updatedWorkingPlaceData: null,
  selectedWorkingPlaceData: null,
  deletedWorkingPlaceData: null,
  error: null,
};

export const retrieveWorkingPlaceList = createAsyncThunk("workingPlace/retrieve", async () => {
  const res = await retrieveAllData("WorkingPlace");
  return res;
});

export const createNewWorkingPlace = createAsyncThunk("workingPlace/create", async (data) => {
  const res = await createNewRecord("WorkingPlace", data);
  return res;
});

export const updateExistingWorkingPlace = createAsyncThunk(
  "workingPlace/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("WorkingPlace", recordId, updateData);
    return res;
  }
);

export const deleteExistingWorkingPlace = createAsyncThunk(
  "workingPlace/delete",
  async (data) => {
    const res = await deleteRecord("WorkingPlace", data);
    return res;
  }
);

export const workingPlaceSlice = createSlice({
  name: "workingPlace",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNewWorkingPlaceData: (state, action) => {
      state.newWorkingPlaceData = action.payload;
    },
    setSelectedWorkingPlaceData: (state, action) => {
      state.selectedWorkingPlaceData = action.payload;
    },
    setWillBeUpdatedWorkingPlaceData: (state, action) => {
      state.willBeUpdatedWorkingPlaceData = action.payload;
    },
    setWillUpdatingWorkingPlaceData: (state, action) => {
      state.willUpdatingWorkingPlaceData = action.payload;
    },
    setUpdatedWorkingPlaceData: (state, action) => {
      state.updatedWorkingPlaceData = action.payload;
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
      .addCase(retrieveWorkingPlaceList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retrieveWorkingPlaceList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retrieveWorkingPlaceList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.workingPlaceTableData = action.payload;
      });
  },
});

export const {
  setLoading,
  setNewWorkingPlaceData,
  setSelectedWorkingPlaceData,
  setWillUpdatingWorkingPlaceData,
  setWillBeUpdatedWorkingPlaceData,
  setUpdatedWorkingPlaceData,
  setProgressing,
  setError,
} = workingPlaceSlice.actions;
export const selectStateOfSlice = (state) => state.workingPlace;
export const selectLoading = (state) => state.workingPlace.loading;
export const selectIsSuccess = (state) => state.workingPlace.isSuccess;
export const selectProgressing = (state) => state.workingPlace.progressing;
export const selectWorkingPlaceTableData = (state) => state.workingPlace.workingPlaceTableData;
export const selectNewWorkingPlaceData = (state) => state.workingPlace.newWorkingPlaceData;
export const selectSelectedWorkingPlaceForEdit = (state) =>
  state.workingPlace.selectedWorkingPlaceForEdit;
export const selectWillBeUpdatedWorkingPlaceData = (state) =>
  state.workingPlace.willBeUpdatedWorkingPlaceData;
export const selectWillUpdatingWorkingPlaceData = (state) =>
  state.workingPlace.willUpdatingWorkingPlaceData;
export const selectUpdatedWorkingPlaceData = (state) => state.workingPlace.updatedWorkingPlaceData;
export const selectSelectedWorkingPlaceData = (state) => state.workingPlace.selectedWorkingPlaceData;
export const selectDeletedWorkingPlaceData = (state) => state.workingPlace.deletedWorkingPlaceData;
export const selectError = (state) => state.workingPlace.error;

export const workingPlaceSliceForTableEditor = {
  actions: workingPlaceSlice.actions,
  selections: {
    state: selectStateOfSlice,
    loading: selectLoading,
    isSuccess: selectIsSuccess,
    progressing: selectProgressing,
    tableData: selectWorkingPlaceTableData,
    newRecord: selectNewWorkingPlaceData,
    updatedRecord: selectUpdatedWorkingPlaceData,
    deletedRecord: selectDeletedWorkingPlaceData,
    error: selectError,
  },
  cruds: {
    create: createNewWorkingPlace,
    read: retrieveWorkingPlaceList,
    update: updateExistingWorkingPlace,
    delete: deleteExistingWorkingPlace,
  },
};

export default workingPlaceSlice.reducer;
