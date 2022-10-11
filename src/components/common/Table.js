import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdExpand, MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import styled from "styled-components";
import { AIRTABLE } from "../../constants";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import Col from "../layout/Col";
import Row from "../layout/Row";
import CustomSwitch from "./CustomSwitch";
import Search from "./Search";

function Table({
  tableName,
  fieldList,
  recordList,
  forEditing,
  isHasSettings,
  onRecordClick,
  recordPerPage,
  maxPageDisplay,
  tableStyle,
}) {
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const innerWidth = useSelector(selectInnerWidth);
  const fieldsForSearch = useMemo(() => {
    const newList = [];
    fieldList.forEach((field, index) => {
      let fieldMetadata = AIRTABLE.FIELD_TYPE[tableName][field];
      let fieldDataType = fieldMetadata.dataType;
      console.log(fieldMetadata, fieldDataType);
      if (fieldDataType === "lookup") fieldDataType = fieldMetadata.sourceType;
      let notSuportFields = AIRTABLE.NOT_SUPPORT_DATA_TYPE.FOR_SEARCHING;
      if (notSuportFields.indexOf(fieldDataType) === -1) {
        return newList.push({ field, index });
      }
    });
    return newList;
  }, [fieldList, tableName]);
  const fieldsForSort = useMemo(() => {
    const newList = [];
    fieldList.forEach((field, index) => {
      let fieldMetadata = AIRTABLE.FIELD_TYPE[tableName][field];
      let fieldDataType = fieldMetadata.dataType;
      if (fieldDataType === "lookup") fieldDataType = fieldMetadata.sourceType;
      let notSuportFields = AIRTABLE.NOT_SUPPORT_DATA_TYPE.FOR_SORTING;
      if (notSuportFields.indexOf(fieldDataType) === -1) {
        return newList.push({ field, index });
      }
    });
    return newList;
  }, [fieldList, tableName]);

  const [activeIndex, setActiveIndex] = useState(1);
  const [recordsPerPage, setRecordPerPage] = useState(recordPerPage);
  const pageAmount = useMemo(() => {
    return recordList.length % recordsPerPage > 0
      ? parseInt(recordList.length / recordsPerPage) + 1
      : recordList.length / recordsPerPage;
  }, [recordList, recordsPerPage]);
  const [pageList, setPageList] = useState([]);
  const [isPageListExceed, setIsPageListExceed] = useState({
    pageStart: false,
    pageEnd: false,
  });
  const [recordTableList, setRecordTableList] = useState(recordList);

  const [showSettings, setShowSettings] = useState(false);
  const [isPaginationCenter, setIsPaginationCenter] = useState(false);

  const [searchStatus, setSearchStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchCritea, setSearchCritea] = useState(fieldsForSearch[0]);

  const [sortStatus, setSortStatus] = useState(false);
  const [sortCritea, setSortCritea] = useState(fieldsForSort[0]);
  const [sortDirection, setSortDirection] = useState("ascending");
  const sortOptionList = [
    { label: "⇧", value: "ascending" },
    { label: "⇩", value: "descending" },
  ];

  const handleEditRecord = (e, recordSelectedForEdit) => {
    e.preventDefault();
    if (forEditing && onRecordClick) {
      const recordId = recordSelectedForEdit.rowId;

      const { syncRecords, syncReducer } = forEditing;
      const recordSelected = syncRecords.find(
        (record) => record.id === recordId
      );
      dispatch(syncReducer(recordSelected));
      setTimeout(onRecordClick, 50);
    }
  };

  // Effects when trigger the search/sort feature
  useEffect(() => {
    setSearchCritea({ field: fieldsForSearch[0], index: 0 });
    setSortCritea({ field: fieldsForSort[0], index: 0 });
  }, [fieldsForSearch, fieldsForSort]);
  useEffect(() => {
    let newRecordList = [];
    recordList.forEach((recordData) => {
      const dataArr = recordData.data;
      let { cellData, dataType, sourceType } = dataArr[searchCritea.index];
      if (dataType === "lookup") dataType = sourceType;
      if (searchStatus) {
        // Reset search when fieldList changed (change Card's tab)
        if (fieldsForSearch.indexOf(searchCritea.field) === -1) {
          return () => {
            setSearchCritea({ field: fieldList[0], index: 0 });
            setSearchValue("");
            setSearchStatus(false);
          };
        }
        setActiveIndex(1);
        if (dataType === "singleLineText" || dataType === "longText") {
          if (cellData.includes(searchValue)) {
            newRecordList.push(recordData);
          }
        } else if (dataType === "checkbox") {
          // ...
        }
      } else {
        newRecordList.push(recordData);
      }
    });
    if (sortStatus) {
      const targetFieldIndex = fieldsForSort.indexOf(sortCritea.field);
      if (targetFieldIndex === -1) {
        return () => {
          setSortDirection("ascending");
          setSortCritea({ field: fieldsForSort[0], index: 0 });
          setSortStatus(false);
        };
      }
      if (sortDirection === "ascending") {
        newRecordList = newRecordList.sort((a, b) => {
          let firstTargetData = a.data[targetFieldIndex];
          let secondTargetData = b.data[targetFieldIndex];
          if (
            (firstTargetData.dataType === "singleLineText" ||
              firstTargetData.dataType === "longText") &&
            (secondTargetData.dataType === "singleLineText" ||
              secondTargetData.dataType === "longText")
          ) {
            return firstTargetData.cellData.localeCompare(
              secondTargetData.cellData
            );
          } else {
            // ...
            return firstTargetData.cellData.localeCompare(
              secondTargetData.cellData
            );
          }
        });
      } else if (sortDirection === "descending") {
        newRecordList = newRecordList.sort((a, b) => {
          let firstTargetData = a.data[targetFieldIndex];
          let secondTargetData = b.data[targetFieldIndex];
          if (
            (firstTargetData.dataType === "singleLineText" ||
              firstTargetData.dataType === "longText") &&
            (secondTargetData.dataType === "singleLineText" ||
              secondTargetData.dataType === "longText")
          ) {
            return secondTargetData.cellData.localeCompare(
              firstTargetData.cellData
            );
          } else {
            // ...
            return secondTargetData.cellData.localeCompare(
              firstTargetData.cellData
            );
          }
        });
      }
    }
    let currentRecordsOfPage = [];
    newRecordList.forEach((recordData, recordIndex) => {
      const recordIndexMin = recordsPerPage * (activeIndex - 1);
      const recordIndexMax = recordsPerPage * activeIndex - 1;
      if (recordIndex >= recordIndexMin && recordIndex <= recordIndexMax) {
        currentRecordsOfPage.push(recordData);
      }
    });
    setRecordTableList(currentRecordsOfPage);
    setPageList(() => {
      const newState = [];
      let pageStart = 1;
      let pageEnd = pageAmount;
      if (maxPageDisplay < pageAmount) {
        if (activeIndex - maxPageDisplay + 1 < 1) {
          pageEnd = pageStart + maxPageDisplay - 1;
          setIsPageListExceed({
            pageStart: false,
            pageEnd: true,
          });
        } else if (activeIndex + maxPageDisplay - 1 > pageAmount) {
          pageStart = pageAmount - maxPageDisplay + 1;
          setIsPageListExceed({
            pageStart: true,
            pageEnd: false,
          });
        } else {
          pageStart = activeIndex - maxPageDisplay + 2;
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
  }, [
    recordList,
    recordsPerPage,
    activeIndex,
    searchStatus,
    searchValue,
    searchCritea,
    sortStatus,
    sortCritea.index,
    sortDirection,
  ]);
  // Get cardWidth when windowWidth change
  useEffect(() => {
    tableRef.current && tableRef.current.clientWidth < 435
      ? setIsPaginationCenter(true)
      : setIsPaginationCenter(false);
  }, []);

  return (
    <>
      {isHasSettings && (
        <Row className="justify-content-between flex-nowrap px-3">
          <Col
            columnSize={["10", "md-auto"]}
            className="d-flex align-items-center py-2"
          >
            {searchStatus ? (
              <Search
                noBorder
                placeholder={`Search by ${searchCritea.field}...`}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                value={searchValue}
              />
            ) : (
              " "
            )}
          </Col>
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
                  className={`dropdown-menu px-3 dropdown-menu-right${
                    showSettings ? " d-block" : ""
                  }`}
                  style={{ width: "248px" }}
                >
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group">
                        <Row className="mb-3">
                          <Col
                            columnSize={["12"]}
                            className="d-flex justify-content-between"
                          >
                            <label className="mb-0" htmlFor="search-critea">
                              Search by{" "}
                            </label>
                            <CustomSwitch
                              inputValue={searchStatus}
                              onSwitchChange={setSearchStatus}
                            />
                          </Col>
                        </Row>
                        {searchStatus && (
                          <Select
                            id="search-critea"
                            styles={{
                              input: (provided) => ({
                                ...provided,
                                width: "200px",
                              }),
                            }}
                            value={{
                              label: searchCritea.field,
                              value: searchCritea.field,
                              index: searchCritea.index,
                            }}
                            options={fieldsForSearch.map((fieldObj) => ({
                              label: fieldObj.field,
                              value: fieldObj.field,
                              index: fieldObj.index,
                            }))}
                            onChange={(e) => {
                              setSearchCritea({
                                field: e.value,
                                index: e.index,
                              });
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group">
                        <Row className="mb-3">
                          <Col
                            columnSize={["12"]}
                            className="d-flex justify-content-between"
                          >
                            <label
                              className="mb-0"
                              htmlFor="sort-critea sort-direction"
                            >
                              Sort by{" "}
                            </label>
                            <CustomSwitch
                              inputValue={sortStatus}
                              onSwitchChange={setSortStatus}
                            />
                          </Col>
                        </Row>
                        {sortStatus && (
                          <Row>
                            <Col
                              columnSize={["12"]}
                              className="d-flex justify-content-between"
                            >
                              <Select
                                id="sort-critea"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    width: "120px",
                                  }),
                                }}
                                defaultValue={{
                                  label: fieldsForSort[0].field,
                                  value: fieldsForSort[0].field,
                                }}
                                options={fieldsForSort.map((fieldObj) => ({
                                  label: fieldObj.field,
                                  value: fieldObj.field,
                                  index: fieldObj.index,
                                }))}
                                onChange={(e) => {
                                  setSortCritea({
                                    field: e.value,
                                    index: e.index,
                                  });
                                }}
                              />
                              <Select
                                id="sort-direction"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    width: "80px",
                                  }),
                                }}
                                defaultValue={sortOptionList[0]}
                                options={sortOptionList}
                                onChange={(e) => {
                                  setSortDirection(e.value);
                                }}
                              />
                            </Col>
                          </Row>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col columnSize={["12"]}>
                      <div className="form-group d-flex flex-nowrap justify-content-between align-items-center">
                        <label className="mb-0" htmlFor="max-record-per-page">
                          Records/page
                        </label>
                        <input
                          id="max-record-per-page"
                          className="form-control ml-4"
                          type="number"
                          value={recordsPerPage}
                          onChange={(e) => {
                            setActiveIndex(1);
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
                          placeholder={activeIndex}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (value) {
                              if (parseInt(value) < 1) {
                                setActiveIndex(1);
                              } else if (parseInt(value) > pageAmount) {
                                setActiveIndex(pageAmount);
                              } else {
                                setActiveIndex(parseInt(value));
                              }
                            } else {
                              setActiveIndex(1);
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
        </Row>
      )}
      <div
        className="table-responsive mb-0 border-bottom"
        ref={tableRef}
        style={tableStyle}
      >
        <table className="table table-sm table-nowrap card-table">
          <thead>
            <tr>
              {fieldList.map((fieldItem, i) => (
                <th key={i}>
                  <span className="text-muted">{fieldItem}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="list">
            {recordTableList.map((recordData) => (
              <RowHover
                key={recordData.rowId}
                onClick={(e) => handleEditRecord(e, recordData)}
              >
                {recordData.data.map((value, cellRowIndex) => (
                  <td key={cellRowIndex}>{injectDataToJSX(value)}</td>
                ))}
              </RowHover>
            ))}
          </tbody>
        </table>
      </div>
      <nav
        className={`d-flex align-items-center flex-wrap px-3 py-1 ${
          isPaginationCenter
            ? "justify-content-center"
            : "justify-content-between"
        }`}
        style={{ gap: "5px" }}
      >
        <span
          className={`badge badge-success${innerWidth < 330 ? " my-3" : ""}`}
        >
          {recordList.length} {recordList.length > 1 ? "records" : "record"} in
          total
        </span>
        <ul className="pagination mb-0">
          <li
            className="rounded page-item"
            onClick={() => {
              activeIndex > 1 && setActiveIndex(activeIndex - 1);
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
                indexPagination === activeIndex ? " active" : ""
              }`}
              onClick={() => setActiveIndex(indexPagination)}
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
              activeIndex < pageAmount && setActiveIndex(activeIndex + 1);
            }}
            style={{ cursor: "pointer" }}
          >
            <button className="rounded page-link border-0">Next</button>
          </li>
        </ul>
      </nav>
    </>
  );
}

// ====================================================================

/**
 * Create an JSX for table cell to render
 * @param {Object} cell cell object that retrieve after the mapResultToTableData function
 * @param {Boolean} isSourceTypeKnown true if the cell that have sourceType property (probably the "lookup" dataType)
 * @returns if isSourceTypeKnown=true then return a displayData only (injected again to this function),
 * otherwise return a cellJSX ready to render
 */
function injectDataToJSX(cell, isLookupDataType) {
  let displayData = null; // the cell data has been injected to an JSX to render
  let { cellData, dataType, sourceType } = cell;
  switch (dataType) {
    case "singleLineText":
      displayData = cellData;
      break;
    case "singleSelect":
      displayData = cellData;
      break;
    case "multipleSelect":
      // ...
      break;
    case "longText":
      displayData = cellData;
      break;
    case "attachment":
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
      displayData = new Date(cellData).toLocaleDateString();
      break;
    case "dateTime":
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
    case "lookup":
      const rowCellArr = cellData.map((data) => ({
        cellData: data,
        dataType: sourceType,
      }));
      displayData = rowCellArr.map((rowCell) => injectDataToJSX(rowCell, true));
      break;
    case "formula":
      displayData = cellData;
      break;
    case "linkToAnotherTable":
      // ...
      break;
    default:
      console.error("Error while inject data to table", cellData, dataType);
      break;
  }
  return isLookupDataType ? (
    displayData
  ) : (
    <div
      className="cell-data d-flex justify-content-start align-items-center"
      style={{
        maxWidth: "300px",
        height: "40px",
        overflowWrap: "break-word",
        overflowY: "hidden",
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
  const [isCellDetailOpened, setCellDetailOpen] = useState(false);
  const handleOpenCellDetail = () => setCellDetailOpen(true);
  const handleCloseCellDetail = () => setCellDetailOpen(false);
  return (
    <div className="dropdown">
      {children[0]}
      <Outclick onOutClick={handleCloseCellDetail}>
        <div
          className="cell-detail dropdown-menu"
          style={{ maxWidth: "300px" }}
        >
          <ul className="cell-detail-list">
            {children.map((item, i) => (
              <li key={i} className="cell-detail-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Outclick>
      <button className="cell-detail-toggle" onClick={handleOpenCellDetail}>
        <MdExpand size={10} />
      </button>
    </div>
  );
}

Table.defaultProps = {
  recordPerPage: 5,
  maxPageDisplay: 4,
};
Table.propTypes = {
  tableName: PropTypes.string,
  /**
   * If you use the ***forEditing*** props, the ***syncField*** of forEditing
   * must is the first field of fieldList. The ***syncField*** is the field
   * that all tables in the **Card** have.
   */
  fieldList: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Per element of array must is in order and suitable with fieldList
   */
  recordList: PropTypes.arrayOf(PropTypes.any).isRequired,
  /**
   * Used for editing table that reflect the Airtable database
   */
  forEditing: PropTypes.shape({
    /**
     * Records Array get from Airtable (per element is a retrieved table)
     */
    syncRecords: PropTypes.arrayOf(
      PropTypes.shape({
        createdTime: PropTypes.string,
        fields: PropTypes.object,
        /**
         * The RecordId on Airtable
         */
        id: PropTypes.string,
      })
    ),
    /**
     * We use redux to store the selected record, the reducer array is must
     * in order and suitable with ***syncRecords***
     */
    syncReducer: PropTypes.func,
  }),
  isHasSettings: PropTypes.bool,
  onRecordClick: PropTypes.func,
  recordPerPage: PropTypes.number,
  maxPageDisplay: PropTypes.number,
  tableStyle: PropTypes.object,
};

export default Table;
