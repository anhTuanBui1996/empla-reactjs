import PropTypes from "prop-types";
import { useState } from "react";

export default function FormGroupTextArea({
  name,
  label,
  value,
  formControlRef,
  readOnly,
  isRequired,
}) {
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const handleChange = (e) => {};
  const handleValidate = (e) => {};
  return (
    <div className="form-group">
      <label htmlFor={`TextArea_${name}`}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={`TextArea_${name}`}
        autoComplete="off"
        name={name}
        className="form-control"
        disabled={readOnly}
        value={value}
        onChange={handleChange}
        placeholder={`Enter ${label}...`}
        style={{
          resize: "none",
        }}
      />
    </div>
  );
}

FormGroupTextArea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  formControlRef: PropTypes.any,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.string,
};