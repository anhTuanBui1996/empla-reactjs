import { AIRTABLE } from "../constants";
import base from "./../utils/airtable";
import axios from "axios";

/**
 * Read metadata of tables from Airtable base
 * @returns an object store metadata of tables from current base
 */
const retrieveMetadata = async () => {
  try {
    const baseId = AIRTABLE.BASE_ID;
    const authToken = AIRTABLE.API_KEY;
    const res = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data;
  } catch (e) {
    console.error("Error while getting base metadata...");
  }
};

/**
 * Read data from Airtable, the result is
 * array of _rawJson object that has properties below
 * * {@ createdTime}: string | (time string can be parse),
 * * fields: object | { ...fieldName: cellValue } | data object of record
 * * id: string | the record id (format: rec...)
 * @param {String} tableName table name string match with Airtable
 * @param {String} whereString string formula that filters the result
 * * read more
 * {@link https://support.airtable.com//docs/formula-field-reference| Airtable Filter Formula}
 * @returns an array that hase the result data from airtable
 */
const retrieveAllData = async (tableName, whereString) => {
  try {
    const res = await base(tableName)
      .select({
        view: "Grid view",
        filterByFormula: whereString === undefined ? "" : whereString,
      })
      .all();
    return res
      .map((record) => record._rawJson)
      .sort(
        (firstRecord, secondRecord) =>
          Date.parse(firstRecord.createdTime) -
          Date.parse(secondRecord.createdTime)
      );
  } catch (e) {
    console.error("Error while getting table records...");
  }
};

/**
 * Mapping from retrieveAllData res into new array,
 * use for insert the Table component
 * @param {Object[]} res result Array from retrieveAllData function
 * @param {String} tableName table name that get data from
 * @param {Array} fieldList field name list to map from res
 * @param {Object} tableMetadata metadata Object get from airtable
 * @returns {Array} the array has been mapped,
 * the index is mapped with fieldList
 * element object of return array
 * * {rowId: string, data: any[] string|array|object}
 */
const mapResultToTableData = (res, tableName, fieldList, tableMetadata) => {
  let dataList = [];
  res.forEach((recordData) => {
    dataList.push({
      rowId: recordData.id,
      tableName,
      columnList: fieldList,
      originalRecord: recordData,
      data: fieldList.map((fieldName) => {
        let cellData = recordData.fields[fieldName];
        let fieldMetadata = tableMetadata.fields.find(
          (field) => field.name === fieldName
        );
        let dataType = fieldMetadata.type;
        let sourceType = dataType;
        if (dataType === "multipleRecordLinks") {
          sourceType = "recordId";
        } else if (dataType === "multipleLookupValues") {
          sourceType = fieldMetadata.options.result.type;
        }
        return { cellData, dataType, sourceType };
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
  try {
    const res = await base(tableName).create([
      {
        fields: data,
      },
    ]);
    return res[0]._rawJson;
  } catch (e) {
    console.error("Error while creating table record...");
    return null;
  }
};

/**
 * Create a new record on Airtable,
 * @param {String} tableName table name string match with Airtable
 * @param {Object} data array of data object to insert to Airtable,
 * per object has fields like belows
 * * { fields: { ...fieldName: value } }, the field name that must
 * match the one on Airtable
 * @returns the new record object from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const createNewRecords = async (tableName, data) => {
  try {
    const res = await base(tableName).create(data);
    return res;
  } catch (e) {
    console.error("Error while creating table records...");
    return null;
  }
};

/**
 * Update an existing record on Airtable,
 * @param {String} tableName table name string match with Airtable
 * @param {String} recordId the record id of updating one
 * @param {Object} data data object that is updated to Airtable
 * * { ...fieldName: value }, the field name that must
 * match the one on Airtable, the data object will merge with the
 * old one - so the data object is only need the updating fields
 * @returns the new record object from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const updateRecord = async (tableName, recordId, data) => {
  try {
    const res = await base(tableName).update([
      {
        id: recordId,
        fields: data,
      },
    ]);
    return res;
  } catch (e) {
    console.error("Error while updating table record...");
    return null;
  }
};

/**
 * Update a list of filtered records by a formula
 * @param {String} tableName table name string match with Airtable
 * @param {String} whereString the filter formula for searching record
 * * read more
 * {@link https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference| Airtable Filter Formula}
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
  try {
    const filteredRecords = await base(tableName)
      .select({
        view: "Grid view",
        filterByFormula: whereString,
      })
      .all();
    const res = filteredRecords.map(async (record) => {
      let oldFields = record._rawJson.fields;
      let newFields = await record.patchUpdate(data);
      return {
        ...newFields._rawJson,
        oldFields,
        patchedFields: data,
        modifiedTime: Date.now(),
      };
    });
    return res;
  } catch (e) {
    console.error("Error while updating table records...");
    return null;
  }
};

/**
 * Delete a record with RecordId (rowId)
 * @param {String} tableName table name string match with Airtable
 * @param {String} recordId the record id of updating one
 * @returns the record that has been deleted from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const deleteRecord = async (tableName, recordId) => {
  try {
    const res = await base(tableName).destroy(recordId);
    return res;
  } catch (e) {
    console.error("Error while deleting table record...");
    return null;
  }
};

/**
 * Delete a record with RecordId (rowId)
 * @param {String} tableName table name string match with Airtable
 * @param {String} whereString the filter formula for searching record
 * * read more
 * {@link https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference| Airtable Filter Formula}
 * @returns the record that has been deleted from Airtable
 * * createdTime: string| DateString,
 * * fields: { ...fieldName: value } object| record data
 * * id: string| the record id
 */
const deleteRecordWhere = async (tableName, whereString) => {
  try {
    const filteredRecords = await base(tableName)
      .select({
        view: "Grid view",
        filterByFormula: whereString,
      })
      .all();
    const res = await Promise.allSettled(
      filteredRecords.map(async (record) => {
        let deletedRecord = await record.destroy();
        return {
          ...deletedRecord._rawJson,
          deletedTime: Date.now(),
        };
      })
    );
    return res;
  } catch (e) {
    console.error("Error while deleting table records...");
    return null;
  }
};

export {
  retrieveMetadata,
  retrieveAllData,
  mapResultToTableData,
  createNewRecord,
  createNewRecords,
  updateRecord,
  updateRecordWhere,
  deleteRecord,
  deleteRecordWhere,
};
