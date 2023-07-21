import { useDispatch, useSelector } from "react-redux";
import FileUploader from "../../../specific/FileUploader";
import PropTypes from "prop-types";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";

export default function FilePicker({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);

  const handleDropFiles = (files) => {
    dispatch(setFormSubmit({ ...formSubmit, [name]: files }));
  };

  return (
    <div className="form-group">
      <label htmlFor={`File_${table}_${name}`}>{label}</label>
      <FileUploader
        id={`File_${table}_${name}`}
        tabIndex={tabIndex}
        name={name}
        fileData={value}
        acceptedTypes={{
          "image/*": [".jpg", ".png", ".jpeg"],
          "application/pdf": [".pdf"],
        }}
        maxFiles={1}
        onFileChange={onValueChange}
        onDrop={handleDropFiles}
      />
    </div>
  );
}

FilePicker.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onValueChange: PropTypes.func,
};
