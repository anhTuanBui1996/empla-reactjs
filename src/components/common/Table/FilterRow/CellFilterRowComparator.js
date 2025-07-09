import Select from "react-select";
import { setBadgeTheme } from "../../../../utils/setBadgeTheme";

export default function CellFilterRowComparator({
  classNamePrefix,
  filterCell,
  onChange,
  isFilterRowTurnOn,
  columnIndex,
  rowIndex,
}) {
  const expressionComparatorOptions = [
    {
      name: "=",
      label: "equals",
      color: "blueLight2",
    },
    {
      name: "!=",
      label: "not equals",
      color: "yellowLight2",
    },
    {
      name: "<",
      label: "less than",
      color: "cyanLight2",
    },
    {
      name: "<=",
      label: "less than and equals",
      color: "greenLight2",
    },
    {
      name: ">",
      label: "more than",
      color: "tealLight2",
    },
    {
      name: ">=",
      label: "more than and equals",
      color: "grayLight2",
    },
    {
      name: "c",
      label: "contains",
      color: "blueBright",
    },
  ];
  const currentValue = expressionComparatorOptions.find(
    (o) => o.name === filterCell.expressionComparator
  );
  return (
    <Select
      options={expressionComparatorOptions}
      classNamePrefix={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
      placeholder="..."
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
        menu: (styles) => {
          styles.width = "max-content";
          return {
            ...styles,
            zIndex: "2",
          };
        },
      }}
      defaultValue={expressionComparatorOptions[0]}
      value={currentValue}
      onChange={(newValue) => onChange(newValue.name, columnIndex, rowIndex)}
    />
  );
}
