import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { retrieveData } from "../services/airtable.service";

/**
 * optionList is array of object, all the select options list item
 * must have this 4 properties { "data-table", value, label, name }
 * * data-table: string - table name that got option list from
 * * value: string - the value of option (recordId if data-table is linked table)
 * * label: string - the display label (same as value or a field in linked table)
 * * name: string - the field name of option to get from its own table or linked table
 */
const initialState = {
  loading: false,
  isSuccess: false,
  optionList: null,
  error: null,
};

export const fetchAllEmptySelectList = createAsyncThunk(
  "selectList/retrieveAllEmpty",
  async (selectOptionState) => {
    let newState = { ...selectOptionState };
    let checkEmptySelectList = countEmptySelectList(newState);
    Object.keys(selectOptionState).forEach((tableKey) => {
      Object.keys(selectOptionState[tableKey]).forEach(async (fieldKey) => {
        if (selectOptionState[tableKey][fieldKey].list.length === 0) {
          const res = await retrieveData(
            selectOptionState[tableKey][fieldKey].fromTable
          );
          let fetchToList = newState[tableKey][fieldKey];
          fetchToList.list = res?.map((item) => ({
            "data-table": tableKey,
            value: item.id,
            // we want to display field Domain from Account table
            label:
              tableKey === "Account" ? item.fields.Domain : item.fields.Name,
            name: fieldKey,
          }));
        }
        checkEmptySelectList = countEmptySelectList(newState);
      });
    });
    if (checkEmptySelectList === 0) {
      return newState;
    }
  }
);

export const selectListSlice = createSlice({
  name: "selectList",
  initialState,
  reducers: {
    setSelectList: (state, action) => {
      state.optionList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmptySelectList.pending, (state, action) => {
        state.loading = true;
        state.isSuccess = false;
        state.optionList = initialState.optionList;
        state.error = null;
      })
      .addCase(fetchAllEmptySelectList.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.optionList = initialState.optionList;
        state.error = action.error;
      })
      .addCase(fetchAllEmptySelectList.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.optionList = action.payload;
        state.error = null;
      });
  },
});

export const { setSelectList } = selectListSlice.actions;
export const selectLoading = (state) => state.selectList.loading;
export const selectIsSuccess = (state) => state.selectList.isSuccess;
export const selectOptionList = (state) => state.selectList.optionList;
export const selectError = (state) => state.selectList.error;
export default selectListSlice.reducer;

// ==================================================================

const countEmptySelectList = (selectOptionState) => {
  let count = 0;
  Object.keys(selectOptionState).forEach((tableKey) => {
    Object.keys(selectOptionState[tableKey]).forEach((fieldKey) => {
      if (selectOptionState[tableKey][fieldKey].list === undefined) {
        count++
      } else if (selectOptionState[tableKey][fieldKey].list.length === 0) {
        count++;
      }
    });
  });
  return count;
};
