// define the data object that used for display and upload to airtable
// if the field key and 'linkedField' are different, that is linkToAnotherRecord type
// the field key is field display to user ('Lookup' field type in airtable and read-only)
// so to change Lookup value, we must change 'Link to another record' field on airtable

// fieldType list (base on airtable data type)
//   singleLineText, (value: "", label: "")
//   longText, (value: "", label: "")
//   attachment, (value: [], label: "")
//   singleSelect, (value: "", label: "")
//   multipleSelect, (value: [], label: [])
//   checkbox, (value: "", label: "")
//   date, (value: "", label: "")
//   linkToAnotherRecord (value: "", label: "")

class InitialRoleForm {
  constructor() {
    this.Role = {
      RoleName: {
        linkedField: "RoleName",
        value: "",
        label: "",
        fieldType: "singleLineText",
      },
      DatabaseAccessibility: {
        linkedField: "DatabaseAccessibility",
        value: "",
        label: "",
        fieldType: "checkbox",
      },
      
    };
  }
}
// for creating role
export const initialRoleFormForCreate = new InitialRoleForm();
// for editing role
export const initialRoleFormForEdit = new InitialRoleForm();
