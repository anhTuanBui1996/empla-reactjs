import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentInputFocusing,
  selectFormData,
  setCurrentInputFocusing,
  setFormData,
} from "../../../../features/editorSlice";

export default function TextArea({
  tabIndex,
  table,
  name,
  label,
  value,
  readOnly,
  isRequired,
  additionRegex,
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
    dispatch(setCurrentInputFocusing(`TextArea_${table}_${name}`));
  const handleChange = (e) =>
    dispatch(setFormData({ ...editorFormData, [name]: e.target.value }));
  const handleValidate = () => {
    dispatch(setCurrentInputFocusing(undefined));
    if (value === "") {
      setError({ hasError: true, errorMsg: `${label} must not be empty!` });
      labelRef.current.scrollIntoView();
    } else if (additionRegex) {
      if (!value.match(additionRegex)) {
        setError({ hasError: true, errorMsg: `Incorrect ${label} format!` });
      } else {
        if (value.match(additionRegex)[0] !== value) {
          setError({ hasError: true, errorMsg: `Incorrect ${label} format!` });
        }
      }
    } else {
      setError({ hasError: false, errorMsg: "" });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`TextArea_${table}_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={`TextArea_${table}_${name}`}
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

TextArea.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  additionRegex: PropTypes.string,
};
