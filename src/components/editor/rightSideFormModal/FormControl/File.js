import FileUploader from "../../../specific/FileUploader";
import PropTypes from "prop-types";

export default function FormGroupFile({
  tabIndex,
  table,
  name,
  label,
  value,
  readOnly,
  isRequired,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <FileUploader
        name={name}
        data-table={table}
        imgData={value}
        mediaType="image"
        type={type}
        handleUploadSuccessfully={handleStaffInput}
        handleClearImg={handleStaffInput}
      />
    </div>
  );
}

FormGroupFile.propTypes = {
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  formGroupData: PropTypes.objectOf({
    isRequired: PropTypes.bool,
    label: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.arrayOf(PropTypes.object),
    "data-type": PropTypes.string,
  }),
  type: PropTypes
};
