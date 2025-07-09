import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Table
  selectedRowData: null, // { id: <RecordId>, createdDate: <Date>, fields: <FieldSet> }
  // Form Modal
  formData: null, // { <fieldName>: <fieldValue> } : Initial<TableName>Form
  formError: {}, // { hasError: <boolean>, fieldError: <fieldName>, errorMsg: <string> }
  formSubmit: {}, // { <fieldName>: <fieldValue> } object that use to submit to Airtable
  formClientFormular: [],
  // LinkReferenceBox Modal
  linkReferenceBoxName: null,
  linkReferenceBoxModalShow: false,
  linkReferenceBoxModalFaded: false,
  linkReferenceBoxValue: undefined,
  linkReferenceBoxFieldMeta: null,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState: initialState,
  reducers: {
    // Table
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
      state.formError = {};
      state.formSubmit = {};
      state.formClientFormular = [];
    },
    undoFormData: (state) => {
      state.formSubmit = {};
      state.formError = {};
    },
    // LinkReferenceBox
    openLinkReferenceBackground: (state) => {
      state.linkReferenceBoxModalFaded = true;
    },
    closeLinkReferenceBackground: (state) => {
      state.linkReferenceBoxModalFaded = false;
    },
    openLinkReferenceBox: (state) => {
      state.linkReferenceBoxModalShow = true;
    },
    closeLinkReferenceBox: (state) => {
      state.linkReferenceBoxModalShow = false;
    },
    setLinkReferenceBoxContent: (state, actions) => {
      state.linkReferenceBoxName = actions.payload.name;
      state.linkReferenceBoxFieldMeta = actions.payload.fieldMetadata;
      state.linkReferenceBoxValue = actions.payload.value;
    },
    clearLinkReferenceBoxContent: (state) => {
      state.linkReferenceBoxName = null;
      state.linkReferenceBoxFieldMeta = null;
      state.linkReferenceBoxValue = undefined;
    },
    setLinkReferenceBoxValue: (state, actions) => {
      state.linkReferenceBoxValue = actions.payload.value;
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
  openLinkReferenceBackground,
  closeLinkReferenceBackground,
  openLinkReferenceBox,
  closeLinkReferenceBox,
  setLinkReferenceBoxContent,
  clearLinkReferenceBoxContent,
  setLinkReferenceBoxValue,
  setLinkReferenceBoxError,
} = editorSlice.actions;
export const selectSelectedRowData = (state) => state.editor.selectedRowData;
export const selectFormData = (state) => state.editor.formData;
export const selectFormError = (state) => state.editor.formError;
export const selectFormSubmit = (state) => state.editor.formSubmit;
export const selectLinkReferenceModalShow = (state) =>
  state.editor.linkReferenceBoxModalShow;
export const selectLinkReferenceModalFaded = (state) =>
  state.editor.linkReferenceBoxModalFaded;
export const selectLinkReferenceName = (state) =>
  state.editor.linkReferenceBoxName;
export const selectLinkReferenceFieldMetadata = (state) =>
  state.editor.linkReferenceBoxFieldMeta;
export const selectLinkReferenceValue = (state) =>
  state.editor.linkReferenceBoxValue;

export default editorSlice.reducer;
