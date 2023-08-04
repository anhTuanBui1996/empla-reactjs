import React, { useState } from "react";
import { MdSearch, MdSend } from "react-icons/md";
import PropTypes from "prop-types";

function Search({
  className,
  noBorder,
  value,
  placeholder,
  onChange,
  onSubmit,
  style,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      if (onSubmit) {
        onSubmit();
        if (value !== "" || value === null || value === undefined) {
          setIsSearching(true);
        } else {
          setIsSearching(false);
        }
      } else {
        e.preventDefault();
        return false;
      }
    }
  };
  const onButtonSearchClicked = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
      if (value !== "" || value === null || value === undefined) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    } else {
      e.preventDefault();
      return false;
    }
  };
  return (
    <div
      className={`input-group input-group-rounded input-group-merge${
        className ? ` ${className}` : ""
      }`}
      style={style}
    >
      <input
        type="text"
        className={` search form-control form-control-rounded form-control-prepended form-control-appended${
          noBorder ? " border-0" : ""
        } ${isSearching ? " border-primary" : ""}`}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={onKeyPress}
        value={value}
        autoComplete="off"
      />
      <div className="input-group-prepend">
        <div
          className={`input-group-text pr-3 ${noBorder ? " border-0" : ""} ${
            isSearching ? " border-primary" : ""
          }`}
          style={{
            backgroundColor: isSearching ? "#2c7be5" : "",
          }}
        >
          <MdSearch size={20} color={`${isSearching ? "#fff" : ""}`} />
        </div>
      </div>
      <div className="input-group-append">
        <div
          className={`input-group-text pl-3 ${noBorder ? " border-0" : ""} ${
            isSearching ? " border-primary" : ""
          }`}
          style={{
            cursor: "pointer",
            backgroundColor: isSearching ? "#2c7be5" : "",
          }}
          onClick={onButtonSearchClicked}
        >
          <MdSend size={20} color={`${isSearching ? "#fff" : ""}`} />
        </div>
      </div>
    </div>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  dataType: PropTypes.oneOf([
    "singleLineText",
    "longText",
    "date",
    "dateTime",
    "checkbox",
  ]),
  noBorder: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  style: PropTypes.object,
};

export default Search;
