import { USER_CREDENTIAL } from "../constants";

export const setLocalUser = (data) => {
  localStorage.setItem(USER_CREDENTIAL, JSON.stringify(data));
};

export const getLocalUser = () => {
  const userInfo = localStorage.getItem(USER_CREDENTIAL);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export const removeLocalUser = () => {
  localStorage.removeItem(USER_CREDENTIAL);
};
