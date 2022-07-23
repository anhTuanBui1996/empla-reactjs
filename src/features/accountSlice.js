import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewRecord,
  retrieveData,
  updateRecord,
} from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  progressing: null,
  accountTableData: null,
  newAccountData: null,
  willBeUpdatedAccountData: null,
  willUpdatingAccountData: null,
  updatedAccountData: null,
  selectedAccountForEdit: null,
  deletedAccountData: null,
  error: null,
};

export const retrieveAccountList = createAsyncThunk(
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

export const deleteExistingAccount = createAsyncThunk(
  "account/delete",
  async (data) => {
    const res = await updateRecord("Account", data);
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
    setNewAccountData: (state, action) => {
      state.newAccountData = action.payload;
    },
    setSelectedAccountForEdit: (state, action) => {
      state.selectedAccountForEdit = action.payload;
    },
    setWillBeUpdatedAccountData: (state, action) => {
      state.willBeUpdatedAccountData = action.payload;
    },
    setWillUpdatingAccountData: (state, action) => {
      state.willUpdatingAccountData = action.payload;
    },
    setUpdatedAccountData: (state, action) => {
      state.updatedAccountData = action.payload;
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
      .addCase(retrieveAccountList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.accountTableData = null;
        state.progressing = action.type;
      })
      .addCase(retrieveAccountList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.accountTableData = null;
        state.progressing = action.type;
      })
      .addCase(retrieveAccountList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.accountTableData = action.payload;
        state.progressing = action.type;
      })
      .addCase(createNewAccount.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.newAccountData = null;
        state.progressing = action.type;
      })
      .addCase(createNewAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.newAccountData = null;
        state.progressing = action.type;
      })
      .addCase(createNewAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.newAccountData = action.payload;
        state.progressing = action.type;
      })
      .addCase(updateExistingAccount.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.willUpdatingAccountData = null;
        state.updatedAccountData = null;
        state.progressing = action.type;
      })
      .addCase(updateExistingAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.willUpdatingAccountData = action.meta.arg;
        state.updatedAccountData = null;
        state.progressing = action.type;
      })
      .addCase(updateExistingAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.willUpdatingAccountData = action.meta.arg;
        state.updatedAccountData = action.payload;
        state.progressing = action.type;
      })
      .addCase(deleteExistingAccount.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.deletedAccountData = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.deletedAccountData = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.deletedAccountData = action.payload;
        state.selectedAccountForEdit = null;
        state.progressing = action.type;
      });
  },
});

export const {
  setLoading,
  setNewAccountData,
  setSelectedAccountForEdit,
  setWillBeUpdatedAccountData,
  setWillUpdatingAccountData,
  setUpdatedAccountData,
  setProgressing,
  setError,
} = accountSlice.actions;
export const selectLoading = (state) => state.account.loading;
export const selectIsSuccess = (state) => state.account.isSuccess;
export const selectProgressing = (state) => state.account.progressing;
export const selectAccountTableData = (state) => state.account.accountTableData;
export const selectNewAccountData = (state) => state.account.newAccountData;
export const selectWillBeUpdatedAccountData = (state) =>
  state.account.willBeUpdatedAccountData;
export const selectWillUpdatingAccountData = (state) =>
  state.account.willUpdatingAccountData;
export const selectUpdatedAccountData = (state) =>
  state.account.updatedAccountData;
export const selectSelectedAccountForEdit = (state) =>
  state.account.selectedAccountForEdit;
export const selectDeletedAccountData = (state) =>
  state.account.deletedAccountData;
export const selectError = (state) => state.account.error;

export default accountSlice.reducer;
