import {
  MdInsertInvitation,
  MdStickyNote2,
  MdSupervisorAccount,
  MdHouse,
  MdSettingsApplications,
  MdConnectWithoutContact,
  MdOutlineDynamicFeed,
  MdSocialDistance,
  MdFolderShared,
  MdHomeWork,
  MdSchema,
  MdHomeRepairService,
} from "react-icons/md";

export const AIRTABLE = {
  BASE_ID: process.env.REACT_APP_AIRTABLE_BASE_ID,
  API_KEY: process.env.REACT_APP_AIRTABLE_API_KEY,
  // because we use free airtable services so we can't get the metadata
  // so we must self create the field data type of tables

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
  FIELD_TYPE: {
    Staff: {
      StaffId: { dataType: "singleLineText" },
      FullName: { dataType: "singleLineText" },
      Phone: { dataType: "singleLineText" },
      PersonalEmail: { dataType: "singleLineText" },
      Username: { dataType: "singleLineText" },
      Account: { dataType: "singleLineText" },
      Password: { dataType: "singleLineText" },
      Notes: { dataType: "longText" },
      Portrait: { dataType: "attachment" },
      Avatar: { dataType: "attachment" },
      CurriculumVitae: { dataType: "attachment" },
      Gender: { dataType: "singleSelect" },
      ContractType: { dataType: "singleSelect" },
      WorkingType: { dataType: "singleSelect" },
      WorkingPeriod: { dataType: "singleSelect" },
      WorkingStatus: { dataType: "singleSelect" },
      MarriageStatus: { dataType: "singleSelect" },
      HealthStatus: { dataType: "singleSelect" },
      AccountStatus: { dataType: "singleSelect" },
      DateOfBirth: { dataType: "date" },
      StartWorkingDay: { dataType: "date" },
      CreatedTime: { dataType: "dateTime" },
      LastModifiedTime: { dataType: "dateTime" },
      BirthdayCelebration: { dataType: "date" },
      RoleType: { dataType: "lookup", sourceType: "singleLineText" },
      Company: { dataType: "lookup", sourceType: "singleLineText" },
      CurrentWorkingPlace: { dataType: "lookup", sourceType: "singleLineText" },
      DatabaseAccessibility: { dataType: "lookup", sourceType: "checkbox" },
      Domain: { dataType: "lookup", sourceType: "singleLineText" },
      Collaboratory: { dataType: "linkToAnotherTable" },
      Role: { dataType: "linkToAnotherTable" },
      Checkin: { dataType: "linkToAnotherTable" },
      WorkingPlace: { dataType: "linkToAnotherTable" },
      "Teams (Member)": { dataType: "linkToAnotherTable" },
      "Teams (Leader)": { dataType: "linkToAnotherTable" },
      Projects: { dataType: "linkToAnotherTable" },
      "Tasks (AssignedTo)": { dataType: "linkToAnotherTable" },
      "Tasks (Supervisor)": { dataType: "linkToAnotherTable" },
    },
    Checkin: {
      CheckinId: { dataType: "singleLineText" },
      StaffId: { dataType: "lookup", sourceType: "singleLineText" },
      FullName: { dataType: "lookup", sourceType: "singleLineText" },
      CreatedDate: { dataType: "dateTime" },
      Type: { dataType: "singleSelect" },
      Notes: { dataType: "longText" },
      CoordinatePosition: { dataType: "singleLineText" },
      Staff: { dataType: "linkToAnotherTable" },
    },
  },
  NOT_SUPPORT_DATA_TYPE: {
    FOR_SORTING: ["attachment", "checkbox", "lookup", "linkToAnotherTable"],
    FOR_SEARCHING: ["attachment", "checkbox", "lookup", "linkToAnotherTable"],
  },
};

export const GOOGLE = {
  MAP_JAVASCRIPT_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
};

export const FILESTACK = {
  API_KEY: process.env.REACT_APP_FILESTACK_API_KEY,
};

export const SIDENAV = [
  { label: "Homepage", path: "/", icon: <MdHouse /> },
  { label: "Staff", path: "/staff", icon: <MdSupervisorAccount /> },
  { label: "Clients", path: "/clients", icon: <MdSocialDistance /> },
  //{ label: "Role", path: "/role", icon: <MdFolderShared /> },
  { label: "Working Place", path: "/workingplace", icon: <MdHomeWork /> },
  { label: "Department", path: "/department", icon: <MdHomeRepairService /> },
  { label: "Collaboratory", path: "/collaboratory", icon: <MdSchema /> },
  { label: "Projects", path: "/projects", icon: <MdOutlineDynamicFeed /> },
  { label: "Teams", path: "/teams", icon: <MdConnectWithoutContact /> },
  { label: "Settings", path: "/settings", icon: <MdSettingsApplications /> },
  { label: "Checkin", path: "/checkin", icon: <MdStickyNote2 /> },
  { label: "Report", path: "/report", icon: <MdInsertInvitation /> },
];

/**
 * List of private path (visible only for admin DatabaseAccessbility=[true])
 */
export const privateRoutes = ["/role", "/collaboratory", "/workingplace"];

// defined company specific requires and configuration
export const companySpecific = {
  dailyWorkingTime: {
    start: 8,
    end: 17,
    unit: "hour",
  },
  workingWeekDay: {
    /**
     * Monday
     */
    WEEKSTART: 1,
    /**
     * Friday
     */
    WEEKEND: 5,
  },
};

export const VALIDATE_RULE = {
  fullName: {
    pattern:
      /^[A-ZÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]+[a-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹý]*([\s][A-ZÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]+[a-zàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹý]*)+$/g,
    minLength: 4,
    maxLength: 30,
  },
  email: {
    pattern: /^[0-9A-z.`~!#$%^&*]+@[a-z]+.[a-z]{3}$/g,
    minLength: 11,
    maxLength: 30,
  },
  phone: {
    // for Vietnamese internal uses only
    pattern: /^(0[0-9]{9})|(\(0[0-9]{2}\)\s[0-9]{3}-[0-9]{4})$/g,
  },
  password: {
    pattern: /[A-z0-9`~!@#$%^&*.?]/g,
    maxLength: 30,
    minLength: 12,
  },
};
