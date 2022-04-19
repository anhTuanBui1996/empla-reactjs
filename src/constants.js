import {
  MdAdminPanelSettings,
  MdInsertInvitation,
  MdStickyNote2,
  MdSupervisorAccount,
  MdHouse,
  MdOutlineDeveloperBoard,
  MdSettingsApplications,
  MdConnectWithoutContact,
  MdOutlineDynamicFeed,
} from "react-icons/md";

export const AIRTABLE = {
  BASE_ID: process.env.REACT_APP_AIRTABLE_BASE_ID,
  API_KEY: process.env.REACT_APP_AIRTABLE_API_KEY,
};

export const GOOGLE = {
  MAP_JAVASCRIPT_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
};

export const FILESTACK = {
  API_KEY: process.env.REACT_APP_FILESTACK_API_KEY,
};

export const SIDENAV = [
  { label: "Homepage", path: "/", icon: <MdHouse /> },
  { label: "Admin", path: "/admin", icon: <MdAdminPanelSettings /> },
  { label: "Staff", path: "/staff", icon: <MdSupervisorAccount /> },
  { label: "Database", path: "/database", icon: <MdOutlineDeveloperBoard /> },
  { label: "Projects", path: "/projects", icon: <MdOutlineDynamicFeed /> },
  { label: "Teams", path: "/teams", icon: <MdConnectWithoutContact /> },
  {
    label: "App Settings",
    path: "/appconfig",
    icon: <MdSettingsApplications />,
  },
  { label: "Check-in", path: "/checkin", icon: <MdStickyNote2 /> },
  { label: "Report", path: "/report", icon: <MdInsertInvitation /> },
];

/**
 * List of private path (visible only for admin DatabaseAccessbility=[true])
 */
export const adminAccessOnly = ["/admin", "/staff", "/database"];

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

// all the input form below must have this 2 properties
// (name, data-table)

