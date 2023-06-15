// define the data object that used for display and upload to airtable

export default class InitialRoleForm {
  constructor() {
    this.Role = {
      RoleName: {
        linkedField: "RoleName",
        value: "",
        label: "",
        type: "singleLineText",
      },
      DatabaseAccessibility: {
        linkedField: "DatabaseAccessibility",
        value: "",
        label: "",
        type: "checkbox",
      },
      
    };
  }
}
