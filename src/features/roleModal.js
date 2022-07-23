// all the input form below must have this 2 properties
// (name, data-table)

// define the select list use for dropdown form control
// empty select lists have to retrieve data from Airtable
export const optionList = {
  Role: {
    Gender: {
      fromTable: "Role",
      list: [
        { "data-table": "Role", label: "Nam", value: "Nam", name: "Gender" },
        { "data-table": "Role", label: "Nữ", value: "Nữ", name: "Gender" },
      ],
    },
  },
};
// define the data object that used for display and upload to
// airtable the key name is the looked up value (read-only)
// the 'linkedField' property is the actual field that
// the new record will be add by this linkedField,
// the field key and the linkedField is looked up field if
// they are the same
class InitialRoleForm {
  constructor() {}
}
// for creating role
export const initialRoleFormForCreate = new InitialRoleForm();
// for editing role
export const initialRoleFormForEdit = new InitialRoleForm();

export const initialErrorFormForRole = {
  errStatus: false,
  isShowMsg: false,
  errMsg: {
    Role: {
      FullName: "",
      Gender: "",
      DOB: "",
      Phone: "",
      Company: "",
    },
  },
};
