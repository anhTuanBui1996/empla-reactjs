import FileUploader from "../../../specific/FileUploader";
import PropTypes from "prop-types";

export default function File({ tabIndex, table, name, label, value }) {
  return (
    <div className="form-group">
      <label htmlFor={`File_${table}_${name}`}>{label}</label>
      <FileUploader
        id={`File_${table}_${name}`}
        tabIndex={tabIndex}
        name={name}
        imgData={value}
      />
    </div>
  );
}

File.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
};
