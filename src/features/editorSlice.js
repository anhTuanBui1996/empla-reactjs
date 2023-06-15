import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRowData: null, // { id: <RecordId>, createdDate: <Date>, fields: <FieldSet> }
  formData: null, // { <fieldName>: <fieldValue> } : Initial<TableName>Form
  formError: null,
  referencePickerValue: undefined,
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
    setReferencePickerValue: (state, action) => {
      state.referencePickerValue = action.payload;
    },
    resetFormData: (state, action) => {
      state.selectedRowData = null;
      state.formData = null;
      state.formError = null;
      state.isFormEditing = false;
    },
    resetFormError: (state, action) => {
      state.formError = null;
    },
  },
});

export const {
  setSelectedRowData,
  setFormData,
  setFormError,
  setReferencePickerValue,
  resetFormData,
  resetFormError,
} = editorSlice.actions;
export const selectSelectedRowData = (state) => state.editor.selectedRowData;
export const selectFormData = (state) => state.editor.formData;
export const selectFormError = (state) => state.editor.formError;

export default editorSlice.reducer;
