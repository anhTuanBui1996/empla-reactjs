import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  retrieveData,
  updateRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  accountTableData: null,
  newAccountData: null,
  updatedAccountData: null,
  selectedAccountForEdit: null,
  error: null,
};

export const retriveAccountList = createAsyncThunk(
  "account/fetch",
  async () => {
    const res = await retrieveData("Account");
    return res;
  }
);

export const createNewAccount = createAsyncThunk(
  "account/create",
  async (data) => {
    const res = await createNewRecord("Account", data);
    return res;
  }
);

export const updateExistingAccount = createAsyncThunk(
  "account/update",
  async (data) => {
    const { recordId, updateData } = data;
    const res = await updateRecord("Account", recordId, updateData);
    return res;
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSelectedAccountForEdit: (state, action) => {
      state.selectedAccountForEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retriveAccountList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(retriveAccountList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(retriveAccountList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.accountTableData = action.payload;
      })
      .addCase(createNewAccount.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(createNewAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(createNewAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.newAccountData = action.payload;
      })
      .addCase(updateExistingAccount.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(updateExistingAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
      })
      .addCase(updateExistingAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.updatedAccountData = action.payload;
      });
  },
});

export const { setLoading, setSelectedAccountForEdit } = accountSlice.actions;
export const selectLoading = (state) => state.account.loading;
export const selectIsSuccess = (state) => state.account.isSuccess;
export const selectAccountTableData = (state) => state.account.accountTableData;
export const selectNewAccountData = (state) => state.account.newAccountData;
export const selectUpdatedAccountData = (state) =>
  state.account.updatedAccountData;
export const selectSelectedAccountForEdit = (state) =>
  state.account.selectedAccountForEdit;
export const selectError = (state) => state.account.error;

export default accountSlice.reducer;