// define the select list use for dropdown form control
// empty select lists have to retrive data from Airtable
export const optionList = {
  Staff: {
    Gender: {
      fromTable: "Staff",
      list: [
        { "data-table": "Staff", label: "Nam", value: "Nam", name: "Gender" },
        { "data-table": "Staff", label: "Nữ", value: "Nữ", name: "Gender" },
      ],
    },
    Company: {
      fromTable: "Collaboratory",
      list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
    },
    CurrentWorkingPlace: {
      fromTable: "WorkingPlace",
      list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
    },
    RoleType: {
      fromTable: "Role",
      list: [] /* { "data-table": "", value: "", label: "", name: "" } */,
    },
  },
  Status: {
    WorkingType: {
      fromTable: "Status",
      list: [
        {
          "data-table": "Status",
          label: "Intern",
          value: "Intern",
          name: "WorkingType",
        },
        {
          "data-table": "Status",
          label: "Probation",
          value: "Probation",
          name: "WorkingType",
        },
        {
          "data-table": "Status",
          label: "Official",
          value: "Official",
          name: "WorkingType",
        },
      ],
    },
    WorkingStatus: {
      fromTable: "Status",
      list: [
        {
          "data-table": "Status",
          label: "Working from home",
          value: "Working from home",
          name: "WorkingStatus",
        },
        {
          "data-table": "Status",
          label: "Working in department",
          value: "Working in department",
          name: "WorkingStatus",
        },
        {
          "data-table": "Status",
          label: "On-site with client",
          value: "On-site with client",
          name: "WorkingStatus",
        },
        {
          "data-table": "Status",
          label: "Leaving",
          value: "Leaving",
          name: "WorkingStatus",
        },
      ],
    },
    MarriageStatus: {
      fromTable: "Status",
      list: [
        {
          "data-table": "Status",
          label: "Maried",
          value: "Maried",
          name: "MarriageStatus",
        },
        {
          "data-table": "Status",
          label: "Single",
          value: "Single",
          name: "MarriageStatus",
        },
      ],
    },
    HealthStatus: {
      fromTable: "Status",
      list: [
        {
          "data-table": "Status",
          label: "Normally",
          value: "Normally",
          name: "HealthStatus",
        },
        {
          "data-table": "Status",
          label: "Having diseases",
          value: "Having diseases",
          name: "HealthStatus",
        },
        {
          "data-table": "Status",
          label: "Pregnants",
          value: "Pregnants",
          name: "HealthStatus",
        },
        {
          "data-table": "Status",
          label: "Taking care babies",
          value: "Taking care babies",
          name: "HealthStatus",
        },
        {
          "data-table": "Status",
          label: "Taking care victims",
          value: "Taking care victims",
          name: "HealthStatus",
        },
      ],
    },
    Covid19Vaccinated: {
      fromTable: "Status",
      list: [
        {
          "data-table": "Status",
          label: "Not vaccinated",
          value: "Not vaccinated",
          name: "Covid19Vaccinated",
        },
        {
          "data-table": "Status",
          label: "1 time vaccinated",
          value: "1 time vaccinated",
          name: "Covid19Vaccinated",
        },
        {
          "data-table": "Status",
          label: "2 time vaccinated",
          value: "2 time vaccinated",
          name: "Covid19Vaccinated",
        },
      ],
    },
    Covid19VaccineType: {
      fromTable: "Status",
      list: [
        {
          "data-table": "Status",
          label: "AZD1222 (Astra Zeneca)",
          value: "AZD1222 (Astra Zeneca)",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Sputnik-V (Gamalaya)",
          value: "Sputnik-V (Gamalaya)",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Vero-Cell (Sinopharm)",
          value: "Vero-Cell (Sinopharm)",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Corminaty (Pfizer BioNTect)",
          value: "Corminaty (Pfizer BioNTect)",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Spikevax (Covid-19 vaccine Mordena)",
          value: "Spikevax (Covid-19 vaccine Mordena)",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Covid-19 vaccine Janssen",
          value: "Covid-19 vaccine Janssen",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Vaccine Hayat-Vax",
          value: "Vaccine Hayat-Vax",
          name: "Covid19VaccineType",
        },
        {
          "data-table": "Status",
          label: "Vaccine Abdala (AICA)",
          value: "Vaccine Abdala (AICA)",
          name: "Covid19VaccineType",
        },
      ],
    },
  },
  Account: {
    Domain: {
      fromTable: "Collaboratory",
      list: [],
    },
    AccountStatus: {
      fromTable: "Account",
      list: [
        {
          "data-table": "Account",
          label: "Active",
          value: "Active",
          name: "AccountStatus",
        },
        {
          "data-table": "Account",
          label: "Inactive",
          value: "Inactive",
          name: "AccountStatus",
        },
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
class initialStaffForm {
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
export const initialStaffFormForCreate = new initialStaffForm();
// for editing staff
export const initialStaffFormForEdit = new initialStaffForm();

export const initialErrorFormForStaff = {
  errStatus: false,
  isShowMsg: false,
  errMsg: {
    Staff: {
      FullName: "",
      Gender: "",
      DOB: "",
      Phone: "",
      Company: "",
    },
    Status: {
      WorkingType: "",
      WorkingStatus: "",
      StartWorkingDay: "",
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
    pattern: /^(0[0-9]{9})|(\(0[0-9]{2}\)\s[0-9]{3}-[0-9]{4})$/g,
  },
  password: {
    pattern: /[A-z0-9`~!@#$%^&*.?]/g,
    maxLength: 30,
    minLength: 12,
  },
};

// used for search, sort in Table component
export const NOT_SUPPORT_FIELD_FEATURE = [
  // attachment type
  "Portrait",
  "Avatar",
  // date type
  "DOB",
  "StartWorkingDay",
  "CreatedTime",
  "CreatedDate",
  "LastModifiedTime",
  // boolean type,
  "DatabaseAccessibility",
];

// used for render Date, this is field name that have Date data type
export const FIELD_DATE_TYPE = [
  "CreatedTime",
  "CreatedDate",
  "LastModifiedTime",
];
