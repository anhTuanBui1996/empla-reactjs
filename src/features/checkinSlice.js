import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createNewRecord, retrieveData } from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  checkinTableData: null,
  newCheckinData: null,
  error: null,
};

export const retrieveCheckinList = createAsyncThunk(
  "checkin/fetch",
  async (userStaffId) => {
    const res = await retrieveData("Checkin", `StaffId = "${userStaffId}"`);
    return res;
  }
);

export const createNewCheckin = createAsyncThunk(
  "checkin/create",
  async (data) => {
    const res = await createNewRecord("Checkin", data);
    return res;
  }
);

export const checkinSlice = createSlice({
  name: "checkin",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCheckinTableData: (state, action) => {
      state.checkinTableData = action.payload;
    },
    setNewCheckinData: (state, action) => {
      state.newCheckinData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveCheckinList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retrieveCheckinList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retrieveCheckinList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.checkinTableData = action.payload;
      })
      .addCase(createNewCheckin.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(createNewCheckin.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(createNewCheckin.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.newCheckinData = action.payload;
      });
  },
});

export const { setLoading, setCheckinTableData, setNewCheckinData } =
  checkinSlice.actions;
export const selectLoading = (state) => state.checkin.loading;
export const selectIsSuccess = (state) => state.checkin.isSuccess;
export const selectCheckinTableData = (state) => state.checkin.checkinTableData;
export const selectNewCheckinData = (state) => state.checkin.newCheckinData;
export const selectError = (state) => state.checkin.error;

export default checkinSlice.reducer;
