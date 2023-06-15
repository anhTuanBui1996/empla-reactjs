import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData, setFormData } from "../../../../features/editorSlice";

export default function FormGroupText({
  name,
  label,
  value,
  readOnly,
  isRequired,
}) {
  const dispatch = useDispatch();
  const editorFormData = useSelector(selectFormData);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const [labelRef, setLabelRef] = useState(null);

  const handleChange = (e) => setInputValue(e.target.value);
  const handleValidate = (e) => {
    dispatch(setFormData({ ...editorFormData, [name]: inputValue }));
    if (inputValue === "") {
      setError({hasError: true, errorMsg: ""})
    }
  };

  return (
    <div className="form-group">
      <label
        htmlFor={`Text_${name}`}
        ref={(labelElementRef) => setLabelRef(labelElementRef)}
      >
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <input
        id={`Text_${name}`}
        autoComplete="off"
        name={name}
        className="form-control"
        disabled={readOnly}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleValidate}
        placeholder={`Enter ${label}...`}
      />
      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

FormGroupText.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.string,
};
