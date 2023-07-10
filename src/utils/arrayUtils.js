import { compareTwoObject } from "./objectUtils";

/**
 * Use to compare 2 array of string, return undefined if one of 2 params isn't array
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

/**
 * Use to compare 2 array of object, return undefined if one of 2 params isn't array
 * @param {Array} arr1 first array
 * @param {Array} arr2 second array
 * @param {Boolean} isIndexCompared true if want to compare index too
 * (meaning 2 array is exactly same), false otherwise
 * @returns undefined if one of 2 params isn't array
 * true if 2 arrays are same, false otherwise
 */
export const compareTwoArrayOfObject = (arr1, arr2, isIndexCompared) => {
  try {
    if (Array.isArray(arr1) && Array.isArray(arr2)) {
      if (arr1.length !== arr2.length) {
        return false;
      } else {
        let result = true;
        for (let i = 0; i < arr1.length; i++) {
          let isFoundInArr2 = false;
          let element1 = arr1[i];
          if (isIndexCompared) {
            let element2 = arr2[i];
            if (compareTwoObject(element1, element2)) {
              isFoundInArr2 = true;
            } else {
              isFoundInArr2 = false;
            }
          } else {
            for (let j = 0; j < arr2.length; j++) {
              let element2 = arr2[j];
              if (compareTwoObject(element1, element2)) {
                isFoundInArr2 = true;
                break;
              }
            }
          }
          result = isFoundInArr2;
        }
        return result;
      }
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  } finally {
    return undefined;
  }
};
