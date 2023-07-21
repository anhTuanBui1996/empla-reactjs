import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRowData: null, // { id: <RecordId>, createdDate: <Date>, fields: <FieldSet> }
  formData: null, // { <fieldName>: <fieldValue> } : Initial<TableName>Form
  formError: null, // { hasError: <boolean>, fieldError: <fieldName>, errorMsg: <string> }
  formSubmit: null, // { <fieldName>: <fieldValue> } object that use to submit to Airtable
  formClientFormular: []
};

export const editorSlice = createSlice({
  name: "editor",
  initialState: initialState,
  reducers: {
    setSelectedRowData: (state, action) => {
      state.selectedRowData = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setFormError: (state, action) => {
      state.formError = action.payload;
    },
    setFormSubmit: (state, action) => {
      state.formSubmit = action.payload;
    },
    resetFormData: (state) => {
      state.selectedRowData = null;
      state.formData = null;
      state.formError = null;
      state.formSubmit = null;
      state.formClientFormular = [];
    },
    undoFormData: (state) => {
      state.formSubmit = null;
      state.formError = null;
    },
  },
});

export const {
  setSelectedRowData,
  setFormData,
  setFormError,
  setFormSubmit,
  resetFormData,
  undoFormData,
} = editorSlice.actions;
export const selectSelectedRowData = (state) => state.editor.selectedRowData;
export const selectFormData = (state) => state.editor.formData;
export const selectFormError = (state) => state.editor.formError;
export const selectFormSubmit = (state) => state.editor.formSubmit;

export default editorSlice.reducer;
