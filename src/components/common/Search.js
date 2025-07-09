import React, { useState } from "react";
import { MdClose, MdSearch, MdSend } from "react-icons/md";
import PropTypes from "prop-types";
import styled from "styled-components";

function Search({
  id,
  classNamePrefix,
  containerClassName,
  noBorder,
  value,
  placeholder,
  onChange,
  onClear,
  onSubmit,
  style,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
        if (value !== "") {
          setIsSearching(true);
        } else {
          setIsSearching(false);
        }
      } else {
        return false;
      }
    }
  };
  const onButtonSearchClicked = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
      if (value !== "") {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    } else {
      return false;
    }
  };
  const onClearButtonClicked = (e) => {
    e.preventDefault();
    if (onClear) {
      onClear();
      setIsSearching(false);
    }
  };
  return (
    <div
      className={`input-group input-group-rounded input-group-merge${
        classNamePrefix ? ` ${classNamePrefix}` : ""
      }${containerClassName ? ` ${containerClassName}` : ""}`}
      style={style}
    >
      <input
        id={id}
        type="text"
        className={`search-menu form-control form-control-rounded form-control-prepended form-control-appended${
          noBorder ? " border-0" : ""
        } ${isSearching ? " border-primary" : ""} pr-4${
          classNamePrefix ? ` ${classNamePrefix}` : ""
        }`}
        placeholder={placeholder}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={onButtonSearchClicked}
        value={value}
        autoComplete="off"
      />
      <div className={`input-group-prepend${classNamePrefix ? ` ${classNamePrefix}` : ""}`}>
        <div
          className={`input-group-text pr-3 ${noBorder ? " border-0" : ""} ${
            isSearching ? " border-primary" : ""
          }${classNamePrefix ? ` ${classNamePrefix}` : ""}`}
          style={{
            backgroundColor: isSearching ? "#2c7be5" : "",
          }}
        >
          <MdSearch
            size={20}
            color={`${isSearching ? "#fff" : ""}`}
            className={classNamePrefix}
          />
        </div>
      </div>
      {value !== "" && (
        <ClearButton onClick={onClearButtonClicked} className={classNamePrefix}>
          <MdClose size={20} className={classNamePrefix} />
        </ClearButton>
      )}
      <div className={`input-group-append${classNamePrefix ? ` ${classNamePrefix}` : ""}`}>
        <div
          className={`btn btn-light input-group-text pl-3${
            noBorder ? " border-0" : ""
          }${isSearching ? " border-primary" : ""}${
            classNamePrefix ? ` ${classNamePrefix}` : ""
          }`}
          style={{
            cursor: "pointer",
            backgroundColor: isSearching ? "#2c7be5" : "",
          }}
          onClick={onButtonSearchClicked}
        >
          <MdSend
            size={20}
            color={`${isSearching ? "#fff" : ""}`}
            className={classNamePrefix}
          />
        </div>
      </div>
    </div>
  );
}

Search.propTypes = {
  id: PropTypes.string,
  classNamePrefix: PropTypes.string,
  containerClassName: PropTypes.string,
  dataType: PropTypes.oneOf([
    "singleLineText",
    "longText",
    "date",
    "dateTime",
    "checkbox",
  ]),
  noBorder: PropTypes.bool,
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func,
  style: PropTypes.object,
};

const ClearButton = styled.button`
  line-height: 1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 50px;
  padding: 0 !important;
  color: #ff1919e7 !important;
  border-radius: 4px;
  border: none;
  background: none;
  z-index: 4;
  :hover {
    background-color: #ff1919e7 !important;
    color: #fff !important;
  }
`;

export default Search;
