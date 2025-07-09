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
  collaboratoryTableData: null,
  newCollaboratoryData: null,
  willBeUpdatedCollaboratoryData: null,
  willUpdatingCollaboratoryData: null,
  updatedCollaboratoryData: null,
  selectedCollaboratoryData: null,
  deletedCollaboratoryData: null,
  error: null,
};

export const retrieveCollaboratoryList = createAsyncThunk("collaboratory/retrieve", async () => {
  const res = await retrieveAllData("Collaboratory");
  return res;
});

export const createNewCollaboratory = createAsyncThunk("collaboratory/create", async (data) => {
  const res = await createNewRecord("Collaboratory", data);
  return res;
});

export const updateExistingCollaboratory = createAsyncThunk(
  "collaboratory/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Collaboratory", recordId, updateData);
    return res;
  }
);

export const deleteExistingCollaboratory = createAsyncThunk(
  "collaboratory/delete",
  async (data) => {
    const res = await deleteRecord("Collaboratory", data);
    return res;
  }
);

export const collaboratorySlice = createSlice({
  name: "collaboratory",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNewCollaboratoryData: (state, action) => {
      state.newCollaboratoryData = action.payload;
    },
    setSelectedCollaboratoryData: (state, action) => {
      state.selectedCollaboratoryData = action.payload;
    },
    setWillBeUpdatedCollaboratoryData: (state, action) => {
      state.willBeUpdatedCollaboratoryData = action.payload;
    },
    setWillUpdatingCollaboratoryData: (state, action) => {
      state.willUpdatingCollaboratoryData = action.payload;
    },
    setUpdatedCollaboratoryData: (state, action) => {
      state.updatedCollaboratoryData = action.payload;
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
      .addCase(retrieveCollaboratoryList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retrieveCollaboratoryList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retrieveCollaboratoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.collaboratoryTableData = action.payload;
      });
  },
});

export const {
  setLoading,
  setNewCollaboratoryData,
  setSelectedCollaboratoryData,
  setWillUpdatingCollaboratoryData,
  setWillBeUpdatedCollaboratoryData,
  setUpdatedCollaboratoryData,
  setProgressing,
  setError,
} = collaboratorySlice.actions;
export const selectStateOfSlice = (state) => state.collaboratory;
export const selectLoading = (state) => state.collaboratory.loading;
export const selectIsSuccess = (state) => state.collaboratory.isSuccess;
export const selectProgressing = (state) => state.collaboratory.progressing;
export const selectCollaboratoryTableData = (state) => state.collaboratory.collaboratoryTableData;
export const selectNewCollaboratoryData = (state) => state.collaboratory.newCollaboratoryData;
export const selectSelectedCollaboratoryForEdit = (state) =>
  state.collaboratory.selectedCollaboratoryForEdit;
export const selectWillBeUpdatedCollaboratoryData = (state) =>
  state.collaboratory.willBeUpdatedCollaboratoryData;
export const selectWillUpdatingCollaboratoryData = (state) =>
  state.collaboratory.willUpdatingCollaboratoryData;
export const selectUpdatedCollaboratoryData = (state) => state.collaboratory.updatedCollaboratoryData;
export const selectSelectedCollaboratoryData = (state) => state.collaboratory.selectedCollaboratoryData;
export const selectDeletedCollaboratoryData = (state) => state.collaboratory.deletedCollaboratoryData;
export const selectError = (state) => state.collaboratory.error;

export const collaboratorySliceForTableEditor = {
  actions: collaboratorySlice.actions,
  selections: {
    state: selectStateOfSlice,
    loading: selectLoading,
    isSuccess: selectIsSuccess,
    progressing: selectProgressing,
    tableData: selectCollaboratoryTableData,
    newRecord: selectNewCollaboratoryData,
    updatedRecord: selectUpdatedCollaboratoryData,
    deletedRecord: selectDeletedCollaboratoryData,
    error: selectError,
  },
  cruds: {
    create: createNewCollaboratory,
    read: retrieveCollaboratoryList,
    update: updateExistingCollaboratory,
    delete: deleteExistingCollaboratory,
  },
};

export default collaboratorySlice.reducer;
