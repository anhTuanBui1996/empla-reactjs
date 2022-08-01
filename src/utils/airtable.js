import { AIRTABLE } from "./../constants";

const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE.API_KEY,
});
const base = Airtable.base(AIRTABLE.BASE_ID);

export default base;
