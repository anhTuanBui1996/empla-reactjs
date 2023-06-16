import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRowData: null, // { id: <RecordId>, createdDate: <Date>, fields: <FieldSet> }
  formData: null, // { <fieldName>: <fieldValue> } : Initial<TableName>Form
  formError: null,
  currentInputFocusing: undefined, // id of input form control focusing
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
    setCurrentInputFocusing: (state, action) => {
      state.currentInputFocusing = action.payload;
    },
    resetFormData: (state, action) => {
      state.selectedRowData = null;
      state.formData = null;
      state.formError = null;
      state.currentInputFocusing = undefined;
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
  setCurrentInputFocusing,
  resetFormData,
  resetFormError,
} = editorSlice.actions;
export const selectSelectedRowData = (state) => state.editor.selectedRowData;
export const selectFormData = (state) => state.editor.formData;
export const selectFormError = (state) => state.editor.formError;
export const selectCurrentInputFocusing = (state) =>
  state.editor.currentInputFocusing;

export default editorSlice.reducer;
