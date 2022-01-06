export const VietnameseSignChars = [
  { regex: /[áàạảãâấầậẩẫăắằặẳẵ]/g, replaceBy: "a" },
  { regex: /[ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ]/g, replaceBy: "A" },
  { regex: /[éèẹẻẽêếềệểễ]/g, replaceBy: "e" },
  { regex: /[ÉÈẸẺẼÊẾỀỆỂỄ]/g, replaceBy: "E" },
  { regex: /[óòọỏõôốồộổỗơớờợởỡ]/g, replaceBy: "o" },
  { regex: /[ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ]/g, replaceBy: "O" },
  { regex: /[úùụủũưứừựửữ]/g, replaceBy: "u" },
  { regex: /[ÚÙỤỦŨƯỨỪỰỬỮ]/g, replaceBy: "U" },
  { regex: /[íìịỉĩ]/g, replaceBy: "i" },
  { regex: /[ÍÌỊỈĨ]/g, replaceBy: "I" },
  { regex: /[đ]/g, replaceBy: "d" },
  { regex: /[Đ]/g, replaceBy: "D" },
  { regex: /[ýỳỵỷỹ]/g, replaceBy: "y" },
  { regex: /[ÝỲỴỶỸ]/g, replaceBy: "Y" },
];

/**
 * Used to remove the vietnamese sign (ex. viết mã -> viet ma)
 * @param {String} str string of that have vietnamese sign to be removed
 * @returns a new string that has been removed the sign, char order is remained
 */
export const removeSign4VietnameseString = (str) => {
  VietnameseSignChars.forEach((compareObject) => {
    str = str.replace(compareObject.regex, compareObject.replaceBy);
  });
  return str;
};

/**
 * Used to convert a Full Name string into Username
 * @param {String} fullName Full Name string
 * @returns a Username that was converted (ex. Nguyen Van Anh => AnhNV)
 */
const convertFullNameToUsername = (fullName) => {
  const newFullName = removeSign4VietnameseString(fullName);
  const nameArr = newFullName.split(" ");
  const lastName = nameArr[nameArr.length - 1];
  let abbreviation = "";
  for (let i = 0; i < nameArr.length - 1; i++) {
    abbreviation += nameArr[i].charAt(0);
  }
  return lastName + abbreviation;
};

export default convertFullNameToUsername;
