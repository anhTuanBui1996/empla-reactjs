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

function Table({
  metadata,
  fieldList,
  mappedRecords,
  originalRecords,
  hasSettings,
  hasSearching,
  onRecordClick,
  onCreateNewBtnClick,
  onRefreshDataBtnClick,
  recordPerPage,
  maxPageDisplay,
  tableStyle,
}) {
  const dispatch = useDispatch();
  const tableRef = useRef(null);
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
          setSorting(
            sorting.map((sortItem) => {
              if (sortItem.index === i) {
                return {
                  index: i,
                  fieldSort: "ascending",
                };
              }
              return sortItem;
            })
          );
          break;
        default:
          break;
      }
    } else {
      setSorting([...sorting, { index: i, fieldSort: "ascending" }]);
    }
  };

  // Add feature tracking method here
  // Effects when trigger feature
  // - page index
  // - page record amount
  useEffect(() => {
    let currentRecordsOfPage = [];
    // Sort the records
    tableMappedRecords.sort((a, b) => {
      let firstRowData = a.data;
      let secondRowData = b.data;
      sorting.forEach((sortItem) => {
        let { index, fieldSort } = sortItem;
        let { cellData: firstCellData, dataType } = firstRowData[index];
        let secondCellData = secondRowData[index];
        if (fieldSort === "ascending") {
          switch (dataType) {
            case "singleLineText":
              firstCellData.localeCompare(secondCellData);
              break;
            case "multilineText":
              break;
            case "singleSelect":
              break;
            case "email":
              break;
            case "multipleSelect":
              break;
            case "longText":
              break;
            case "multipleAttachments":
              break;
            case "date":
              break;
            case "dateTime":
              break;
            case "createdTime":
              break;
            case "lastModifiedTime":
              break;
            case "checkbox":
              break;
            case "multipleLookupValues":
              break;
            case "formula":
              break;
            case "multipleRecordLinks":
              // list of linked record, rarely used...
              break;
            default:
              console.error("Error while sorting table", dataType);
              break;
          }
        } else {
        }
      });
    });
    // Display records for current page index
    tableMappedRecords.forEach((recordData, recordIndex) => {
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

  // Get cardWidth when windowWidth change and set pagination alignment
  useEffect(() => {
    tableRef.current && tableRef.current.clientWidth < 435
      ? setIsPaginationCenter(true)
      : setIsPaginationCenter(false);
  }, []);

  return (
    <>
      <div
        className="card-header justify-content-between align-items-center flex-nowrap py-1"
        style={{ gap: "5px", paddingRight: "5px", height: "auto" }}
      >
        {onCreateNewBtnClick && (
          <button
            className="btn btn-success d-flex px-1 py-1 mr-2"
            style={{ width: "30px", height: "30px" }}
            onClick={onCreateNewBtnClick}
          >
            <MdLibraryAdd size={20} style={{ margin: "auto" }} />
          </button>
        )}
        {onRefreshDataBtnClick && (
          <button
            className="btn btn-primary d-flex px-1 py-1 mr-2"
            style={{ width: "30px", height: "30px" }}
            onClick={onRefreshDataBtnClick}
          >
            <MdRefresh size={20} />
          </button>
        )}
        {hasSearching && (
          <Search
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
            style={{ height: "52px" }}
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
                  style={{ width: "248px" }}
                >
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group d-flex flex-nowrap justify-content-between align-items-center mb-0">
                        <label className="mb-0" htmlFor="max-record-per-page">
                          Records/page
                        </label>
                        <input
                          id="max-record-per-page"
                          className="form-control ml-4"
                          type="number"
                          value={recordsPerPage}
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
                          htmlFor="go-to-page"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Go to page
                        </label>
                        <input
                          id="go-to-page"
                          className="form-control ml-4"
                          type="number"
                          placeholder={activePageIndex}
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
                </div>
              </Outclick>
            </div>
          </Col>
        )}
      </div>
      <div
        className="table-responsive mb-0 border-bottom"
        ref={tableRef}
        style={tableStyle}
      >
        {recordTableInCurrentPage.length ? (
          <table className="table table-sm table-nowrap card-table">
            <thead>
              <tr>
                {fieldList.map((fieldItem, i) => (
                  <th style={{ minWidth: 160 }} key={i}>
                    <span className="text-muted">{fieldItem}</span>
                    <div
                      className="position-relative d-inline ml-2"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleSortingRecords(i)}
                    >
                      <MdKeyboardArrowUp
                        style={{
                          position: "absolute",
                          top: -6,
                        }}
                        size={15}
                        color={`${sorting[i] === "ascending" ? "#2c7be5" : ""}`}
                      />
                      <MdKeyboardArrowDown
                        style={{
                          position: "absolute",
                          top: 4,
                        }}
                        size={15}
                        color={`${
                          sorting[i] === "descending" ? "#2c7be5" : ""
                        }`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="list">
              {recordTableInCurrentPage.map((recordData) => (
                <RowHover
                  key={recordData.rowId}
                  onClick={(e) => handleEditRecord(e, recordData)}
                >
                  {recordData.data.map((value, cellRowIndex) => (
                    <td style={{ minWidth: 160 }} key={cellRowIndex}>
                      {injectDataToJSX(value)}
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
        className={`d-flex align-items-center flex-wrap px-3 py-1 ${
          isPaginationCenter
            ? "justify-content-center"
            : "justify-content-between"
        }`}
        style={{ gap: "5px", marginTop: "5px" }}
      >
        <span
          className={`badge badge-success${innerWidth < 330 ? " my-3" : ""}`}
          style={{ lineHeight: "1.5" }}
        >
          {`${tableMappedRecords.length} ${
            tableMappedRecords.length > 1 ? "records" : "record"
          } in total`}
        </span>
        {tableMappedRecords.length > 0 && (
          <ul className="pagination mb-0">
            <li
              className="rounded page-item"
              onClick={() => {
                activePageIndex > 1 && setActivePageIndex(activePageIndex - 1);
              }}
              style={{ cursor: "pointer" }}
            >
              <button className="rounded page-link border-0">Previous</button>
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
              <button className="rounded page-link border-0">Next</button>
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
function injectDataToJSX(cell) {
  let displayData = null; // the cell data has been injected to an JSX to render
  let { cellData, dataType } = cell;
  switch (dataType) {
    case "singleLineText":
      displayData = cellData;
      break;
    case "multilineText":
      Array.isArray(cellData)
        ? cellData.length > 0 &&
          (displayData = <CellDetail>{cellData}</CellDetail>)
        : cellData !== "" &&
          cellData !== undefined &&
          (displayData = <CellDetail>{cellData}</CellDetail>);
      break;
    case "singleSelect":
      displayData = cellData;
      break;
    case "email":
      displayData = cellData;
      break;
    case "multipleSelect":
      displayData = <CellDetail>{cellData}</CellDetail>;
      break;
    case "longText":
      displayData = cellData;
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
      displayData = new Date(cellData).toLocaleDateString("en-GB");
      break;
    case "dateTime":
      displayData = new Date(cellData).toLocaleString("en-GB", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      break;
    case "createdTime":
      displayData = new Date(cellData).toLocaleString();
      break;
    case "lastModifiedTime":
      displayData = new Date(cellData).toLocaleString();
      break;
    case "checkbox":
      displayData = (
        <input
          className="cell-checkbox mr-3"
          type="checkbox"
          checked
          readOnly
        />
      );
      break;
    case "multipleLookupValues":
      displayData = <CellDetail>{cellData}</CellDetail>;
      break;
    case "formula":
      displayData = cellData;
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
  cursor: pointer;
  :hover {
    background-color: aliceblue;
  }
`;
function CellDetail({ children }) {
  return (
    <div className="d-flex justify-content-start align-items-center">
      <span className="cell-preview mr-2">
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
          style={{ maxWidth: "400px" }}
        >
          {Array.isArray(children)
            ? children.map((item, i) => (
                <div key={i} className="cell-detail-item py-1 px-3">
                  {item}
                </div>
              ))
            : children !== null &&
              children !== undefined && (
                <div className="cell-detail-item py-1 px-3">{children}</div>
              )}
        </div>
      </Dropdown>
    </div>
  );
}

Table.defaultProps = {
  recordPerPage: 5,
  maxPageDisplay: 4,
};
Table.propTypes = {
  metadata: PropTypes.object,
  /**
   * If you use the ***forFormEditor*** props, the ***syncField*** of forFormEditor
   * must is the first field of fieldList. The ***syncField*** is the field
   * that all tables in the **Card** have.
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
  onRecordClick: PropTypes.func,
  onCreateNewBtnClick: PropTypes.func,
  onRefreshDataBtnClick: PropTypes.func,
  recordPerPage: PropTypes.number,
  maxPageDisplay: PropTypes.number,
  tableStyle: PropTypes.object,
};

export default Table;
