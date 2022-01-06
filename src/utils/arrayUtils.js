/**
 * Use to compare 2 array, return undefined if one of 2 params isn't array
 * @param {Array} arr1 first array
 * @param {Array} arr2 second array
 * @param {Boolean} isIndexCompared true if want to compare index too
 * (meaning 2 array is exactly same), false otherwise
 * @returns undefined if one of 2 params isn't array
 * true if 2 arrays are same, false otherwise
 */
export const compareTwoArrayOfString = (arr1, arr2, isIndexCompared) => {
  let result = true;
  try {
    if (Array.isArray(arr1) && Array.isArray(arr2)) {
      if (arr1.length !== arr2.length) {
        result = false;
      } else {
        let checkArr = true;
        for (let i = 0; i < arr1.length; i++) {
          const element = arr1[i];
          const foundIndex = arr2.indexOf(element);
          if (foundIndex === -1) {
            checkArr = false;
            break;
          } else {
            if (isIndexCompared && i !== foundIndex) {
              checkArr = false;
              break;
            }
          }
        }
        result = checkArr;
      }
    } else {
      result = undefined;
      throw new Error("2 parameters must is array");
    }
  } catch (e) {
    console.log(e, e.stack);
  }
  return result;
};
