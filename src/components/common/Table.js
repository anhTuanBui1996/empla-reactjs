import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { selectInnerWidth } from "../../features/windowSlice";
import Outclick from "../../hoc/Outclick";
import Col from "../layout/Col";
import Row from "../layout/Row";
import Dropdown from "./Dropdown";
import { setSelectedRowData } from "../../features/editorSlice";

function Table({
  fieldList,
  tableMappedRecords,
  originalRecords,
  isHasSettings,
  onRecordClick,
  recordPerPage,
  maxPageDisplay,
  tableStyle,
}) {
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const innerWidth = useSelector(selectInnerWidth);

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
  const [recordTableList, setRecordTableList] = useState(tableMappedRecords);

  const [showSettings, setShowSettings] = useState(false);
  const [isPaginationCenter, setIsPaginationCenter] = useState(false);

  const handleEditRecord = (e, recordSelectedForEdit) => {
    e.preventDefault();
    if (originalRecords && onRecordClick) {
      const recordId = recordSelectedForEdit.rowId;
      const recordSelected = originalRecords.find(
        (record) => record.id === recordId
      );
      dispatch(setSelectedRowData(recordSelected));
      setTimeout(onRecordClick, 50);
    }
  };

  // Effects when trigger page index, page record feature
  useEffect(() => {
    let currentRecordsOfPage = [];
    tableMappedRecords.forEach((recordData, recordIndex) => {
      const recordIndexMin = recordsPerPage * (activePageIndex - 1);
      const recordIndexMax = recordsPerPage * activePageIndex - 1;
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
  }, [tableMappedRecords, recordsPerPage, activePageIndex]);
  // Get cardWidth when windowWidth change and set pagination alignment
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
            {" "}
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
                <th style={{ minWidth: 160 }} key={i}>
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
                  <td style={{ minWidth: 160 }} key={cellRowIndex}>
                    {injectDataToJSX(value)}
                  </td>
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
          {tableMappedRecords.length}{" "}
          {tableMappedRecords.length > 1 ? "records" : "record"} in total
        </span>
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
      displayData = new Date(cellData).toLocaleDateString();
      break;
    case "dateTime":
      displayData = new Date(cellData).toLocaleString();
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
  tableName: PropTypes.string,
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
  tableMappedRecords: PropTypes.arrayOf(PropTypes.any).isRequired,
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
  isHasSettings: PropTypes.bool,
  onRecordClick: PropTypes.func,
  recordPerPage: PropTypes.number,
  maxPageDisplay: PropTypes.number,
  tableStyle: PropTypes.object,
};

export default Table;
