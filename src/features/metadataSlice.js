import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { retrieveMetadata } from "../services/airtable.service";

const initialState = {
  loading: false,
  isSuccess: false,
  airtableMetadata: null,
  error: null,
};

export const retrieveBaseMetadata = createAsyncThunk(
  "metadata/retrieve",
  async () => {
    const res = await retrieveMetadata();
    return res;
  }
);

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadata: (state, action) => {
      state.metadata = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveBaseMetadata.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.airtableMetadata = null;
        state.error = null;
      })
      .addCase(retrieveBaseMetadata.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.airtableMetadata = null;
        state.error = action.error;
      })
      .addCase(retrieveBaseMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.airtableMetadata = action.payload;
        state.error = null;
      });
  },
});

export const { setMetadata } = metadataSlice.actions;
export const selectMetadata = (state) => state.metadata.airtableMetadata;
export const selectLoading = (state) => state.metadata.loading;
export const selectIsSuccess = (state) => state.metadata.isSuccess;
export const selectError = (state) => state.metadata.error;

export default metadataSlice.reducer;
