import FileUploader from "../../../specific/FileUploader";
import PropTypes from "prop-types";

export default function FormGroupFile({
  table,
  name,
  label,
  formGroupData,
  type,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <FileUploader
        name={name}
        data-table={table}
        data-type={formGroupData[name]["data-type"]}
        imgData={formGroupData[name].value}
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
