import { setBadgeTheme } from "../../../utils/setBadgeTheme";
import Dropdown from "../Dropdown";
import CellData from "./CellData";

export default function CellDetail({
  children,
  isMultiValue,
  meta,
  classNamePrefix,
  sourceType,
  rowIndex,
  columnIndex,
  rowCount,
  columnCount,
}) {
  // only set badge for multiSelects type
  let colorChoices = undefined;
  let styles = undefined;
  if (meta) {
    if (meta.type === "multipleSelects") {
      colorChoices = meta.options.choices;
    }
  }
  if (colorChoices && Array.isArray(children)) {
    let selectedColor = colorChoices.find((c) => c.name === children[0])?.color;
    if (selectedColor) {
      styles = {};
      styles = setBadgeTheme(
        colorChoices.find((c) => c.name === children[0])?.color,
        styles
      );
    }
  }
  let dropDirectionFinal = "down";
  let dropMenuPosition = "right";
  if (rowIndex + 1 <= rowCount / 2) {
    if (columnIndex + 1 <= columnCount / 2) {
      dropMenuPosition = "left";
    }
  } else {
    dropDirectionFinal = "up";
    if (columnIndex + 1 <= columnCount / 2) {
      dropMenuPosition = "left";
    }
  }
  return Array.isArray(children) && children.length ? (
    <div
      className={`${
        classNamePrefix ? `${classNamePrefix} ` : ""
      }d-flex justify-content-start align-items-center`}
    >
      <span
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }cell-preview mr-2${isMultiValue && styles ? " badge" : ""}`}
        style={styles}
      >
        {children[0]}
      </span>
      <Dropdown
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }cell-multi-options`}
        title="..."
        variant="light"
        position={dropMenuPosition}
        dropDirection={dropDirectionFinal}
      >
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }cell-detail d-flex flex-column`}
          style={{ width: "400px", gap: "5px" }}
        >
          {Array.isArray(children)
            ? children.map((item, i) => {
                // multiSelect
                let isBadged = false;
                if (colorChoices && Array.isArray(children)) {
                  let selectedColor = colorChoices.find(
                    (c) => c.name === item
                  )?.color;
                  if (selectedColor) {
                    styles = {};
                    isBadged = true;
                    styles = setBadgeTheme(selectedColor, styles);
                  }
                }
                return (
                  <div
                    key={i}
                    className={`${
                      classNamePrefix ? `${classNamePrefix} ` : ""
                    }cell-detail-item py-1 px-3`}
                    style={{ whiteSpace: "normal", width: "100%" }}
                  >
                    <span
                      className={`${
                        classNamePrefix ? `${classNamePrefix} ` : ""
                      }${isBadged ? "badge" : ""}`}
                      style={styles}
                    >
                      {sourceType && sourceType !== "multipleSelects" ? (
                        <CellData
                          cell={{ cellData: item, dataType: sourceType }}
                          metadata={meta}
                          classNamePrefix={
                            "multiple-lookup-value-detail" + classNamePrefix
                          }
                        />
                      ) : (
                        item
                      )}
                    </span>
                  </div>
                );
              })
            : children !== null &&
              children !== undefined && (
                // longText or multilineText
                <div
                  className={`${
                    classNamePrefix ? `${classNamePrefix} ` : ""
                  }cell-detail-item py-1 px-3`}
                  style={{ whiteSpace: "normal", width: "100%" }}
                >
                  {children}
                </div>
              )}
        </div>
      </Dropdown>
    </div>
  ) : typeof children === "string" ? (
    <div
      className={`${
        classNamePrefix ? `${classNamePrefix} ` : ""
      }d-flex justify-content-start align-items-center`}
    >
      <span
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }cell-preview mr-2${isMultiValue && styles ? " badge" : ""}`}
        style={styles}
      >
        {Array.isArray(children)
          ? children[0]
          : children !== null &&
            children !== undefined &&
            children.slice(0, 15).trimEnd()}
      </span>
      <Dropdown
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }cell-multiline-text`}
        title="..."
        variant="light"
        position={dropMenuPosition}
        dropDirection={dropDirectionFinal}
      >
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }cell-detail d-flex flex-column`}
          style={{ width: "400px", gap: "5px" }}
        >
          <div
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }cell-detail-item py-1 px-3`}
            style={{ whiteSpace: "normal", width: "100%" }}
          >
            {children}
          </div>
        </div>
      </Dropdown>
    </div>
  ) : null;
}
