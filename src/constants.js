import {
  MdInsertInvitation,
  MdStickyNote2,
  MdSupervisorAccount,
  MdHouse,
  MdOutlineDeveloperBoard,
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
  { label: "Database", path: "/database", icon: <MdOutlineDeveloperBoard /> },
  { label: "Clients", path: "/clients", icon: <MdSocialDistance /> },
  { label: "Role", path: "/role", icon: <MdFolderShared /> },
  { label: "Working Place", path: "/workingplace", icon: <MdHomeWork /> },
  { label: "Department", path: "/department", icon: <MdHomeRepairService /> },
  { label: "Collaboratory", path: "/collaboratory", icon: <MdSchema /> },
  { label: "Projects", path: "/projects", icon: <MdOutlineDynamicFeed /> },
  { label: "Teams", path: "/teams", icon: <MdConnectWithoutContact /> },
  { label: "Settings", path: "/settings", icon: <MdSettingsApplications /> },
  { label: "Check-in", path: "/checkin", icon: <MdStickyNote2 /> },
  { label: "Report", path: "/report", icon: <MdInsertInvitation /> },
];

/**
 * List of private path (visible only for admin DatabaseAccessbility=[true])
 * and condition path (base on DatabaseEditable and TableEditable)
 */
export const privateRoutes = [
  "/admin",
  "/database",
  "/role",
  "/collaboratory",
  "/workingplace",
];

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
  "Created",
  "CreatedTime",
  "CreatedDate",
  "LastModifiedTime",
];
