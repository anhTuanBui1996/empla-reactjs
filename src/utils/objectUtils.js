import { compareTwoArrayOfString } from "./arrayUtils";

/**
 * Use to compare 2 object, return undefined if one of 2 params isn't object
 * @param {Object} obj1 first object
 * @param {Object} obj2 second object
 * @returns undefined if one of 2 params isn't object and same type
 * true if 2 object are same, false otherwise
 */
export const compareTwoObject = (obj1, obj2) => {
  let result = true;
  try {
    if (typeof obj1 === "object" && typeof obj2 === "object") {
      // check null or undefined
      if (!obj1 || !obj2) {
        result = false;
      } else {
        // 2 object are arrays
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
          if (obj1.length !== obj2.length) {
            result = false;
          } else if (obj1.length > 0) {
            // 2 array of string or number
            if (typeof obj1[0] === "string" || typeof obj1[0] === "number") {
              result = compareTwoArrayOfString(obj1, obj2, true);
            } else {
              // maybe 2 array of object (not array) or function
              result = true;
              for (let x = 0; x < obj1.length; x++) {
                if (!compareTwoObject(obj1[x], obj2[x])) {
                  result = false;
                  break;
                }
              }
            }
          }
        } else if (Array.isArray(obj1) || Array.isArray(obj2)) {
          result = undefined;
          throw new Error("2 parameters must have a same type");
        } else {
          // 2 object are objects (not array)
          if (
            Object.keys(obj1).length === 0 ||
            Object.keys(obj2).length === 0
          ) {
            result = false;
          } else {
            result = true;
            let obj1Keys = Object.keys(obj1);
            for (let x = 0; x < obj1Keys.length; x++) {
              // from obj2
              let objComparator = Object.getOwnPropertyDescriptor(
                obj2,
                obj1Keys[x]
              );
              if (!objComparator) {
                result = false;
                break;
              } else if (
                typeof obj1[obj1Keys[x]] === "string" ||
                typeof obj1[obj1Keys[x]] === "number"
              ) {
                if (objComparator.value !== obj1[obj1Keys[x]]) {
                  result = false;
                  break;
                }
              } else {
                // oh dear, object type again!
                if (!compareTwoObject(objComparator.value, obj1[obj1Keys[x]])) {
                  result = false;
                }
              }
            }
          }
        }
      }
    } else {
      result = undefined;
      throw new Error("2 parameters must is object");
    }
  } catch (e) {
    console.log(e, e.stack);
  }
  return result;
};
