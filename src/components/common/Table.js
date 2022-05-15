import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import styled from "styled-components";
import { NOT_SUPPORT_FIELD_FEATURE } from "../../constants";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import Col from "../layout/Col";
import Row from "../layout/Row";
import CustomSwitch from "./CustomSwitch";
import Search from "./Search";

function Table({
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
  const fieldsForSortAndSearch = useMemo(() => {
    const newList = [];
    fieldList.forEach((field, index) => {
      if (NOT_SUPPORT_FIELD_FEATURE.indexOf(field) === -1) {
        return newList.push({ field, index });
      }
    });
    return newList;
  }, [fieldList]);

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
  const [searchCritea, setSearchCritea] = useState(fieldsForSortAndSearch[0]);

  const [sortStatus, setSortStatus] = useState(false);
  const [sortCritea, setSortCritea] = useState(fieldsForSortAndSearch[0]);
  const [sortDirection, setSortDirection] = useState("ascending");
  const sortOptionList = [
    { label: "asc", value: "ascending" },
    { label: "desc", value: "descending" },
  ];

  const handleEditRecord = (e, recordSelected) => {
    e.preventDefault();
    if (forEditing && onRecordClick) {
      // The first value in record is the syncValue
      const syncValue = recordSelected.data[0];

      const { syncTables, syncField, syncReducers } = forEditing;
      syncTables.forEach((table, index) => {
        const recordSelected = table.find((record) => {
          return (
            (Array.isArray(record.fields[syncField])
              ? record.fields[syncField][0]
              : record.fields[syncField]) ===
            (Array.isArray(syncValue) ? syncValue[0] : syncValue)
          );
        });
        dispatch(syncReducers[index](recordSelected));
      });

      setTimeout(onRecordClick, 50);
    }
  };

  // Effects when trigger the search/sort feature
  useEffect(() => {
    setSearchCritea(fieldsForSortAndSearch[0]);
    setSortCritea(fieldsForSortAndSearch[0]);
  }, [fieldsForSortAndSearch]);
  useEffect(() => {
    let newRecordList = [];
    recordList.forEach((recordData) => {
      const cellDataArr = recordData.data;
      const cellDataForSearch = cellDataArr[searchCritea.index];
      if (searchStatus) {
        setActiveIndex(1);
        if (typeof cellDataForSearch === "string") {
          if (cellDataForSearch.includes(searchValue)) {
            newRecordList.push(recordData);
          }
        } else if (Array.isArray(cellDataForSearch)) {
          if (typeof cellDataForSearch[0] === "string") {
            if (cellDataForSearch[0].includes(searchValue)) {
              newRecordList.push(recordData);
            }
          }
        }
      } else {
        newRecordList.push(recordData);
      }
    });
    if (sortStatus) {
      if (sortDirection === "ascending") {
        newRecordList = newRecordList.sort((a, b) => {
          if (
            Array.isArray(a.data[sortCritea.index]) ||
            Array.isArray(b.data[sortCritea.index])
          )
            return a.data[sortCritea.index][0].localeCompare(
              b.data[sortCritea.index][0]
            );
          else
            return a.data[sortCritea.index].localeCompare(
              b.data[sortCritea.index]
            );
        });
      } else {
        newRecordList = newRecordList.sort((a, b) => {
          if (
            Array.isArray(a.data[sortCritea.index]) ||
            Array.isArray(b.data[sortCritea.index])
          )
            return b.data[sortCritea.index][0].localeCompare(
              a.data[sortCritea.index][0]
            );
          else
            return b.data[sortCritea.index].localeCompare(
              a.data[sortCritea.index]
            );
        });
      }
    }
    let newRecordListToDisplay = [];
    newRecordList.forEach((recordData, recordIndex) => {
      const recordIndexMin = recordsPerPage * (activeIndex - 1);
      const recordIndexMax = recordsPerPage * activeIndex - 1;
      if (recordIndex >= recordIndexMin && recordIndex <= recordIndexMax) {
        newRecordListToDisplay.push(recordData);
      }
    });
    setRecordTableList(newRecordListToDisplay);
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
    if (tableRef?.current?.clientWidth) {
      let tableViewWidth = tableRef.current.clientWidth;
      tableViewWidth < 435
        ? setIsPaginationCenter(true)
        : setIsPaginationCenter(false);
    }
  }, [tableRef?.current?.clientWidth]);

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
                            <CustomSwitch onSwitchChange={setSearchStatus} />
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
                            options={fieldsForSortAndSearch.map(
                              (sortableField) => ({
                                label: sortableField.field,
                                value: sortableField.field,
                                index: sortableField.index,
                              })
                            )}
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
                            <CustomSwitch onSwitchChange={setSortStatus} />
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
                                  label: fieldsForSortAndSearch[0].field,
                                  value: fieldsForSortAndSearch[0].field,
                                }}
                                options={fieldsForSortAndSearch.map(
                                  (sortableField) => ({
                                    label: sortableField.field,
                                    value: sortableField.field,
                                    index: sortableField.index,
                                  })
                                )}
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

function injectDataToJSX(cellData) {
  let cellJSX = null; // the cell data has been injected to an JSX to render
  if (typeof cellData === "string") {
    // Date type {formatted as string}
    // String type
    cellJSX = (
      <div
        className="cellData d-flex justify-content-start align-items-center"
        style={{
          maxWidth: "300px",
          height: "auto",
          overflowWrap: "break-word",
        }}
      >
        {cellData}
      </div>
    );
  } else if (Array.isArray(cellData)) {
    if (typeof cellData[0] === "string") {
      // Looked up field (type's bases on original value)
      // Linked field (always in array)
      // Mutiple select field
      cellJSX = (
        <div
          className="cellData d-flex justify-content-start align-items-center"
          style={{ height: "40px" }}
        >
          {cellData.map((item, i) => {
            return i === cellData.length - 1 ? item : item + ", ";
          })}
        </div>
      );
    } else {
      // Attachment object (ex: .png, .jpg, ...)
      cellJSX = (
        <div
          className="cellData d-flex justify-content-start align-items-center"
          style={{ height: "40px", overflowY: "hidden" }}
        >
          {cellData.map((item, i) => (
            <img key={i} className="cellImg" src={item.url} alt="" width={30} />
          ))}
        </div>
      );
    }
  } else if (cellData === true) {
    // Checkbox type (true or undefined)
    cellJSX = (
      <div
        className="cellData d-flex justify-content-center align-items-center"
        style={{ height: "40px", overflowY: "hidden" }}
      >
        <input
          className="custom-control-input cell-bool"
          type="checkbox"
          checked
          readOnly
        />
      </div>
    );
  }
  return cellJSX;
}

const RowHover = styled.tr`
  cursor: pointer;
  :hover {
    background-color: aliceblue;
  }
`;

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
     * Table Array get from Airtable (per element is a retrived table)
     */
    syncTables: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          createdTime: PropTypes.string,
          fields: PropTypes.object,
          /**
           * The RecordId on Airtable
           */
          id: PropTypes.string,
        })
      )
    ),
    /**
     * The Field that all tables have and linking together by a single value
     */
    syncField: PropTypes.string,
    /**
     * We use redux to store the selected record, the reducer array is must
     * in order and suitable with ***syncTables***
     */
    syncReducers: PropTypes.arrayOf(PropTypes.func),
  }),
  isHasSettings: PropTypes.bool,
  onRecordClick: PropTypes.func,
  recordPerPage: PropTypes.number,
  maxPageDisplay: PropTypes.number,
  tableStyle: PropTypes.object,
};

export default Table;
