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
        id={`File_${table}_${name}`}
        tabIndex={tabIndex}
        name={name}
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
