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

export const VALIDATE_RULE = {
  email: {
    pattern: /[0-9A-z.!#$%^&*]+@[A-z]+[.A-z]+/g,
  },
  password: {
    pattern: "",
    maxLength: 0,
    minLength: 0,
  },
};
