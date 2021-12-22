import React from "react";
import { MdSearch } from "react-icons/md";

function Search({ noBorder, ...props }) {
  return (
    <div className="input-group input-group-rounded input-group-merge">
      <input
        type="text"
        className={`form-control form-control-rounded form-control-prepended${
          noBorder ? ` border-0` : ""
        }`}
        placeholder="Search"
        {...props}
      />
      <div className="input-group-prepend">
        <div className={`input-group-text${noBorder ? ` border-0` : ""}`}>
          <MdSearch size={20} />
        </div>
      </div>
    </div>
  );
}

export default Search;
