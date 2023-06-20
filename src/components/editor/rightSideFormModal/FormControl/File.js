import { useState } from "react";
import FileUploader from "../../../specific/FileUploader";
import PropTypes from "prop-types";

export default function File({
  tabIndex,
  table,
  name,
  label,
  value,
}) {
  
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <FileUploader
        id={`File_${table}_${name}`}
        tabIndex={tabIndex}
        name={name}
        imgData={value}
        // handleUploadSuccessfully={handleStaffInput}
        // handleClearImg={handleStaffInput}
      />
    </div>
  );
}

File.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.objectOf({
    label: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.arrayOf(PropTypes.object),
  }),
  type: PropTypes
};
