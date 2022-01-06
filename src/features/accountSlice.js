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
    setProgressing: (state, action) => {
      state.progressing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retriveAccountList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.progressing = action.type;
      })
      .addCase(retriveAccountList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.progressing = action.type;
      })
      .addCase(retriveAccountList.fulfilled, (state, action) => {
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
        state.progressing = action.type;
      })
      .addCase(createNewAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
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
        state.progressing = action.type;
      })
      .addCase(updateExistingAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.progressing = action.type;
      })
      .addCase(updateExistingAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.updatedAccountData = action.payload;
        state.progressing = action.type;
      })
      .addCase(deleteExistingAccount.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.error = null;
        state.progressing = action.type;
      })
      .addCase(deleteExistingAccount.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = action.error;
        state.progressing = action.type;
      })
      .addCase(deleteExistingAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
        state.updatedAccountData = null;
        state.selectedAccountForEdit = null;
        state.progressing = action.type;
      });
  },
});

export const {
  setLoading,
  setNewAccountData,
  setSelectedAccountForEdit,
  setProgressing,
  setError,
} = accountSlice.actions;
export const selectLoading = (state) => state.account.loading;
export const selectIsSuccess = (state) => state.account.isSuccess;
export const selectProgressing = (state) => state.account.progressing;
export const selectAccountTableData = (state) => state.account.accountTableData;
export const selectNewAccountData = (state) => state.account.newAccountData;
export const selectUpdatedAccountData = (state) =>
  state.account.updatedAccountData;
export const selectSelectedAccountForEdit = (state) =>
  state.account.selectedAccountForEdit;
export const selectError = (state) => state.account.error;

export default accountSlice.reducer;
