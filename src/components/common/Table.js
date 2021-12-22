import PropTypes from "prop-types";
import React, { useState } from "react";
import Search from "./Search";

function Table({
  fieldList,
  recordList,
  itemAmountPerPage,
  isSearchable,
  isSortable,
}) {
  const rowsRemain = recordList.length % itemAmountPerPage;
  const pageAmount =
    rowsRemain !== 0
      ? parseInt(recordList.length / itemAmountPerPage) + 1
      : recordList.length / itemAmountPerPage;
  const [activeIndex, setActiveIndex] = useState(0);
  const itemList = [];
  for (let i = 0; i < pageAmount; i++) {
    itemList.push(
      recordList.slice(0 + i * itemAmountPerPage, (i + 1) * itemAmountPerPage)
    );
  }
  return (
    <>
      <div className="table-responsive mb-0">
        {isSearchable && (
          <div className="px-2">
            <Search noBorder />
          </div>
        )}
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
            {itemList[activeIndex]?.map((recordData) => (
              <tr key={recordData.rowId}>
                {recordData.data.map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="d-flex justify-content-between align-items-center px-3">
        <span className="badge badge-success ml-3">
          {recordList.length} staffs in total
        </span>
        <ul className="pagination mb-0">
          <li
            className="page-item"
            onClick={() => {
              activeIndex > 0 && setActiveIndex(activeIndex - 1);
            }}
            style={{ cursor: "pointer" }}
          >
            <a className="rounded page-link border-0">Previous</a>
          </li>
          {itemList?.map((itemPagination, indexPagination) => (
            <li
              key={itemPagination}
              className={`page-item${
                indexPagination === activeIndex ? " active" : ""
              }`}
              onClick={() => setActiveIndex(indexPagination)}
              style={{ cursor: "pointer" }}
            >
              <a className="rounded page-link border-0">
                {indexPagination + 1}
              </a>
            </li>
          ))}
          <li
            className="rounded page-item"
            onClick={() => {
              activeIndex < pageAmount - 1 && setActiveIndex(activeIndex + 1);
            }}
            style={{ cursor: "pointer" }}
          >
            <a className="rounded page-link border-0">Next</a>
          </li>
        </ul>
      </nav>
    </>
  );
}

Table.propTypes = {
  fieldList: PropTypes.arrayOf(PropTypes.string).isRequired,
  recordList: PropTypes.arrayOf(PropTypes.any),
  itemAmountPerPage: PropTypes.number,
  isSearchable: PropTypes.bool,
  isSortable: PropTypes.bool,
};

export default Table;
