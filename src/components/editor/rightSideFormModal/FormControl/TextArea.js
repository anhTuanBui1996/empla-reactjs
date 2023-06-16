import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentInputFocusing,
  selectFormData,
  setCurrentInputFocusing,
  setFormData,
} from "../../../../features/editorSlice";

export default function FormGroupTextArea({
  tabIndex,
  name,
  label,
  value,
  readOnly,
  isRequired,
}) {
  const dispatch = useDispatch();
  const currentInputFocused = useSelector(selectCurrentInputFocusing);
  const editorFormData = useSelector(selectFormData);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(
    () => {
      if (inputRef.current.id === currentInputFocused) {
        inputRef.current.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length
        );
        inputRef.current.focus();
      }
    },
    // eslint-disable-next-line
    [value]
  );

  const handleFocus = () =>
    dispatch(setCurrentInputFocusing(`TextArea_${name}`));
  const handleChange = (e) =>
    dispatch(setFormData({ ...editorFormData, [name]: e.target.value }));
  const handleValidate = () => {
    dispatch(setCurrentInputFocusing(undefined));
    if (value === "") {
      setError({ hasError: true, errorMsg: `${label} must not be empty!` });
      labelRef.scrollIntoView();
    } else {
      setError({ hasError: false, errorMsg: "" });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`TextArea_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={`TextArea_${name}`}
        tabIndex={tabIndex}
        autoComplete="off"
        ref={inputRef}
        name={name}
        className="form-control"
        disabled={readOnly}
        value={value}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleValidate}
        placeholder={`Enter ${label}...`}
        style={{
          resize: "none",
        }}
      />
      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

FormGroupTextArea.propTypes = {
  tabIndex: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.string,
};
