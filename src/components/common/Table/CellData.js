import { setBadgeTheme } from "../../../utils/setBadgeTheme";
import CellDetail from "./CellDetail";

export default /**
 * Create an JSX for table cell to render
 * @param {Object} cell cell object that retrieve after the mapResultToTableData function
 * @param {Object} metadata metadata object of the field in table
 * @param {String} classNamePrefix use for className of per component in cell
 * @param {Number} rowIndex row index of cell in table
 * @param {Number} columnIndex column index of cell in table
 * @param {Number} rowCount row count in total of cell in table
 * @param {Number} columnCount column count in total of cell in table
 * @returns return a displayData only directly or to re-render (injected again to this function),
 * otherwise return a cellJSX ready to render
 */
function CellData({
  cell,
  metadata,
  classNamePrefix,
  rowIndex,
  columnIndex,
  rowCount,
  columnCount,
}) {
  let displayData = null; // the cell data has been injected to an JSX to render
  let { cellData, dataType, sourceType } = cell;
  switch (dataType) {
    case "singleLineText":
    case "email":
    case "longText":
    case "formula":
      displayData = cellData;
      break;
    case "singleSelect":
      let foundColorName = metadata?.options?.choices?.find(
        (c) => c.name === cellData
      );
      if (foundColorName) {
        let styles = {};
        displayData = (
          <span
            className={`${classNamePrefix ? `${classNamePrefix} ` : ""}badge`}
            style={setBadgeTheme(foundColorName.color, styles)}
          >
            {cellData}
          </span>
        );
      } else {
        displayData = cellData;
      }
      break;
    case "multilineText":
      Array.isArray(cellData)
        ? cellData.length > 0 &&
          (displayData = (
            <CellDetail
              classNamePrefix={classNamePrefix}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              rowCount={rowCount}
              columnCount={columnCount}
            >
              {cellData}
            </CellDetail>
          ))
        : cellData !== "" &&
          cellData !== undefined &&
          (displayData = (
            <CellDetail
              classNamePrefix={classNamePrefix}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              rowCount={rowCount}
              columnCount={columnCount}
            >
              {cellData}
            </CellDetail>
          ));
      break;
    case "multipleSelects":
    case "multipleLookupValues":
      displayData = (
        <CellDetail
          classNamePrefix={classNamePrefix}
          isMultiValue
          meta={metadata}
          sourceType={sourceType}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          rowCount={rowCount}
          columnCount={columnCount}
        >
          {cellData}
        </CellDetail>
      );
      break;
    case "multipleAttachments":
      displayData = cellData?.map((item, i) => (
        <img
          key={i}
          className={`${classNamePrefix ? `${classNamePrefix} ` : ""}cell-img`}
          src={item.thumbnails.small.url}
          alt={dataType}
          width={30}
          onClick={(e) => {
            e.stopPropagation();
            window.open(item.url);
          }}
        />
      ));
      break;
    case "date":
      displayData = cellData
        ? new Date(cellData).toLocaleDateString("en-GB")
        : null;
      break;
    case "dateTime":
    case "createdTime":
    case "lastModifiedTime":
      displayData = cellData
        ? new Date(cellData).toLocaleString("en-GB", {
            timeZone: "Asia/Bangkok",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : null;
      break;
    case "checkbox":
      displayData = (
        <div
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }cell-checkbox`}
        >
          <input
            name="editor-checkbox"
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }table-checkbox`}
            type="checkbox"
            checked={cellData ? true : false}
            style={{ display: "none" }}
            readOnly
          />
          <label
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }table-checkbox-label mb-0`}
            htmlFor="editor-checkbox"
          >
            <span className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}>
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
      break;
    case "multipleRecordLinks":
      // list of linked record, rarely used...
      break;
    default:
      console.error("Error while inject data to table", cellData, dataType);
      break;
  }
  return (
    <div
      className={`${
        classNamePrefix ? `${classNamePrefix} ` : ""
      }cell-data d-flex justify-content-start align-items-center`}
      style={{
        maxWidth: "300px",
        height: "40px",
        overflowWrap: "break-word",
      }}
    >
      {displayData}
    </div>
  );
}
