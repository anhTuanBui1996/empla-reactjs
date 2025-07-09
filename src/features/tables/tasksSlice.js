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
  tasksTableData: null,
  newTasksData: null,
  willBeUpdatedTasksData: null,
  willUpdatingTasksData: null,
  updatedTasksData: null,
  selectedTasksData: null,
  deletedTasksData: null,
  error: null,
};

export const retrieveTasksList = createAsyncThunk("tasks/retrieve", async () => {
  const res = await retrieveAllData("Tasks");
  return res;
});

export const createNewTasks = createAsyncThunk("tasks/create", async (data) => {
  const res = await createNewRecord("Tasks", data);
  return res;
});

export const updateExistingTasks = createAsyncThunk(
  "tasks/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Tasks", recordId, updateData);
    return res;
  }
);

export const deleteExistingTasks = createAsyncThunk(
  "tasks/delete",
  async (data) => {
    const res = await deleteRecord("Tasks", data);
    return res;
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNewTasksData: (state, action) => {
      state.newTasksData = action.payload;
    },
    setSelectedTasksData: (state, action) => {
      state.selectedTasksData = action.payload;
    },
    setWillBeUpdatedTasksData: (state, action) => {
      state.willBeUpdatedTasksData = action.payload;
    },
    setWillUpdatingTasksData: (state, action) => {
      state.willUpdatingTasksData = action.payload;
    },
    setUpdatedTasksData: (state, action) => {
      state.updatedTasksData = action.payload;
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
      .addCase(retrieveTasksList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retrieveTasksList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retrieveTasksList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.tasksTableData = action.payload;
      });
  },
});

export const {
  setLoading,
  setNewTasksData,
  setSelectedTasksData,
  setWillUpdatingTasksData,
  setWillBeUpdatedTasksData,
  setUpdatedTasksData,
  setProgressing,
  setError,
} = tasksSlice.actions;
export const selectStateOfSlice = (state) => state.tasks;
export const selectLoading = (state) => state.tasks.loading;
export const selectIsSuccess = (state) => state.tasks.isSuccess;
export const selectProgressing = (state) => state.tasks.progressing;
export const selectTasksTableData = (state) => state.tasks.tasksTableData;
export const selectNewTasksData = (state) => state.tasks.newTasksData;
export const selectSelectedTasksForEdit = (state) =>
  state.tasks.selectedTasksForEdit;
export const selectWillBeUpdatedTasksData = (state) =>
  state.tasks.willBeUpdatedTasksData;
export const selectWillUpdatingTasksData = (state) =>
  state.tasks.willUpdatingTasksData;
export const selectUpdatedTasksData = (state) => state.tasks.updatedTasksData;
export const selectSelectedTasksData = (state) => state.tasks.selectedTasksData;
export const selectDeletedTasksData = (state) => state.tasks.deletedTasksData;
export const selectError = (state) => state.tasks.error;

export const tasksSliceForTableEditor = {
  actions: tasksSlice.actions,
  selections: {
    state: selectStateOfSlice,
    loading: selectLoading,
    isSuccess: selectIsSuccess,
    progressing: selectProgressing,
    tableData: selectTasksTableData,
    newRecord: selectNewTasksData,
    updatedRecord: selectUpdatedTasksData,
    deletedRecord: selectDeletedTasksData,
    error: selectError,
  },
  cruds: {
    create: createNewTasks,
    read: retrieveTasksList,
    update: updateExistingTasks,
    delete: deleteExistingTasks,
  },
};

export default tasksSlice.reducer;
