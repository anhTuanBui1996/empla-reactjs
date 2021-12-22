import { AIRTABLE } from "./../constants";

const AirtablePlus = require("airtable-plus");
const tableConfig = (tableName) => {
  const config = new AirtablePlus({
    baseID: AIRTABLE.BASE_ID,
    apiKey: AIRTABLE.API_KEY,
    tableName: tableName,
  });
  return config;
};

export default tableConfig;
