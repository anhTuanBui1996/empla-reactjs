// define the data object that used for display and upload to
// airtable the key name is the looked up value (read-only)
// the 'linkedField' property is the actual field that
// the new record will be add by this linkedField,
// the field key and the linkedField is looked up field if
// they are the same

// field type list (base on airtable data type)
//   singleLineText,
//   longText,
//   attachment,
//   singleSelect,
//   multipleSelect,
//   date,
//   linkToAnotherRecord,

class InitialStaffForm { // form for Staff, Status and Account table
    constructor() {
      this.Staff = {
        FullName: {
          linkedField: "FullName",
          value: "",
          label: "",
        },
        Portrait: {
          linkedField: "Portrait",
          value: [], // we use Filestack for image picker
          label: "", // url string
        },
        Gender: { linkedField: "Gender", value: "", label: "" },
        DOB: { linkedField: "DOB", value: "", label: "" },
        Phone: { linkedField: "Phone", value: "", label: "" },
        PersonalEmail: {
          linkedField: "PersonalEmail",
          value: "",
          label: "",
        },
        RoleType: { linkedField: "Role", value: "", label: "" },
        Company: { linkedField: "Collaboratory", value: "", label: "" },
        CurrentWorkingPlace: {
          linkedField: "WorkingPlace",
          value: "",
          label: "",
        },
      };
      this.Status = {
        WorkingType: {
          linkedField: "WorkingType",
          value: "",
          label: "",
        },
        WorkingStatus: {
          linkedField: "WorkingStatus",
          value: "",
          label: "",
        },
        StartWorkingDay: {
          linkedField: "StartWorkingDay",
          value: "",
          label: "",
        },
        MarriageStatus: {
          linkedField: "MarriageStatus",
          value: "",
          label: "",
        },
        HealthStatus: {
          linkedField: "HealthStatus",
          value: "",
          label: "",
        },
        Notes: { linkedField: "Notes", value: "", label: "" },
        Covid19Vaccinated: {
          linkedField: "Covid19Vaccinated",
          value: "",
          label: "",
        },
        Covid19VaccineType: {
          // multi select
          linkedField: "Covid19VaccineType",
          value: [],
          label: [],
        },
      };
      this.Account = {
        Username: {
          linkedField: "Username",
          value: "",
          label: "",
        },
        Domain: {
          linkedField: "Collaboratory",
          value: "",
          label: "",
        },
        UserAccount: {
          // combination of username + domain
          linkedField: "UserAccount",
          value: "",
          label: "",
          isRemovedWhenSubmit: true,
        },
        Password: {
          linkedField: "Password",
          value: "",
          label: "",
        },
        AccountStatus: {
          linkedField: "AccountStatus",
          value: "",
          label: "",
        },
        Avatar: {
          linkedField: "Avatar",
          value: [],
          label: "",
        },
      };
    }
  }
  // for creating staff
  export const initialStaffFormForCreate = new InitialStaffForm();
  // for editing staff
  export const initialStaffFormForEdit = new InitialStaffForm();