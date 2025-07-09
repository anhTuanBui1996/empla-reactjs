import { useMemo } from "react";
import Select from "react-select";
import { setBadgeTheme } from "../../../../utils/setBadgeTheme";
import ReactCalendar from "../../../specific/ReactCalendar";

export default function CellFilterRowControl({
  isFilterRow,
  tableMetadata,
  isFilterRowTurnOn,
  fieldFilterCell,
  columnIndex,
  rowIndex,
  handleCellValueChange,
  classNamePrefix,
}) {
  const fieldMetadata = useMemo(
    () =>
      tableMetadata.fields.find((f) => f.name === fieldFilterCell.fieldName),
    [tableMetadata, fieldFilterCell.fieldName]
  );
  switch (fieldFilterCell.dataType) {
    case "singleLineText":
    case "multilineText":
    case "email":
    case "longText":
    case "formula":
      return (
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }form-group mb-0`}
          style={{
            visibility: isFilterRowTurnOn ? "visible" : "hidden",
            opacity: isFilterRowTurnOn ? 1 : 0,
            maxHeight: isFilterRowTurnOn ? "200px" : 0,
            minWidth: "200px",
            overflow: "hidden",
            transition:
              "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out",
          }}
        >
          <input
            id={`${isFilterRow ? "FilterRow" : "FilterBox"}_${
              fieldFilterCell.fieldName
            }`}
            tabIndex={100 + columnIndex}
            autoComplete="off"
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }form-control form-control-prepended`}
            type="text"
            value={fieldFilterCell.filterValue}
            onChange={(e) =>
              handleCellValueChange(e.target.value, columnIndex, rowIndex)
            }
            placeholder={`...`}
          />
        </div>
      );
    case "multipleSelects":
      return (
        <Select
          options={fieldMetadata.options.choices.map((c) => ({
            label: c.name,
            value: c.name,
            color: c.color,
          }))}
          tabIndex={100 + columnIndex}
          classNamePrefix={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
          placeholder="..."
          isClearable
          isMulti
          styles={{
            container: (styles) => {
              styles.visibility = isFilterRowTurnOn ? "visible" : "hidden";
              styles.opacity = isFilterRowTurnOn ? 1 : 0;
              styles.maxHeight = isFilterRowTurnOn ? "200px" : 0;
              styles.overflow = "visible";
              styles.transition =
                "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out";
              return { ...styles };
            },
            control: (styles) => {
              styles.height = "40.5px";
              styles.minWidth = "max-content";
              return { ...styles };
            },
            option: (styles, { data, isFocused, isSelected }) => {
              styles.color = "hsl(0, 0%, 20%)";
              switch (data.color) {
                case "blueLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#d1e2ff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#d1e2ff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "cyanLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#c4ecff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#c4ecff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "tealLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#c1f5f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#c1f5f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "greenLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#cff5d1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#cff5d1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "yellowLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#ffeab6";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#ffeab6";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "orangeLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#ffe0cc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#ffe0cc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "redLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#ffd4e0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#ffd4e0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "pinkLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#fad2fc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#fad2fc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "purpleLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#e0dafd";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#e0dafd";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "grayLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#e5e9f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#e5e9f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "blueBright":
                  if (isSelected) {
                    if (isFocused) {
                      styles.color = "white";
                      styles.backgroundColor = "#166ee1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.color = "white";
                      styles.backgroundColor = "#166ee1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "pinkLight1":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#f797ef";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#f797ef";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                default:
                  console.log("Unknown color!", data.color);
                  break;
              }
              return {
                ...styles,
              };
            },
            multiValue: (styles, { data }) => {
              styles = setBadgeTheme(data.color, styles);
              return { ...styles };
            },
            menu: (styles, { hasValue }) => {
              if (!hasValue) {
                styles.width = "max-content";
              }
              return {
                ...styles,
                zIndex: "2000",
              };
            },
          }}
          value={fieldFilterCell.filterValue}
          onChange={(newValue) => {
            handleCellValueChange(newValue, columnIndex, rowIndex);
          }}
        />
      );
    case "singleSelect":
      return (
        <Select
          options={fieldMetadata.options.choices.map((c) => ({
            name: c.name,
            label: c.name,
            color: c.color,
          }))}
          tabIndex={100 + columnIndex}
          classNamePrefix={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
          placeholder="..."
          isClearable
          styles={{
            container: (styles) => {
              styles.visibility = isFilterRowTurnOn ? "visible" : "hidden";
              styles.opacity = isFilterRowTurnOn ? 1 : 0;
              styles.maxHeight = isFilterRowTurnOn ? "200px" : 0;
              styles.overflow = "visible";
              styles.transition =
                "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out";
              return { ...styles };
            },
            control: (styles) => {
              styles.height = "40.5px";
              styles.minWidth = "max-content";
              return { ...styles };
            },
            option: (styles, { data, isFocused, isSelected }) => {
              styles.color = "hsl(0, 0%, 20%)";
              switch (data.color) {
                case "blueLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#d1e2ff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#d1e2ff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "cyanLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#c4ecff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#c4ecff";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "tealLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#c1f5f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#c1f5f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "greenLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#cff5d1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#cff5d1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "yellowLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#ffeab6";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#ffeab6";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "orangeLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#ffe0cc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#ffe0cc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "redLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#ffd4e0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#ffd4e0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "pinkLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#fad2fc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#fad2fc";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "purpleLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#e0dafd";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#e0dafd";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "grayLight2":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#e5e9f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#e5e9f0";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "blueBright":
                  if (isSelected) {
                    if (isFocused) {
                      styles.color = "white";
                      styles.backgroundColor = "#166ee1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.color = "white";
                      styles.backgroundColor = "#166ee1";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                case "pinkLight1":
                  if (isSelected) {
                    if (isFocused) {
                      styles.backgroundColor = "#f797ef";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  } else {
                    if (isFocused) {
                      styles.backgroundColor = "#f797ef";
                    } else {
                      styles.backgroundColor = "transparent";
                    }
                  }
                  break;
                default:
                  console.log("Unknown color!", data.color);
                  break;
              }
              return {
                ...styles,
              };
            },
            singleValue: (styles, data) => {
              if (data.hasValue) {
                let singleVal = data.getValue()[0];
                styles.paddingLeft = "5px";
                styles.paddingRight = "5px";
                styles.borderRadius = "3px";
                styles.color = "hsl(0, 0%, 20%)";
                styles = setBadgeTheme(singleVal.color, styles);
              } else {
                styles.backgroundColor = "transparent";
              }
              return {
                ...styles,
              };
            },
            menu: (styles, { hasValue }) => {
              if (!hasValue) {
                styles.width = "max-content";
              }
              return {
                ...styles,
                zIndex: "2",
              };
            },
          }}
          value={fieldFilterCell.filterValue}
          onChange={(newValue) =>
            handleCellValueChange(newValue, columnIndex, rowIndex)
          }
        />
      );
    case "multipleLookupValues":
      return <></>;
    case "date":
      return (
        <ReactCalendar
          id={`FilterRow_${fieldFilterCell.fieldName}`}
          tabIndex={100 + columnIndex}
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }date-picker-filter-row`}
          value={fieldFilterCell.filterValue}
          isReadOnly
          onChange={(dateValue) =>
            handleCellValueChange(dateValue, columnIndex, rowIndex)
          }
          styleForFilterRow={{
            visibility: isFilterRowTurnOn ? "visible" : "hidden",
            opacity: isFilterRowTurnOn ? 1 : 0,
            borderTopWidth: isFilterRowTurnOn ? 1 : 0,
            borderBottomWidth: isFilterRowTurnOn ? 1 : 0,
            maxHeight: isFilterRowTurnOn ? "200px" : 0,
            overflow: "visible",
            transition:
              "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out",
          }}
        />
      );
    case "dateTime":
    case "createdTime":
    case "lastModifiedTime":
      return (
        <ReactCalendar
          id={`FilterRow_${fieldFilterCell.fieldName}`}
          tabIndex={100 + columnIndex}
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }date-picker-filter-row`}
          value={fieldFilterCell.filterValue}
          isDisplayTime
          isReadOnly
          onChange={(dateValue) =>
            handleCellValueChange(dateValue, columnIndex, rowIndex)
          }
          styleForFilterRow={{
            visibility: isFilterRowTurnOn ? "visible" : "hidden",
            opacity: isFilterRowTurnOn ? 1 : 0,
            borderTopWidth: isFilterRowTurnOn ? 1 : 0,
            borderBottomWidth: isFilterRowTurnOn ? 1 : 0,
            maxHeight: isFilterRowTurnOn ? "200px" : 0,
            overflow: "visible",
            transition:
              "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out",
          }}
        />
      );
    case "checkbox":
      return (
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }cell-checkbox check-box-filter-row d-flex align-items-center`}
          style={{
            visibility: isFilterRowTurnOn ? "visible" : "hidden",
            opacity: isFilterRowTurnOn ? 1 : 0,
            borderTopWidth: isFilterRowTurnOn ? 1 : 0,
            borderBottomWidth: isFilterRowTurnOn ? 1 : 0,
            maxHeight: isFilterRowTurnOn ? "200px" : 0,
            overflow: "visible",
            transition:
              "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out",
          }}
        >
          <input
            id={`FilterRow_${fieldFilterCell.fieldName}`}
            tabIndex={100 + columnIndex}
            name="editor-checkbox"
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }table-checkbox`}
            type="checkbox"
            style={{ display: "none" }}
            checked={fieldFilterCell.filterValue}
            onChange={() =>
              handleCellValueChange(
                !fieldFilterCell.filterValue,
                columnIndex,
                rowIndex
              )
            }
          />
          <label
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }table-checkbox-label mb-0`}
            htmlFor={`FilterRow_${fieldFilterCell.fieldName}`}
            style={{
              visibility: isFilterRowTurnOn ? "visible" : "hidden",
              opacity: isFilterRowTurnOn ? 1 : 0,
              maxHeight: isFilterRowTurnOn ? "200px" : 0,
              overflow: "visible",
              transition:
                "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out",
            }}
          >
            <span
              className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
              style={{
                visibility: isFilterRowTurnOn ? "visible" : "hidden",
                opacity: isFilterRowTurnOn ? 1 : 0,
                borderTopWidth: isFilterRowTurnOn ? 1 : 0,
                borderBottomWidth: isFilterRowTurnOn ? 1 : 0,
                maxHeight: isFilterRowTurnOn ? "200px" : 0,
                overflow: "visible",
                transition:
                  "visibility .3s ease-out, opacity .3s ease-out, max-height .3s ease-out",
                marginRight: "8px",
              }}
            >
              <svg
                className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                width="12px"
                height="9px"
                viewBox="0 0 13 9"
              >
                <polyline
                  className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                  points="1 5 4 8 11 1"
                ></polyline>
              </svg>
            </span>
          </label>
        </div>
      );
    default:
      return <></>;
  }
}
