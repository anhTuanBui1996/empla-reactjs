import {
  MdStickyNote2,
  MdSupervisorAccount,
  MdHouse,
  MdSocialDistance,
  MdFolderShared,
  MdHomeWork,
  MdSchema,
} from "react-icons/md";

export const AIRTABLE = {
  BASE_ID: process.env.REACT_APP_AIRTABLE_BASE_ID,
  API_KEY: process.env.REACT_APP_AIRTABLE_API_KEY,
};

export const GOOGLE = {
  MAP_JAVASCRIPT_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
};

export const FILEPREVIEWS = {
  API_KEY: process.env.REACT_APP_FILEPREVIEWS_API_KEY,
  API_SECRET: process.env.REACT_APP_FILEPREVIEWS_API_SECRET,
};

export const SIDENAV = [
  { label: "Homepage", path: "/", icon: <MdHouse /> },
  { label: "Staff", path: "/staff", icon: <MdSupervisorAccount /> },
  { label: "Role", path: "/role", icon: <MdFolderShared /> },
  { label: "Tasks", path: "/tasks", icon: <MdSocialDistance /> },
  { label: "Working Place", path: "/workingplace", icon: <MdHomeWork /> },
  { label: "Collaboratory", path: "/collaboratory", icon: <MdSchema /> },
  { label: "Check-in", path: "/checkin", icon: <MdStickyNote2 /> },
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
    pattern: /^[0-9A-z.`~!#$%^&*]+@[a-z]+.[a-z]{2,}$/g,
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
