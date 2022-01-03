import {
  MdAdminPanelSettings,
  MdDataSaverOff,
  MdStickyNote2,
  MdSupervisorAccount,
  MdHouse,
} from "react-icons/md";

export const AIRTABLE = {
  BASE_ID: process.env.REACT_APP_AIRTABLE_BASE_ID,
  API_KEY: process.env.REACT_APP_AIRTABLE_API_KEY,
};

export const FILESTACK = {
  API_KEY: process.env.REACT_APP_FILESTACK_API_KEY,
};

export const SIDENAV = [
  { label: "Homepage", path: "/", icon: <MdHouse /> },
  { label: "Admin", path: "/admin", icon: <MdAdminPanelSettings /> },
  { label: "Staff", path: "/staff", icon: <MdSupervisorAccount /> },
  { label: "Check-in", path: "/checkin", icon: <MdStickyNote2 /> },
  { label: "Report", path: "/report", icon: <MdDataSaverOff /> },
];

export const USER_CREDENTIAL = "userCredential";

export let initialStaffForm = {
  Staff: {
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
  },
  Status: {
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
      linkedField: "WorkingStatus",
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
  },
  Account: {
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
    },
    Password: {
      linkedField: "Password",
      value: "",
      label: "",
    },
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
    pattern: /^0[0-9]{9}$/g,
  },
  password: {
    pattern: /[A-z0-9`~!@#$%^&*.?]/g,
    maxLength: 30,
    minLength: 12,
  },
};

// used for search, sort in Table component
export const NOT_SUPPORT_FIELD_FEATURE = [
  "Portrait",
  "Avatar",
  "DOB",
  "StartWorkingDay",
  "CreatedTime",
  "CreatedDate",
  "LastModifiedTime",
];
