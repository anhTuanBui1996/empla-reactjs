import { compareTwoArrayOfString } from "./arrayUtils";

/**
 * Use to compare 2 object
 * @param {Object} obj1 first object
 * @param {Object} obj2 second object
 * @returns
 * compare only data type of string, number, array and object, return:
 * * true if 2 object are same
 * * false if 2 object aren't same, 1 of 2 object can't be deserialize, 2 object are not the same type
 */
export const compareTwoObject = (obj1, obj2) => {
  let result = true;
  try {
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
            result = compareTwoArrayOfString(obj1, obj2, false);
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
      } else if (typeof obj1 !== typeof obj2) {
        result = false;
        throw new Error(
          `Two parameters must have a same type! ${typeof obj1}, ${typeof obj2}`
        );
      } else {
        // 2 object are objects (not array)
        if (Object.keys(obj1).length === 0 || Object.keys(obj2).length === 0) {
          result = false;
        } else if (Object.keys(obj1).length !== Object.keys(obj2).length) {
          result = false;
        } else {
          let obj1Keys = Object.keys(obj1);
          for (let x = 0; x < obj1Keys.length; x++) {
            // from obj2
            let objComparator = Object.getOwnPropertyDescriptor(
              obj2,
              obj1Keys[x]
            );
            if (!objComparator) {
              // this propperty of obj1 doesn't include in obj2
              result = false;
              break;
            } else if (
              typeof obj1[obj1Keys[x]] === "string" ||
              typeof obj1[obj1Keys[x]] === "number" ||
              typeof obj1[obj1Keys[x]] === "boolean"
            ) {
              if (objComparator.value !== obj1[obj1Keys[x]]) {
                // two propperty with same name but diferent in value
                result = false;
                break;
              }
            } else if (typeof obj1[obj1Keys[x]] === "object") {
              // object type
              if (!compareTwoObject(objComparator.value, obj1[obj1Keys[x]])) {
                result = false;
                break;
              }
            } else {
              result = false;
              throw new Error("Unknown type to compare!");
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(e, e.stack);
  }
  return result;
};
