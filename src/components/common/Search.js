import React from "react";
import { MdSearch } from "react-icons/md";
import PropTypes from "prop-types";

function Search({ noBorder, value, placeholder, onChange }) {
  return (
    <div className="input-group input-group-rounded input-group-merge">
      <input
        type="text"
        className={`form-control form-control-rounded form-control-prepended${
          noBorder ? ` border-0` : ""
        }`}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      <div className="input-group-prepend">
        <div className={`input-group-text${noBorder ? ` border-0` : ""}`}>
          <MdSearch size={20} />
        </div>
      </div>
    </div>
  );
}

Search.propTypes = {
  noBorder: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Search;
