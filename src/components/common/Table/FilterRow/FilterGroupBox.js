import { MdArrowDropDown } from "react-icons/md";
import Outclick from "../../../../hoc/Outclick";
import { Fragment, useMemo, useState } from "react";
import Card from "../../Card";
import CustomSwitch from "../../CustomSwitch";
import Row from "../../../layout/Row";
import Col from "../../../layout/Col";
import Select from "react-select";
import { setBadgeTheme } from "../../../../utils/setBadgeTheme";
import CellFilterRowControl from "./CellFilterRowControl";

export default function FilterGroupBox({
  tableMetadata,
  isFilterRowTurnOn,
  classNamePrefix,
  containerClassName,
  fieldList,
  filterGroup,
  filterArr,
  onChangeFilterRowFieldName,
  onChangeFilterRowExpressionComparator,
  onChangeFilterRowCellValue,
  onChangeFilterGroupLogicalExpression,
  onChangeFilterGroupIndex,
  onFilterRowExecute,
}) {
  const listFilterCell = useMemo(() => {
    const listedFilterCellArr = [];
    filterArr.forEach((fieldFilterColumn, i) =>
      fieldFilterColumn.forEach((filterCell, j) => {
        listedFilterCellArr.push({
          ...filterCell,
          columnIndex: i,
          rowIndex: j,
        });
      })
    );
    return listedFilterCellArr;
  }, [filterArr]);
  const [isOpened, setOpened] = useState(false);
  return (
    <div
      className={`${classNamePrefix ? `${classNamePrefix} ` : ""} dropdown`}
      style={{ flexGrow: 1, textAlign: "center" }}
    >
      <button
        className={`${classNamePrefix ? `${classNamePrefix} ` : ""}${
          containerClassName ? `${containerClassName} ` : ""
        }btn btn-secondary bg-light rounded px-0 py-0 w-100`}
        style={{ height: "28px" }}
        onClick={(e) => {
          e.stopPropagation();
          setOpened(!isOpened);
        }}
      >
        <span
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          } text-dark`}
        >
          Query preview
        </span>
        <MdArrowDropDown
          color="#4d3f3f"
          size={20}
          className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
        />
      </button>
      <Outclick onOutClick={() => setOpened(false)}>
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }shadow dropdown-menu px-3 dropdown-menu-left${
            isOpened ? " d-block" : ""
          }`}
          style={{ width: "100%" }}
        >
          {filterGroup.map((group, i) => (
            <Card
              key={i}
              elementList={[
                <div
                  style={{
                    height: "400px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  {listFilterCell.map((cell, j) => {
                    if (
                      cell.canBeFiltered === false ||
                      cell.filterValue === ""
                    ) {
                      return <Fragment key={`${cell.fieldName}${j}`} />;
                    }
                    const colorList = [
                      "blueLight2",
                      "cyanLight2",
                      "tealLight2",
                      "greenLight2",
                      "yellowLight2",
                      "orangeLight2",
                      "redLight2",
                      "pinkLight2",
                      "purpleLight2",
                      "grayLight2",
                      "blueBright",
                      "pinkLight1",
                    ];
                    const fieldNameOptions = fieldList.map((fieldName) => ({
                      name: fieldName,
                      label: fieldName,
                      color:
                        colorList[Math.floor(Math.random() * colorList.length)],
                    }));
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
                    return (
                      <Row
                        className={classNamePrefix}
                        key={`${cell.fieldName}${j}`}
                      >
                        <Col
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }d-flex flex-row`}
                          columnSize={["12"]}
                          style={{ gap: "10px" }}
                        >
                          <Select
                            options={fieldNameOptions}
                            classNamePrefix={`${
                              classNamePrefix ? `${classNamePrefix}` : ""
                            }`}
                            placeholder="..."
                            styles={{
                              control: (styles) => {
                                styles.height = "40.5px";
                                styles.minWidth = "max-content";
                                return { ...styles };
                              },
                              option: (
                                styles,
                                { data, isFocused, isSelected }
                              ) => {
                                styles.color = "hsl(0, 0%, 20%)";
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
                            value={fieldNameOptions.find(
                              (f) => f.name === cell.fieldName
                            )}
                            onChange={(newValue) =>
                              onChangeFilterRowFieldName(
                                newValue.name,
                                cell.columnIndex,
                                cell.rowIndex
                              )
                            }
                          />
                          {cell.dataType !== "checkbox" && (
                            <Select
                              options={expressionComparatorOptions}
                              classNamePrefix={`${
                                classNamePrefix ? `${classNamePrefix}` : ""
                              }`}
                              placeholder="..."
                              styles={{
                                control: (styles) => {
                                  styles.height = "40.5px";
                                  styles.minWidth = "max-content";
                                  return { ...styles };
                                },
                                option: (
                                  styles,
                                  { data, isFocused, isSelected }
                                ) => {
                                  styles.color = "hsl(0, 0%, 20%)";
                                  switch (data.color) {
                                    case "blueLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#d1e2ff";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#d1e2ff";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "cyanLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#c4ecff";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#c4ecff";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "tealLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#c1f5f0";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#c1f5f0";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "greenLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#cff5d1";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#cff5d1";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "yellowLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#ffeab6";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#ffeab6";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "orangeLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#ffe0cc";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#ffe0cc";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "redLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#ffd4e0";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#ffd4e0";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "pinkLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#fad2fc";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#fad2fc";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "purpleLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#e0dafd";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#e0dafd";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "grayLight2":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#e5e9f0";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#e5e9f0";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "blueBright":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.color = "white";
                                          styles.backgroundColor = "#166ee1";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.color = "white";
                                          styles.backgroundColor = "#166ee1";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      }
                                      break;
                                    case "pinkLight1":
                                      if (isSelected) {
                                        if (isFocused) {
                                          styles.backgroundColor = "#f797ef";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
                                        }
                                      } else {
                                        if (isFocused) {
                                          styles.backgroundColor = "#f797ef";
                                        } else {
                                          styles.backgroundColor =
                                            "transparent";
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
                                    styles = setBadgeTheme(
                                      singleVal.color,
                                      styles
                                    );
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
                              value={expressionComparatorOptions.find(
                                (e) => e.name === cell.expressionComparator
                              )}
                              onChange={(newValue) =>
                                onChangeFilterRowExpressionComparator(
                                  newValue.name,
                                  cell.columnIndex,
                                  cell.rowIndex
                                )
                              }
                            />
                          )}
                          <CellFilterRowControl
                            tableMetadata={tableMetadata}
                            isFilterRowTurnOn={isFilterRowTurnOn}
                            classNamePrefix={classNamePrefix}
                            fieldFilterCell={cell}
                            handleCellValueChange={onChangeFilterRowCellValue}
                            columnIndex={cell.columnIndex}
                            rowIndex={cell.rowIndex}
                            key={i}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </div>,
              ]}
              className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
              cardHeader={{
                title: (
                  <div
                    className={`${
                      classNamePrefix ? `${classNamePrefix} ` : ""
                    }d-flex flex-row`}
                    style={{ gap: "10px" }}
                  >
                    {`Group ${i + 1} `}
                    <CustomSwitch
                      className={classNamePrefix}
                      inputValue={
                        group.logicalExpression === "AND" ? true : false
                      }
                      onSwitchChange={() => {
                        group.logicalExpression === "AND"
                          ? onChangeFilterGroupLogicalExpression("OR", i)
                          : onChangeFilterGroupLogicalExpression("AND", i);
                      }}
                    />
                  </div>
                ),
                badge: {
                  theme:
                    group.logicalExpression === "AND" ? "primary" : "secondary",
                  label: group.logicalExpression,
                },
                navList: filterGroup.map((group, j) => `Group ${j + 1}`),
              }}
            />
          ))}
        </div>
      </Outclick>
    </div>
  );
}
