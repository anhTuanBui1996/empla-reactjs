import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdLibraryAdd, MdRefresh, MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { selectInnerWidth } from "../../../features/windowSlice";
import Outclick from "../../../hoc/Outclick";
import Col from "../../layout/Col";
import Row from "../../layout/Row";
import { setSelectedRowData } from "../../../features/editorSlice";
import Search from "../Search";
import CellData from "./CellData";
import CellFilterRowControl from "./FilterRow/CellFilterRowControl";
import CellFilterRowComparator from "./FilterRow/CellFilterRowComparator";
import SortingActivationToggle from "./Sorting/SortingActivationToggle";
import FilterRowActivationToggle from "./FilterRow/FilterRowActivationToggle";
import SortingHeaderArrowToggle from "./Sorting/SortingHeaderArrowToggle";
import FilterExecutionButtonGroup from "./FilterRow/FilterExecutionButtonGroup";
import FilterGroupBox from "./FilterRow/FilterGroupBox";

function Table({
  classNamePrefix,
  tableId,
  metadata,
  fieldList,
  mappedRecords,
  originalRecords,
  hasSettings,
  hasSearching,
  hasSorting,
  hasFilterRow,
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

  // Base on responsive width to set footerNav center
  const [isPaginationCenter, setIsPaginationCenter] = useState(false);

  //#region Mapped record list / Display records in current page state
  const [tableMappedRecords, setTableMappedRecords] = useState(mappedRecords);
  const [recordTableInCurrentPage, setRecordTableInCurrentPage] =
    useState(tableMappedRecords);
  //#endregion

  //#region Searching and pagigation state
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
  //#endregion

  //#region Filter row state
  const [isFilterRowTurnOn, setFilterRowTurnOn] = useState(false);
  const [filterArr, setFilterArr] = useState(
    fieldList.map((fieldItem) => {
      let dataType = metadata?.fields.find((f) => f.name === fieldItem)?.type;
      let filterValue = "";
      let canBeFiltered = true;
      switch (dataType) {
        case "singleLineText":
        case "multilineText":
        case "email":
        case "longText":
        case "formula":
          filterValue = "";
          break;
        case "multipleSelects":
          filterValue = [];
          break;
        case "singleSelect":
        case "multipleLookupValues":
          filterValue = "";
          break;
        case "date":
        case "dateTime":
        case "createdTime":
        case "lastModifiedTime":
          break;
        case "checkbox":
          filterValue = false;
          break;
        default:
          filterValue = null;
          canBeFiltered = false;
          break;
      }
      return [
        {
          fieldName: fieldItem,
          expressionComparator: "=",
          dataType,
          filterValue,
          canBeFiltered,
        },
      ];
    })
  );
  const [filterGroup, setFilterGroup] = useState([
    {
      isChildrenGroup: true,
      indexList: fieldList.map((fieldName, i) => ({
        columnIndex: i,
        rowIndex: 0,
        logicalExpression: "AND",
      })),
      logicalExpression: "AND", // logicalExpression with next group
    },
  ]);
  //#endregion

  //#region Selected row state
  const [selectedRowId, setSelectedRowId] = useState([]);
  //#endregion

  //#region Sorting state
  const [isSortingTurnOn, setSortingTurnOn] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [selectingSorting, setSelectingSorting] = useState(null);
  //#endregion

  //#region Table settings state
  const [showSettings, setShowSettings] = useState(false);
  //#endregion

  //#region Handlers for data
  const handleRefreshData = (e) => {
    e.stopPropagation();
    if (onRefreshDataBtnClick) {
      onRefreshDataBtnClick();
      if (onUndoInitialSelectedRow) {
        onUndoInitialSelectedRow();
      }
    }
  };
  const handleEditRecord = (e, recordSelectedForEdit) => {
    e.preventDefault();
    if (originalRecords && onRecordClick) {
      const recordId = recordSelectedForEdit.rowId;
      const recordSelected = originalRecords.find(
        (record) => record.id === recordId
      );
      dispatch(setSelectedRowData(recordSelected));
      setSelectedRowId(() => [recordId]);
      onRecordClick(recordSelectedForEdit);
    }
  };
  //#endregion

  //#region Handlers for searching
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
  //#endregion

  //#region Handlers for sorting
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
  const handleToggleSortingActivation = () => {
    if (isSortingTurnOn) {
      setSelectingSorting(null);
    }
    setSortingTurnOn(!isSortingTurnOn);
  };
  const handleChangeSelectSortingFieldInSettingsBox = (e) => {
    setSelectingSorting(e);
    document
      .querySelectorAll(`#${tableId} thead th`)
      [e.value].scrollIntoView({ behavior: "smooth" });
  };
  //#endregion

  //#region Handlers for reference box
  const handleSelectAllRowClicked = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      onSelectAllRow();
    } else {
      onUnselectAllRow();
    }
  };
  //#endregion

  //#region Handlers for filter row
  const handleToggleFilterRowActivation = () => {
    setFilterRowTurnOn(!isFilterRowTurnOn);
    if (isFilterRowTurnOn) {
      setSearchValue("");
    }
  };
  const handleChangeFilterRowCellValue = (newValue, columnIndex, rowIndex) => {
    const nextFilterArr = filterArr.map((fieldFilterColumn, i) => {
      if (i === columnIndex) {
        return fieldFilterColumn.map((filterCell, j) => {
          if (j === rowIndex) {
            return {
              ...filterCell,
              filterValue: newValue,
            };
          } else {
            return filterCell;
          }
        });
      } else {
        return fieldFilterColumn;
      }
    });
    setFilterArr(nextFilterArr);
  };
  const handleChangeFilterRowCellExpressionComparator = (
    newComparator,
    columnIndex,
    rowIndex
  ) => {
    const nextFilterArr = filterArr.map((fieldFilterColumn, i) => {
      if (i === columnIndex) {
        return fieldFilterColumn.map((filterCell, j) => {
          if (j === rowIndex) {
            return {
              ...filterCell,
              expressionComparator: newComparator,
            };
          } else {
            return { ...filterCell };
          }
        });
      } else {
        return fieldFilterColumn;
      }
    });
    setFilterArr(nextFilterArr);
  };
  const handleChangeFilterRowCellLogicalOperator = (
    newOperator,
    columnIndex,
    rowIndex
  ) => {
    const nextFilterArr = filterArr.map((fieldFilterColumn, i) => {
      if (i === columnIndex) {
        return fieldFilterColumn.map((filterCell, j) => {
          if (j === rowIndex) {
            return {
              ...filterCell,
              expressionComparator: newOperator,
            };
          } else {
            return { ...filterCell };
          }
        });
      } else {
        return fieldFilterColumn;
      }
    });
    setFilterArr(nextFilterArr);
  };
  const handleChangeFilterRowGroupLogicalOperator = (
    newOperator,
    groupIndex
  ) => {
    setFilterGroup([
      ...filterGroup.slice(0, groupIndex),
      { ...filterGroup[groupIndex], logicalExpression: newOperator },
      ...filterGroup.slice(groupIndex + 1),
    ]);
  };
  const handleChangeGroupIndexOfFilterRowCell = () => {};
  const handleChangeFilterGroupBoxFilterCellFieldName = (
    newFieldName,
    oldColumnIndex,
    oldRowIndex
  ) => {
    const oldFilterCell = filterArr[oldColumnIndex][oldRowIndex];
    handleRemoveFilterCellForFieldFilterColumn(oldColumnIndex, oldRowIndex);
    console.log(
      newFieldName.filterArr,
      filterArr.find((f) => f.fieldName === newFieldName)
    );
    // handleAddFilterCellForFieldFilterColumn(
    //   fieldList.indexOf(newFieldName),
    //   0,
    //   filterArr.find((f) => f.fieldName === newFieldName).dataType
    // );
  };
  const handleAddFilterCellForFieldFilterColumn = (
    columnIndex,
    rowIndex,
    dataType
  ) => {
    let fieldName = fieldList[columnIndex];
    let filterValue = "";
    switch (dataType) {
      case "singleLineText":
      case "multilineText":
      case "email":
      case "longText":
      case "formula":
        filterValue = "";
        break;
      case "multipleSelects":
        filterValue = [];
        break;
      case "singleSelect":
      case "multipleAttachments":
      case "multipleLookupValues":
      case "multipleRecordLinks":
        filterValue = undefined;
        break;
      case "date":
      case "dateTime":
      case "createdTime":
      case "lastModifiedTime":
        break;
      case "checkbox":
        filterValue = false;
        break;
      default:
        console.error("Error while render filter row data", dataType);
        filterValue = undefined;
        break;
    }
    const nextFieldColumn = [
      ...filterArr[columnIndex].slice(0, rowIndex),
      {
        fieldName,
        expressionComparator: "=",
        dataType,
        filterValue,
      },
      ...filterArr[columnIndex].slice(rowIndex),
    ];
    const nextFilterArr = [
      ...filterArr.slice(0, columnIndex),
      [...nextFieldColumn],
      ...filterArr.slice(columnIndex + 1),
    ];
    setFilterArr(nextFilterArr);
  };
  const handleRemoveFilterCellForFieldFilterColumn = (
    columnIndex,
    rowIndex
  ) => {
    const nextFilterArr = [
      ...filterArr.slice(0, columnIndex),
      [...filterArr[columnIndex].filter((c, j) => j !== rowIndex)],
      ...filterArr.slice(columnIndex + 1),
    ];
    setFilterArr(nextFilterArr);
  };
  const handleFilterRowExecute = () => {};
  //#endregion

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
              if (firstCellData === null || firstCellData === undefined) {
                return 1;
              } else if (
                secondCellData === null ||
                secondCellData === undefined
              ) {
                return -1;
              } else if (firstCellData.length - secondCellData.length > 0) {
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
              if (firstCellData === null || firstCellData === undefined) {
                return 1;
              } else if (secondCellData.length - firstCellData.length > 0) {
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

  // Sorting turn on/off
  useEffect(() => {
    if (!isSortingTurnOn) {
      setSorting([]);
    }
  }, [isSortingTurnOn]);

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
    if (footerNavRef.current?.clientHeight > 43) {
      setIsPaginationCenter(true);
    } else if (footerNavRef.current?.clientHeight > 0) {
      setIsPaginationCenter(false);
    }
  }, [innerWidth]);

  return (
    <>
      <div
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }card-header justify-content-between align-items-center flex-nowrap py-1`}
        style={{
          gap: "5px",
          paddingRight: "5px",
          height: "auto",
          paddingLeft: isReferenceBox ? 0 : undefined,
        }}
      >
        <div
          className={`${classNamePrefix ? `${classNamePrefix} ` : ""}d-flex`}
          style={{ flexGrow: 0 }}
        >
          {onCreateNewBtnClick && (
            <button
              className={`${
                classNamePrefix ? `${classNamePrefix} ` : ""
              }btn btn-success d-flex px-1 py-1 mr-2`}
              style={{ width: "30px", height: "28px" }}
              onClick={onCreateNewBtnClick}
            >
              <MdLibraryAdd size={20} style={{ margin: "auto" }} />
            </button>
          )}
          {onRefreshDataBtnClick && (
            <button
              className={`${
                classNamePrefix ? `${classNamePrefix} ` : ""
              }btn btn-primary d-flex px-1 py-1 mr-2`}
              style={{ width: "30px", height: "28px" }}
              onClick={handleRefreshData}
            >
              <MdRefresh size={20} className={classNamePrefix} />
            </button>
          )}
        </div>
        {hasSearching && !isFilterRowTurnOn && (
          <Search
            containerClassName="animate__animated animate__fadeIn animate__faster"
            classNamePrefix={classNamePrefix}
            id={`table-search-${tableId}`}
            placeholder="Search..."
            value={searchValue}
            onChange={handleChangeSearchValue}
            onSubmit={handleSearchSubmit}
            onClear={handleClearSearchResult}
          />
        )}
        {isFilterRowTurnOn && (
          <FilterGroupBox
            tableMetadata={metadata}
            isFilterRowTurnOn={isFilterRowTurnOn}
            fieldList={fieldList}
            containerClassName="animate__animated animate__fadeIn animate__faster"
            classNamePrefix={classNamePrefix}
            filterGroup={filterGroup}
            filterArr={filterArr}
            onChangeFilterRowFieldName={
              handleChangeFilterGroupBoxFilterCellFieldName
            }
            onChangeFilterRowExpressionComparator={
              handleChangeFilterRowCellExpressionComparator
            }
            onChangeFilterRowCellValue={handleChangeFilterRowCellValue}
            onChangeFilterGroupLogicalExpression={
              handleChangeFilterRowGroupLogicalOperator
            }
            onChangeFilterGroupIndex={handleChangeGroupIndexOfFilterRowCell}
            onFilterRowExecute={handleFilterRowExecute}
          />
        )}
        {hasSettings && (
          <Col
            columnSize={["auto"]}
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }d-flex align-items-center`}
            style={{
              height: "52px",
              paddingRight: isReferenceBox ? 0 : undefined,
            }}
          >
            <div
              className={`${
                classNamePrefix ? `${classNamePrefix} ` : ""
              }dropdown`}
            >
              <button
                className={`${
                  classNamePrefix ? `${classNamePrefix} ` : ""
                }btn btn-link rounded px-0 py-0`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(true);
                }}
              >
                <MdSettings
                  size={20}
                  className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                />
              </button>
              <Outclick onOutClick={() => setShowSettings(false)}>
                <div
                  className={`${
                    classNamePrefix ? `${classNamePrefix} ` : ""
                  }shadow dropdown-menu px-3 dropdown-menu-right${
                    showSettings ? " d-block" : ""
                  }`}
                  style={{ width: "380px" }}
                >
                  <Row
                    className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                  >
                    <Col
                      className={`${
                        classNamePrefix ? `${classNamePrefix}` : ""
                      }`}
                      columnSize={["12"]}
                    >
                      <div
                        className={`${
                          classNamePrefix ? `${classNamePrefix} ` : ""
                        }form-group d-flex flex-nowrap justify-content-between align-items-center mb-0`}
                      >
                        <label
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }mb-0`}
                          htmlFor={`max-record-per-page_${tableId}`}
                        >
                          Records/page
                        </label>
                        <input
                          id={`max-record-per-page_${tableId}`}
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }form-control`}
                          type="number"
                          value={recordsPerPage}
                          style={{ marginLeft: "160px", textAlign: "end" }}
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
                  <Row
                    className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                  >
                    <Col
                      columnSize={["12"]}
                      className={`${
                        classNamePrefix ? `${classNamePrefix}` : ""
                      }`}
                    >
                      <div
                        className={`${
                          classNamePrefix ? `${classNamePrefix} ` : ""
                        }form-group d-flex flex-nowrap justify-content-between align-items-center mb-0`}
                      >
                        <label
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }mb-0`}
                          htmlFor={`go-to-page_${tableId}`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Go to page
                        </label>
                        <input
                          id={`go-to-page_${tableId}`}
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }form-control`}
                          type="number"
                          placeholder={activePageIndex}
                          style={{ marginLeft: "200px", textAlign: "end" }}
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
                    <SortingActivationToggle
                      classNamePrefix={classNamePrefix}
                      fieldList={fieldList}
                      isSortingTurnOn={isSortingTurnOn}
                      onToggle={handleToggleSortingActivation}
                      selectingSorting={selectingSorting}
                      onChangeSelectingSorting={
                        handleChangeSelectSortingFieldInSettingsBox
                      }
                      sortingArr={sorting}
                      tableId={tableId}
                    />
                  )}
                  {hasFilterRow && (
                    <FilterRowActivationToggle
                      classNamePrefix={classNamePrefix}
                      tableId={tableId}
                      onToggle={handleToggleFilterRowActivation}
                      isFilterRowTurnOn={isFilterRowTurnOn}
                    />
                  )}
                </div>
              </Outclick>
            </div>
          </Col>
        )}
      </div>
      <div
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }table-responsive mb-0 border-bottom position-relative`}
        ref={tableRef}
        style={tableStyle}
      >
        {recordTableInCurrentPage.length ? (
          <table
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }table table-sm table-nowrap table-bordered card-table`}
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
            <thead className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}>
              <tr className={`${classNamePrefix ? `${classNamePrefix} ` : ""}`}>
                {isReferenceBox && (
                  <th
                    className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                    style={{
                      position: "sticky",
                      top: 0,
                      left: 0,
                      display: "flex",
                      flexWrap: "nowrap",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: "1.5rem",
                      height: "48px",
                      zIndex: 1,
                      lineHeight: 1,
                    }}
                  >
                    <div
                      className={`${
                        classNamePrefix ? `${classNamePrefix} ` : ""
                      }row-select-checkbox`}
                      style={{ lineHeight: 1 }}
                    >
                      <input
                        className={`row-select-inp-cbx${
                          classNamePrefix ? ` ${classNamePrefix}` : ""
                        }`}
                        type="checkbox"
                        id={`table-reference-select-all-row_${tableId}`}
                        onChange={handleSelectAllRowClicked}
                      />
                      <label
                        className={`cbx${
                          classNamePrefix ? ` ${classNamePrefix}` : ""
                        }`}
                        htmlFor={`table-reference-select-all-row_${tableId}`}
                      >
                        <span
                          className={`${
                            classNamePrefix ? `${classNamePrefix}` : ""
                          }`}
                        >
                          <svg
                            width="12px"
                            height="10px"
                            className={`${
                              classNamePrefix ? `${classNamePrefix}` : ""
                            }`}
                          >
                            <use
                              className={`${
                                classNamePrefix ? `${classNamePrefix}` : ""
                              }`}
                              xlinkHref="#check-4"
                            ></use>
                          </svg>
                        </span>
                      </label>
                      <svg
                        className={`inline-svg${
                          classNamePrefix ? ` ${classNamePrefix}` : ""
                        }`}
                      >
                        <symbol
                          id="check-4"
                          viewBox="0 0 12 10"
                          className={`${
                            classNamePrefix ? `${classNamePrefix}` : ""
                          }`}
                        >
                          <polyline
                            points="1.5 6 4.5 9 10.5 1"
                            className={`${
                              classNamePrefix ? `${classNamePrefix}` : ""
                            }`}
                          ></polyline>
                        </symbol>
                      </svg>
                    </div>
                  </th>
                )}
                {fieldList.map((fieldItem, i) => (
                  <th
                    key={i}
                    className={`${
                      classNamePrefix ? `${classNamePrefix} ` : ""
                    }position-relative`}
                  >
                    <span
                      className={`${
                        classNamePrefix ? `${classNamePrefix} ` : ""
                      }text-muted mr-5`}
                    >
                      {fieldItem}
                    </span>
                    {hasSorting && (
                      <SortingHeaderArrowToggle
                        classNamePrefix={classNamePrefix}
                        fieldColumnIndex={i}
                        sortingArr={sorting}
                        onSortingRecords={handleSortingRecords}
                        isSortingTurnOn={isSortingTurnOn}
                      />
                    )}
                    {sorting.findIndex((s) => s.index === i) > -1 && (
                      <span
                        className={`${
                          classNamePrefix ? `${classNamePrefix}` : ""
                        }`}
                        style={{ position: "absolute", right: 15 }}
                      >
                        {sorting.findIndex((s) => s.index === i) + 1}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
              <tr className={`${classNamePrefix ? `${classNamePrefix} ` : ""}`}>
                {isReferenceBox && (
                  <th
                    className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                    style={{
                      position: "sticky",
                      top: 0,
                      left: 0,
                      display: "flex",
                      flexWrap: "nowrap",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: "1.5rem",
                      zIndex: 1,
                      lineHeight: 1,
                      paddingTop: isFilterRowTurnOn
                        ? "calc(1rem + 20.25px)"
                        : "0px",
                      paddingBottom: isFilterRowTurnOn
                        ? "calc(1rem + 20.25px)"
                        : "0px",
                      transition: "padding .3s ease-out",
                    }}
                  ></th>
                )}
                {filterArr.map((fieldFilterColumn, i) => {
                  return (
                    <th
                      key={i}
                      className={`${
                        classNamePrefix ? `${classNamePrefix} ` : ""
                      }position-relative`}
                      style={{
                        paddingTop: isFilterRowTurnOn ? "" : "0px",
                        paddingBottom: isFilterRowTurnOn ? "" : "0px",
                        transition: "padding .3s ease-out",
                      }}
                    >
                      {fieldFilterColumn.map((filterCell, j) => {
                        return (
                          <div
                            key={j}
                            className={`${
                              classNamePrefix ? `${classNamePrefix} ` : ""
                            }d-flex flex-nowrap justify-content-between align-items-center`}
                            style={{
                              gap: "5px",
                              marginTop: j > 0 ? "5px" : "",
                            }}
                          >
                            {filterCell.canBeFiltered && (
                              <>
                                {filterCell.dataType !== "checkbox" && (
                                  <CellFilterRowComparator
                                    classNamePrefix={classNamePrefix}
                                    filterCell={filterCell}
                                    onChange={
                                      handleChangeFilterRowCellExpressionComparator
                                    }
                                    columnIndex={i}
                                    rowIndex={j}
                                    isFilterRowTurnOn={isFilterRowTurnOn}
                                  />
                                )}
                                <CellFilterRowControl
                                  isFilterRow={true}
                                  tableMetadata={metadata}
                                  isFilterRowTurnOn={isFilterRowTurnOn}
                                  classNamePrefix={classNamePrefix}
                                  fieldFilterCell={filterCell}
                                  handleCellValueChange={
                                    handleChangeFilterRowCellValue
                                  }
                                  columnIndex={i}
                                  rowIndex={j}
                                  key={i}
                                />
                                <FilterExecutionButtonGroup
                                  classNamePrefix={classNamePrefix}
                                  columnIndex={i}
                                  rowIndex={j}
                                  filterRowCell={filterCell}
                                  onAddFilterRowCell={
                                    handleAddFilterCellForFieldFilterColumn
                                  }
                                  onRemoveFilterRowCell={
                                    handleRemoveFilterCellForFieldFilterColumn
                                  }
                                  isFilterRowTurnOn={isFilterRowTurnOn}
                                />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody
              className={`${classNamePrefix ? `${classNamePrefix} ` : ""}list`}
            >
              {recordTableInCurrentPage.map((recordData, rowIndex) => (
                <RowHover
                  className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
                  key={recordData.rowId}
                  onClick={(e) => handleEditRecord(e, recordData)}
                  style={{
                    backgroundColor: selectedRowId.includes(recordData.rowId)
                      ? "#b7d6ff"
                      : "",
                  }}
                >
                  {isReferenceBox && (
                    <td
                      className={`${
                        classNamePrefix ? `${classNamePrefix}` : ""
                      }`}
                      style={{
                        position: "fixed",
                        top: "auto",
                        left: "24px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingRight: "1.5rem",
                        height: "74px",
                        backgroundColor: "white",
                        zIndex: 1,
                        lineHeight: 1,
                      }}
                    >
                      <div
                        className={`${
                          classNamePrefix ? `${classNamePrefix} ` : ""
                        }row-select-checkbox`}
                      >
                        <input
                          className={`row-select-inp-cbx${
                            classNamePrefix ? ` ${classNamePrefix}` : ""
                          }`}
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
                        <label
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }cbx`}
                          htmlFor={`table-reference-select-row_${tableId}_${rowIndex}`}
                        >
                          <span
                            className={`${
                              classNamePrefix ? `${classNamePrefix}` : ""
                            }`}
                          >
                            <svg
                              width="12px"
                              height="10px"
                              className={`${
                                classNamePrefix ? `${classNamePrefix}` : ""
                              }`}
                            >
                              <use
                                xlinkHref="#check-4"
                                className={`${
                                  classNamePrefix ? `${classNamePrefix}` : ""
                                }`}
                              ></use>
                            </svg>
                          </span>
                        </label>
                        <svg
                          className={`${
                            classNamePrefix ? `${classNamePrefix} ` : ""
                          }inline-svg`}
                        >
                          <symbol
                            id="check-4"
                            viewBox="0 0 12 10"
                            className={`${
                              classNamePrefix ? `${classNamePrefix}` : ""
                            }`}
                          >
                            <polyline
                              points="1.5 6 4.5 9 10.5 1"
                              className={`${
                                classNamePrefix ? `${classNamePrefix}` : ""
                              }`}
                            ></polyline>
                          </symbol>
                        </svg>
                      </div>
                    </td>
                  )}
                  {recordData.data.map((value, cellRowIndex) => (
                    <td
                      className={`${
                        classNamePrefix ? `${classNamePrefix}` : ""
                      }`}
                      style={{
                        minWidth: 160,
                      }}
                      key={cellRowIndex}
                    >
                      {
                        <CellData
                          cell={value}
                          metadata={metadata.fields.find(
                            (f) => f.name === fieldList[cellRowIndex]
                          )}
                          classNamePrefix={classNamePrefix}
                          rowIndex={rowIndex}
                          columnIndex={cellRowIndex}
                          rowCount={recordTableInCurrentPage.length}
                          columnCount={fieldList.lengt}
                        />
                      }
                    </td>
                  ))}
                </RowHover>
              ))}
            </tbody>
          </table>
        ) : (
          <span
            className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}
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
        className={`${
          classNamePrefix ? `${classNamePrefix} ` : ""
        }d-flex align-items-center flex-wrap px-3 py-1 justify-content-${
          isPaginationCenter ? "center" : "between"
        }`}
        style={{ gap: "5px", marginTop: "5px" }}
        ref={footerNavRef}
      >
        <span
          className={`${
            classNamePrefix ? `${classNamePrefix} ` : ""
          }badge badge-success${innerWidth < 330 ? " my-3" : ""}`}
          style={{ lineHeight: "1.5" }}
        >
          {`${tableMappedRecords.length} ${
            tableMappedRecords.length > 1 ? "records" : "record"
          } in total`}
        </span>
        {currentReferenceBoxValue?.length > 0 && (
          <div className={`${classNamePrefix ? `${classNamePrefix}` : ""}`}>
            <span
              className={`${
                classNamePrefix ? `${classNamePrefix} ` : ""
              }badge badge-primary`}
              style={{ lineHeight: "1.5" }}
            >
              {`${currentReferenceBoxValue.length} ${
                currentReferenceBoxValue.length > 1 ? "records" : "record"
              } selected`}
            </span>
          </div>
        )}
        {tableMappedRecords.length > 0 && (
          <ul
            className={`${
              classNamePrefix ? `${classNamePrefix} ` : ""
            }pagination d-flex align-items-center mb-0`}
          >
            <li
              className={`${
                classNamePrefix ? `${classNamePrefix} ` : ""
              }rounded page-item`}
              onClick={() => {
                activePageIndex > 1 && setActivePageIndex(activePageIndex - 1);
              }}
              style={{ cursor: "pointer" }}
            >
              <button
                className={`${
                  classNamePrefix ? `${classNamePrefix} ` : ""
                }btn btn-light rounded page-link border-1 mr-1`}
              >
                {"<"}
              </button>
            </li>
            {isPageListExceed.pageStart && (
              <li
                className={`${
                  classNamePrefix ? `${classNamePrefix} ` : ""
                }page-item start-exceed d-flex align-items-center`}
              >
                ...
              </li>
            )}
            {pageList.map((indexPagination) => (
              <li
                key={indexPagination}
                className={`${
                  classNamePrefix ? `${classNamePrefix} ` : ""
                }page-item${
                  indexPagination === activePageIndex ? " active" : ""
                }`}
                onClick={() => setActivePageIndex(indexPagination)}
                style={{ cursor: "pointer" }}
              >
                <button
                  className={`${
                    classNamePrefix ? `${classNamePrefix} ` : ""
                  }rounded page-link border-0`}
                >
                  {indexPagination}
                </button>
              </li>
            ))}
            {isPageListExceed.pageEnd && (
              <li
                className={`${
                  classNamePrefix ? `${classNamePrefix} ` : ""
                }page-item end-exceed d-flex align-items-center`}
              >
                ...
              </li>
            )}
            <li
              className={`${
                classNamePrefix ? `${classNamePrefix} ` : ""
              }rounded page-item`}
              onClick={() => {
                activePageIndex < pageAmount &&
                  setActivePageIndex(activePageIndex + 1);
              }}
              style={{ cursor: "pointer" }}
            >
              <button
                className={`${
                  classNamePrefix ? `${classNamePrefix} ` : ""
                }btn btn-light rounded page-link border-1`}
              >
                {">"}
              </button>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
}

// ====================================================================
const RowHover = styled.tr`
  position: relative;
  cursor: pointer;
  :hover {
    background-color: #f0f8ff;
  }
`;

Table.defaultProps = {
  recordPerPage: 5,
  maxPageDisplay: 4,
};
Table.propTypes = {
  classNamePrefix: PropTypes.string,
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
  hasFilterRow: PropTypes.bool,
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
