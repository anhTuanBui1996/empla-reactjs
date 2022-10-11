// define the data object that used for display and upload
// to airtable the key name is the looked up value (read-only)
// the 'linkedField' property is the actual field that
// the new record will be add by this linkedField
// the field name should define same with field name in Airtable

// field type list (base on Airtable data type)
//   formula -- the calculated field (read-only) with defined formula
//   checkbox -- the true/false display as a checkbox
//   singleLineText -- the simple line of text
//   longText -- the long text (multi-line)
//   attachment -- the attachment file type
//      (current receiving .png, .jpg and pdf)
//   singleSelect -- the single select of text
//      (actual value is text)
//   multipleSelect -- the multi select of text
//      (actual value is array of text),
//   date -- the date data without time (receiving Date data type)
//   dateTime -- the data data with time (receiving Date data type)
//   lookup -- the look up data get from linkToAnotherTable field (read-only)
//   linkToAnotherTable -- the link to another table
//      (use at least 1 look up field to display)
//      {
//        ...
//        linkedField: -- the link field to another table on the current one
//        linkedTable: -- the link table that the current one link to
//        displayedField: -- the look up used for display in select list
//        isMultiple: -- true if linking to multiple record, otherwise false
//      }

class InitialStaffForm {
  // form for Staff, Status and Account table
  constructor() {
    this.Staff = {
      FullName: {
        value: "",
        label: "",
        "data-type": "singleLineText",
      },
      Portrait: {
        value: [], // we use Filestack for image picker
        label: "", // url string
        "data-type": "attachment",
      },
      CurriculumVitae: {
        value: [], // we use Filestack for image picker
        label: "", // url string
        "data-type": "attachment",
      },
      Gender: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      DateOfBirth: {
        value: "",
        label: "",
        "data-type": "date",
      },
      Phone: {
        value: "",
        label: "",
        "data-type": "singleLineText",
      },
      PersonalEmail: {
        value: "",
        label: "",
        "data-type": "singleLineText",
      },
      RoleType: {
        linkedField: "Role",
        linkedTable: "Role",
        displayedField: "Name",
        isMultiple: false,
        value: "",
        label: "",
        "data-type": "linkToAnotherTable",
      },
      Company: {
        linkedField: "Collaboratory",
        linkedTable: "Collaboratory",
        displayedField: "Name",
        isMultiple: false,
        value: "",
        label: "",
        "data-type": "linkToAnotherTable",
      },
      CurrentWorkingPlace: {
        linkedField: "WorkingPlace",
        linkedTable: "WorkingPlace",
        displayedField: "Name",
        isMultiple: false,
        value: "",
        label: "",
        "data-type": "linkToAnotherTable",
      },
      ContractType: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      WorkingType: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      WorkingPeriod: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      WorkingStatus: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      StartWorkingDay: {
        value: "",
        label: "",
        "data-type": "date",
      },
      MarriageStatus: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      HealthStatus: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      Notes: { value: "", label: "", "data-type": "longText" },
      Username: {
        value: "",
        label: "",
        "data-type": "singleLineText",
      },
      Domain: {
        linkedField: "Collaboratory",
        linkedTable: "Collaboratory",
        displayedField: "Domain",
        value: "",
        label: "",
        "data-type": "lookup",
      },
      Account: {
        // combination of username + domain
        value: "",
        label: "",
        "data-type": "formula",
      },
      Password: {
        value: "",
        label: "",
        "data-type": "singleLineText",
      },
      AccountStatus: {
        value: "",
        label: "",
        "data-type": "singleSelect",
      },
      Avatar: {
        value: [],
        label: "",
        "data-type": "attachment",
      },
    };
  }
}

// for creating staff
export const initialStaffFormForCreate = new InitialStaffForm();
// for editing staff
export const initialStaffFormForEdit = new InitialStaffForm();
