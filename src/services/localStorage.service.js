export const setLocalUser = (data) => {
  localStorage.setItem("userCredential", JSON.stringify(data));
};

export const getLocalUser = () => {
  const userInfo = localStorage.getItem("userCredential");
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export const removeLocalUser = () => {
  localStorage.removeItem("userCredential");
};
