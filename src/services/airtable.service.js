import tableConfig from "./../utils/airtable";

const retrieveData = async (tableName, formula, config) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = newConfig.read(formula, config);
    return res;
  } catch (e) {
    console.log(e);
  }
};

const createNewRecord = async (tableName, data) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = newConfig.create(data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

const updateRecord = async (tableName, rowId, data) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = newConfig.update(rowId, data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

const updateRecordWhere = async (tableName, whereString, data) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = newConfig.updateWhere(whereString, data);
    return res;
  } catch (e) {
    console.log(e);
  }
};

const deleteRecord = async (tableName, rowId) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = newConfig.delete(rowId);
    return res;
  } catch (e) {
    console.log(e);
  }
};

const deleteRecordWhere = async (tableName, whereString) => {
  const newConfig = tableConfig(tableName);
  try {
    const res = newConfig.deleteWhere(whereString);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export {
  retrieveData,
  createNewRecord,
  updateRecord,
  updateRecordWhere,
  deleteRecord,
  deleteRecordWhere,
};
