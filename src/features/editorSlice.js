import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: null, // { id: <RecordId>, createdDate: <Date>, fields: <FieldSet> }
  formError: null,
  formIsChanged: false,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState: initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setFormError: (state, action) => {
      state.formError = action.payload;
    },
    setFormIsChanged: (state, action) => {
      state.formIsChanged = action.payload;
    },
    resetFormData: (state, action) => {
      state.formData = null;
      state.formError = null;
    },
    resetFormError: (state, action) => {
      state.formError = null;
    },
  },
});

export const {
  setFormData,
  setFormError,
  setFormIsChanged,
  resetFormData,
  resetFormError,
} = editorSlice.actions;
export const selectFormData = (state) => state.editor.formData;
export const selectFormError = (state) => state.editor.formError;
export const selectFormIsChanged = (state) => state.editor.formIsChanged;

export default editorSlice.reducer;
