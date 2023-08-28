import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLibraryAdd,
  MdRefresh,
  MdSettings,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import Col from "../layout/Col";
import Row from "../layout/Row";
import Dropdown from "./Dropdown";
import { setSelectedRowData } from "../../features/editorSlice";
import Search from "./Search";
import Select from "react-select";
import { setBadgeTheme } from "../../utils/setBadgeTheme";

function Table({
  tableId,
  metadata,
  fieldList,
  mappedRecords,
  originalRecords,
  hasSettings,
  hasSearching,
  hasSorting,
  onRecordClick,
  onCreateNewBtnClick,
  onRefreshDataBtnClick,
  recordPerPage,
  maxPageDisplay,
  tableStyle,
  isReferenceBox,
  currentReferenceBoxValue,
  onSelectAllRow,
  onUnselectAllRow,
  onUndoInitialSelectedRow,
}) {
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const footerNavRef = useRef(null);
  const innerWidth = useSelector(selectInnerWidth);

  // Mapped record list / Display records in current page
  const [tableMappedRecords, setTableMappedRecords] = useState(mappedRecords);
  const [recordTableInCurrentPage, setRecordTableInCurrentPage] =
    useState(tableMappedRecords);

  // Searching and pagigation state
  const [searchValue, setSearchValue] = useState("");
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [recordsPerPage, setRecordPerPage] = useState(recordPerPage);
  const pageAmount = useMemo(() => {
    return tableMappedRecords.length % recordsPerPage > 0
      ? parseInt(tableMappedRecords.length / recordsPerPage) + 1
      : tableMappedRecords.length / recordsPerPage;
  }, [tableMappedRecords, recordsPerPage]);
  const [pageList, setPageList] = useState([]);
  const [isPageListExceed, setIsPageListExceed] = useState({
    pageStart: false,
    pageEnd: false,
  });

  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Table settings state
  const [showSettings, setShowSettings] = useState(false);

  // Base on responsive width to set footerNav center
  const [isPaginationCenter, setIsPaginationCenter] = useState(false);

  // Handlers
  const handleEditRecord = (e, recordSelectedForEdit) => {
    e.preventDefault();
    if (originalRecords && onRecordClick) {
      const recordId = recordSelectedForEdit.rowId;
      const recordSelected = originalRecords.find(
        (record) => record.id === recordId
      );
      dispatch(setSelectedRowData(recordSelected));
      onRecordClick(recordSelectedForEdit);
    }
  };
  const handleChangeSearchValue = (e) => setSearchValue(e.target.value);
  const handleSearchSubmit = () => {
    if (searchValue) {
      let filteredRecords = tableMappedRecords.filter((record) => {
        let dataArr = record.data;
        for (const dataItem of dataArr) {
          let { cellData } = dataItem;
          if (typeof cellData === "string") {
            if (cellData.includes(searchValue) || searchValue === "") {
              return true;
            }
          }
        }
        return false;
      });
      setTableMappedRecords(filteredRecords);
    } else {
      setTableMappedRecords(mappedRecords);
    }
  };
  const handleClearSearchResult = () => {
    setSearchValue("");
  };
  const handleSortingRecords = (i) => {
    let selectedField = sorting.find((item) => item.index === i);
    if (selectedField) {
      switch (selectedField.fieldSort) {
        case "ascending":
          setSorting(
            sorting.map((sortItem) => {
              if (sortItem.index === i) {
                return {
                  index: i,
                  fieldSort: "descending",
                };
              }
              return sortItem;
            })
          );
          break;
        case "descending":
          setSorting(sorting.filter((s) => s.index !== i));
          break;
        default:
          break;
      }
    } else {
      setSorting([...sorting, { index: i, fieldSort: "ascending" }]);
    }
  };
  const handleRefreshData = () => {
    if (onRefreshDataBtnClick) {
      onRefreshDataBtnClick();
      if (onUndoInitialSelectedRow) {
        onUndoInitialSelectedRow();
      }
    }
  };
  const handleSelectSortingFieldInSettingsBox = (e) => {
    document
      .querySelectorAll(`#${tableId} thead th`)
      [e.value].scrollIntoView({ behavior: "smooth" });
  };
  const handleSelectAllRowClicked = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      onSelectAllRow();
    } else {
      onUnselectAllRow();
    }
  };

  // Add feature tracking method here
  // Effects when trigger feature
  // - page index
  // - page record amount
  // - sorting
  useEffect(() => {
    let currentRecordsOfPage = [];
    // Sort the records
    let sortedTableMappedRecords = tableMappedRecords.sort((a, b) => {
      let firstRowData = a.data;
      let secondRowData = b.data;
      // Array of compare value (-1, 0 and 1)
      let compareCriteriaArr = sorting.map((sortItem) => {
        let { index, fieldSort } = sortItem;
        let { cellData: firstCellData, dataType } = firstRowData[index];
        let secondCellData = secondRowData[index].cellData;
        if (fieldSort === "ascending") {
          switch (dataType) {
            case "singleLineText":
            case "multilineText":
            case "singleSelect":
            case "email":
            case "longText":
            case "formula":
              if (!firstCellData) {
                return -1;
              } else if (!secondCellData) {
                return 1;
              }
              return firstCellData.localeCompare(secondCellData);
            case "multipleSelect":
            case "multipleAttachments":
            case "multipleLookupValues":
            case "multipleRecordLinks":
              if (firstCellData.length - secondCellData.length > 0) {
                return 1;
              } else if (firstCellData.length - secondCellData.length === 0) {
                return 0;
              } else {
                return -1;
              }
            case "date":
            case "dateTime":
            case "createdTime":
            case "lastModifiedTime":
              let firstDate = new Date(firstCellData);
              let secondDate = new Date(secondCellData);
              if (firstDate - secondDate > 0) {
                return 1;
              } else if (firstDate - secondDate === 0) {
                return 0;
              } else {
                return -1;
              }
            case "checkbox":
              if (
                (firstCellData && secondCellData) ||
                (!firstCellData && !secondCellData)
              ) {
                return 0;
              } else if (firstCellData && !secondCellData) {
                return 1;
              } else {
                return -1;
              }
            default:
              console.error("Error while sorting table", dataType);
              break;
          }
        } else {
          switch (dataType) {
            case "singleLineText":
            case "multilineText":
            case "singleSelect":
            case "email":
            case "longText":
            case "formula":
              if (!firstCellData) {
                return 1;
              } else if (!secondCellData) {
                return -1;
              }
              return secondCellData.localeCompare(firstCellData);
            case "multipleSelect":
            case "multipleAttachments":
            case "multipleLookupValues":
            case "multipleRecordLinks":
              if (secondCellData.length - firstCellData.length > 0) {
                return 1;
              } else if (secondCellData.length - firstCellData.length === 0) {
                return 0;
              } else {
                return -1;
              }
            case "date":
            case "dateTime":
            case "createdTime":
            case "lastModifiedTime":
              let firstDate = new Date(firstCellData);
              let secondDate = new Date(secondCellData);
              if (secondDate - firstDate > 0) {
                return 1;
              } else if (secondDate - firstDate === 0) {
                return 0;
              } else {
                return -1;
              }
            case "checkbox":
              if (
                (firstCellData && secondCellData) ||
                (!firstCellData && !secondCellData)
              ) {
                return 0;
              } else if (secondCellData && !firstCellData) {
                return 1;
              } else {
                return -1;
              }
            default:
              console.error("Error while sorting table", dataType);
              break;
          }
        }
        return 0;
      });
      let sumCompareVal = 0;
      compareCriteriaArr.forEach((val) => {
        sumCompareVal += val;
      });
      return sumCompareVal;
    });
    // Display records for current page index
    sortedTableMappedRecords.forEach((recordData, recordIndex) => {
      const recordIndexMin = recordsPerPage * (activePageIndex - 1);
      const recordIndexMax = recordsPerPage * activePageIndex - 1;
      if (recordIndex >= recordIndexMin && recordIndex <= recordIndexMax) {
        currentRecordsOfPage.push(recordData);
      }
    });
    setRecordTableInCurrentPage(currentRecordsOfPage);
    setPageList(() => {
      const newState = [];
      let pageStart = 1;
      let pageEnd = pageAmount;
      if (maxPageDisplay < pageAmount) {
        if (activePageIndex - maxPageDisplay + 1 < 1) {
          pageEnd = pageStart + maxPageDisplay - 1;
          setIsPageListExceed({
            pageStart: false,
            pageEnd: true,
          });
        } else if (activePageIndex + maxPageDisplay - 1 > pageAmount) {
          pageStart = pageAmount - maxPageDisplay + 1;
          setIsPageListExceed({
            pageStart: true,
            pageEnd: false,
          });
        } else {
          pageStart = activePageIndex - maxPageDisplay + 2;
          pageEnd = pageStart + maxPageDisplay - 1;
          setIsPageListExceed({
            pageStart: true,
            pageEnd: true,
          });
        }
      } else {
        setIsPageListExceed({
          pageStart: false,
          pageEnd: false,
        });
      }
      for (let i = pageStart; i <= pageEnd; i++) {
        newState.push(i);
      }
      return newState;
    });
    // eslint-disable-next-line
  }, [tableMappedRecords, recordsPerPage, activePageIndex, sorting]);

  // Reset search value effect
  useEffect(() => {
    setTableMappedRecords(mappedRecords);
  }, [mappedRecords]);

  // Auto submit search again if search value empty
  useEffect(() => {
    if (
      searchValue === "" ||
      searchValue === null ||
      searchValue === undefined
    ) {
      handleSearchSubmit();
    }
    // eslint-disable-next-line
  }, [searchValue]);

  // Responsive for footer
  useEffect(() => {
    if (footerNavRef.current?.clientHeight > 41) {
      setIsPaginationCenter(true);
    } else if (footerNavRef.current?.clientHeight > 0) {
      setIsPaginationCenter(false);
    }
  }, [innerWidth]);

  return (
    <>
      <div
        className="card-header justify-content-between align-items-center flex-nowrap py-1"
        style={{
          gap: "5px",
          paddingRight: "5px",
          height: "auto",
          paddingLeft: isReferenceBox ? 0 : undefined,
        }}
      >
        {onCreateNewBtnClick && (
          <button
            className="btn btn-success d-flex px-1 py-1 mr-2"
            style={{ width: "30px", height: "28px" }}
            onClick={onCreateNewBtnClick}
          >
            <MdLibraryAdd size={20} style={{ margin: "auto" }} />
          </button>
        )}
        {onRefreshDataBtnClick && (
          <button
            className="btn btn-primary d-flex px-1 py-1 mr-2"
            style={{ width: "30px", height: "28px" }}
            onClick={handleRefreshData}
          >
            <MdRefresh size={20} />
          </button>
        )}
        {hasSearching && (
          <Search
            id={`table-search-${tableId}`}
            placeholder="Search..."
            value={searchValue}
            onChange={handleChangeSearchValue}
            onSubmit={handleSearchSubmit}
            onClear={handleClearSearchResult}
          />
        )}
        {hasSettings && (
          <Col
            columnSize={["auto"]}
            className="d-flex align-items-center"
            style={{
              height: "52px",
              paddingRight: isReferenceBox ? 0 : undefined,
            }}
          >
            <div className="dropdown">
              <button
                className="btn btn-link rounded px-0 py-0"
                onClick={() => setShowSettings(true)}
              >
                <MdSettings size={20} />
              </button>
              <Outclick onOutClick={() => setShowSettings(false)}>
                <div
                  className={`shadow dropdown-menu px-3 dropdown-menu-right${
                    showSettings ? " d-block" : ""
                  }`}
                  style={{ width: "280px" }}
                >
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group d-flex flex-nowrap justify-content-between align-items-center mb-0">
                        <label
                          className="mb-0"
                          htmlFor={`max-record-per-page_${tableId}`}
                        >
                          Records/page
                        </label>
                        <input
                          id={`max-record-per-page_${tableId}`}
                          className="form-control"
                          type="number"
                          value={recordsPerPage}
                          style={{ marginLeft: "100px" }}
                          onChange={(e) => {
                            setActivePageIndex(1);
                            e.target.value > 0 && e.target.value !== ""
                              ? setRecordPerPage(e.target.value)
                              : setRecordPerPage(1);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group d-flex flex-nowrap justify-content-between align-items-center mb-0">
                        <label
                          className="mb-0"
                          htmlFor={`go-to-page_${tableId}`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Go to page
                        </label>
                        <input
                          id={`go-to-page_${tableId}`}
                          className="form-control"
                          type="number"
                          placeholder={activePageIndex}
                          style={{ marginLeft: "110px" }}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (value) {
                              if (parseInt(value) < 1) {
                                setActivePageIndex(1);
                              } else if (parseInt(value) > pageAmount) {
                                setActivePageIndex(pageAmount);
                              } else {
                                setActivePageIndex(parseInt(value));
                              }
                            } else {
                              setActivePageIndex(1);
                            }
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  {hasSorting && (
                    <Row>
                      <Col columnSize={["12"]}>
                        <div className="form-group d-flex flex-nowrap justify-content-between align-items-center mb-0">
                          <label
                            className="mb-0"
                            htmlFor={`go-to-page-select_${tableId}`}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Sorting list
                          </label>
                          <Select
                            inputId={`go-to-page-select_${tableId}`}
                            placeholder="Order list..."
                            noOptionsMessage={() => (
                              <span>No sorted field</span>
                            )}
                            className="ml-4"
                            options={sorting.map((s, i) => ({
                              label: `${i + 1}: ${fieldList[s.index]} (${
                                s.fieldSort
                              })`,
                              value: s.index,
                            }))}
                            onChange={handleSelectSortingFieldInSettingsBox}
                          />
                        </div>
                      </Col>
                    </Row>
                  )}
                </div>
              </Outclick>
            </div>
          </Col>
        )}
      </div>
      <div
        className="table-responsive mb-0 border-bottom position-relative"
        ref={tableRef}
        style={tableStyle}
      >
        {recordTableInCurrentPage.length ? (
          <table
            className="table table-sm table-nowrap table-bordered card-table"
            id={tableId}
            style={
              isReferenceBox
                ? {
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  }
                : undefined
            }
          >
            <thead>
              <tr>
                {isReferenceBox && (
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      left: 0,
                      display: "flex",
                      paddingRight: "1.5rem",
                      height: "48px",
                      zIndex: 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`table-reference-select-all-row_${tableId}`}
                      onChange={handleSelectAllRowClicked}
                    />
                  </th>
                )}
                {fieldList.map((fieldItem, i) => (
                  <th key={i} className="position-relative">
                    <span className="text-muted mr-5">{fieldItem}</span>
                    {hasSorting && (
                      <div
                        className="position-absolute d-inline-block ml-2"
                        style={{
                          cursor: "pointer",
                          width: "30px",
                          right: "12px",
                        }}
                        onClick={() => handleSortingRecords(i)}
                      >
                        <MdKeyboardArrowUp
                          style={{
                            position: "absolute",
                            top: -7,
                            border: "1px solid #95aac9",
                            borderTopLeftRadius: "3px",
                            borderTopRightRadius: "3px",
                            backgroundColor:
                              sorting.find((s) => s.index === i)?.fieldSort ===
                              "ascending"
                                ? "#2c7be5"
                                : "",
                          }}
                          size={15}
                          color={
                            sorting.find((s) => s.index === i)?.fieldSort ===
                            "ascending"
                              ? "#fff"
                              : ""
                          }
                        />
                        <MdKeyboardArrowDown
                          style={{
                            position: "absolute",
                            top: 7,
                            border: "1px solid #95aac9",
                            borderBottomLeftRadius: "3px",
                            borderBottomRightRadius: "3px",
                            backgroundColor:
                              sorting.find((s) => s.index === i)?.fieldSort ===
                              "descending"
                                ? "#2c7be5"
                                : "",
                          }}
                          size={15}
                          color={
                            sorting.find((s) => s.index === i)?.fieldSort ===
                            "descending"
                              ? "#fff"
                              : ""
                          }
                        />
                      </div>
                    )}
                    {sorting.findIndex((s) => s.index === i) > -1 && (
                      <span style={{ position: "absolute", right: 15 }}>
                        {sorting.findIndex((s) => s.index === i) + 1}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="list">
              {recordTableInCurrentPage.map((recordData, rowIndex) => (
                <RowHover
                  key={recordData.rowId}
                  onClick={(e) => handleEditRecord(e, recordData)}
                >
                  {isReferenceBox && (
                    <td
                      style={{
                        position: "fixed",
                        top: "auto",
                        left: 25,
                        display: "flex",
                        paddingRight: "1.5rem",
                        height: "74px",
                        backgroundColor: "white",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`table-reference-select-row_${tableId}_${rowIndex}`}
                        checked={
                          currentReferenceBoxValue?.find(
                            (v) => v === recordData.rowId
                          )
                            ? true
                            : false
                        }
                        readOnly
                      />
                    </td>
                  )}
                  {recordData.data.map((value, cellRowIndex) => (
                    <td
                      style={{
                        minWidth: 160,
                      }}
                      key={cellRowIndex}
                    >
                      {injectDataToJSX(
                        value,
                        metadata.fields.find(
                          (f) => f.name === fieldList[cellRowIndex]
                        )
                      )}
                    </td>
                  ))}
                </RowHover>
              ))}
            </tbody>
          </table>
        ) : (
          <span
            style={{
              textAlign: "center",
              width: "100%",
              display: "block",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            There is no data here...
          </span>
        )}
      </div>
      <nav
        className={`d-flex align-items-center flex-wrap px-3 py-1 justify-content-${
          isPaginationCenter ? "center" : "between"
        }`}
        style={{ gap: "5px", marginTop: "5px" }}
        ref={footerNavRef}
      >
        <span
          className={`badge badge-success${innerWidth < 330 ? " my-3" : ""}`}
          style={{ lineHeight: "1.5" }}
        >
          {`${tableMappedRecords.length} ${
            tableMappedRecords.length > 1 ? "records" : "record"
          } in total`}
        </span>
        {currentReferenceBoxValue?.length > 0 && (
          <span className="badge badge-primary" style={{ lineHeight: "1.5" }}>
            {`${currentReferenceBoxValue.length} ${
              currentReferenceBoxValue.length > 1 ? "records" : "record"
            } selected`}
          </span>
        )}
        {tableMappedRecords.length > 0 && (
          <ul className="pagination mb-0">
            <li
              className="rounded page-item"
              onClick={() => {
                activePageIndex > 1 && setActivePageIndex(activePageIndex - 1);
              }}
              style={{ cursor: "pointer" }}
            >
              <button className="rounded page-link border-0 bg-transparent">
                Previous
              </button>
            </li>
            {isPageListExceed.pageStart && (
              <li className="page-item start-exceed d-flex align-items-center">
                ...
              </li>
            )}
            {pageList.map((indexPagination) => (
              <li
                key={indexPagination}
                className={`page-item${
                  indexPagination === activePageIndex ? " active" : ""
                }`}
                onClick={() => setActivePageIndex(indexPagination)}
                style={{ cursor: "pointer" }}
              >
                <button className="rounded page-link border-0">
                  {indexPagination}
                </button>
              </li>
            ))}
            {isPageListExceed.pageEnd && (
              <li className="page-item end-exceed d-flex align-items-center">
                ...
              </li>
            )}
            <li
              className="rounded page-item"
              onClick={() => {
                activePageIndex < pageAmount &&
                  setActivePageIndex(activePageIndex + 1);
              }}
              style={{ cursor: "pointer" }}
            >
              <button className="rounded page-link border-0 bg-transparent">
                Next
              </button>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
}

// ====================================================================

/**
 * Create an JSX for table cell to render
 * @param {Object} cell cell object that retrieve after the mapResultToTableData function
 * @param {Boolean} isRecursive true if the cell that have sourceType property (probably the "lookup" dataType)
 * @returns if isSourceTypeKnown=true then return a displayData only (injected again to this function),
 * otherwise return a cellJSX ready to render
 */
function injectDataToJSX(cell, metadata) {
  let displayData = null; // the cell data has been injected to an JSX to render
  let { cellData, dataType } = cell;
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
            className="badge"
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
          (displayData = <CellDetail>{cellData}</CellDetail>)
        : cellData !== "" &&
          cellData !== undefined &&
          (displayData = <CellDetail>{cellData}</CellDetail>);
      break;
    case "multipleSelects":
    case "multipleLookupValues":
      displayData = (
        <CellDetail isMultiValue meta={metadata}>
          {cellData}
        </CellDetail>
      );
      break;
    case "multipleAttachments":
      displayData = cellData.map((item, i) => (
        <img
          key={i}
          className="cell-img"
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
        <input
          name="table-checkbox"
          className="cell-checkbox mr-3"
          type="checkbox"
          checked={cellData ? true : false}
          readOnly
        />
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
      className="cell-data d-flex justify-content-start align-items-center"
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

const RowHover = styled.tr`
  position: relative;
  cursor: pointer;
  :hover {
    background-color: aliceblue;
  }
`;
function CellDetail({ children, isMultiValue, meta }) {
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
  return Array.isArray(children) && children.length ? (
    <div className="d-flex justify-content-start align-items-center">
      <span
        className={`cell-preview mr-2${isMultiValue && styles ? " badge" : ""}`}
        style={styles}
      >
        {Array.isArray(children)
          ? children[0]
          : children !== null &&
            children !== undefined &&
            children.slice(0, 8).trimRight()}
      </span>
      <Dropdown
        className="cell-multi"
        title="..."
        variant="light"
        position="right"
      >
        <div
          className="cell-detail d-flex flex-column"
          style={{ maxWidth: "400px", gap: "5px" }}
        >
          {Array.isArray(children)
            ? children.map((item, i) => {
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
                  <div key={i} className="cell-detail-item py-1 px-3">
                    <span
                      className={`${isBadged ? "badge" : ""}`}
                      style={styles}
                    >
                      {item}
                    </span>
                  </div>
                );
              })
            : children !== null &&
              children !== undefined && (
                <div className="cell-detail-item py-1 px-3">{children}</div>
              )}
        </div>
      </Dropdown>
    </div>
  ) : null;
}

Table.defaultProps = {
  recordPerPage: 5,
  maxPageDisplay: 4,
};
Table.propTypes = {
  tableId: PropTypes.string,
  metadata: PropTypes.object,
  /**
   * The list of field that's displayed in the table
   */
  fieldList: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * The records get from Airtable have been mapped to table records,
   * per element of array must is in order and suitable with fieldList,
   * using ***mapResultToTableData*** of airtable.service.js
   */
  mappedRecords: PropTypes.arrayOf(PropTypes.any).isRequired,
  /**
   * Used for editing table that reflect the Airtable database
   * Original records array get from Airtable that haven't mapped
   * to Table row array yet
   */
  originalRecords: PropTypes.arrayOf(
    PropTypes.shape({
      createdTime: PropTypes.string,
      fields: PropTypes.object,
      /**
       * The RecordId on Airtable
       */
      id: PropTypes.string,
    })
  ),
  hasSettings: PropTypes.bool,
  hasSearching: PropTypes.bool,
  hasSorting: PropTypes.bool,
  onRecordClick: PropTypes.func,
  onCreateNewBtnClick: PropTypes.func,
  onRefreshDataBtnClick: PropTypes.func,
  recordPerPage: PropTypes.number,
  maxPageDisplay: PropTypes.number,
  tableStyle: PropTypes.object,
  /**
   * Used for Reference Box, set to true if this table is used in LinkRecordPicker
   */
  isReferenceBox: PropTypes.bool,
  /**
   * Used for Reference Box, current array of recordId state { rowId: string, checked: boolean } is selected
   */
  currentReferenceBoxValue: PropTypes.arrayOf(PropTypes.string),
  /**
   * Used for Reference Box, select all row
   */
  onSelectAllRow: PropTypes.func,
  /**
   * Used for Reference Box, unselect all row
   */
  onUnselectAllRow: PropTypes.func,
  /**
   * Used for Reference Box, undo to initial/default selected row
   */
  onUndoInitialSelectedRow: PropTypes.func,
};

export default Table;
