import { FIELD_DATE_TYPE } from "../constants";
import tableConfig from "./../utils/airtable";

/**
 * Read data from Airtable, the result is
 * array of object that has properties below
 * * createdTime: string | (time string can be parse),
 * * fields: object | { ...fieldName: cellValue } | data object of record
 * * id: string | the record id (format: rec...)
 * @param {String} tableName table name string match with Airtable
 * @param {Object} formula object that has params for the result
 * @param {Object} config object that has config the source data
 * @returns a promise that have the result data from airtable
 */
const retrieveData = async (tableName, formula, config) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = await newConfig.read(formula, config);
    return res;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Mapping from retrieveData res into new array,
 * use for insert the Table component
 * @param {Array} res res Array from retrieveData function
 * @param {Array} fieldList field name list to map from res
 * @returns {Array} the array has been mapped,
 * the index is mapped with fieldList
 * element object of return array
 * * {rowId: string, data: any[] string|array|object}
 */
const mapResultToTableData = (res, fieldList) => {
  let dataList = [];
  res.forEach((recordData) => {
    dataList.push({
      rowId: recordData.id,
      fieldList,
      data: fieldList.map((field) => {
        let cellData = recordData.fields[field];
        if (FIELD_DATE_TYPE.includes(field))
          return new Date(Date.parse(cellData)).toLocaleString();
        return cellData;
      }),
    });
  });
  return dataList;
};

/**
 * Create a new record on Airtable,
 * @param {String} tableName table name string match with Airtable
 * @param {Object} data data object to insert to Airtable
 * * { ...fieldName: value }, the field name that must
 * match the one on Airtable
 * @returns the new record object from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const createNewRecord = async (tableName, data) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = await newConfig.create(data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Update an existing record on Airtable,
 * @param {String} tableName table name string match with Airtable
 * @param {String} rowId the record id of updating one
 * @param {Object} data data object that is updated to Airtable
 * * { ...fieldName: value }, the field name that must
 * match the one on Airtable, the data object will merge with the
 * old one - so the data object is only need the updating fields
 * @returns the new record object from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const updateRecord = async (tableName, rowId, data) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = await newConfig.update(rowId, data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param {String} tableName table name string match with Airtable
 * @param {String} whereString the filter formula for searching record
 * * ex. `StaffId = "${staffId}"`
 * @param {Object} data data object that is updated to Airtable
 * * { ...fieldName: value }, the field name that must
 * match the one on Airtable, the data object will merge with the
 * old one - so the data object is only need the updating fields
 * @returns the new record object from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const updateRecordWhere = async (tableName, whereString, data) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = await newConfig.updateWhere(whereString, data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Delete a record with RecordId (rowId)
 * @param {String} tableName table name string match with Airtable
 * @param {String} rowId the record id of updating one
 * @returns the record that has been deleted from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const deleteRecord = async (tableName, rowId) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = await newConfig.delete(rowId);
    return res;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Delete a record with RecordId (rowId)
 * @param {String} tableName table name string match with Airtable
 * @param {String} whereString the filter formula for searching record
 * * ex. `StaffId = "${staffId}"`
 * @returns the record that has been deleted from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const deleteRecordWhere = async (tableName, whereString) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = await newConfig.deleteWhere(whereString);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export {
  retrieveData,
  mapResultToTableData,
  createNewRecord,
  updateRecord,
  updateRecordWhere,
  deleteRecord,
  deleteRecordWhere,
};
