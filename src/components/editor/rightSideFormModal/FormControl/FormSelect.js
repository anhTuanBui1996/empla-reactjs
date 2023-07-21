import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { compareTwoArrayOfObject } from "../../../../utils/arrayUtils";
import {
  selectFormSubmit,
  setFormSubmit,
} from "../../../../features/editorSlice";
import { useMemo } from "react";

export default function FormSelect({
  tabIndex,
  table,
  name,
  label,
  value,
  fieldMetadata,
  onValueChange,
  isMulti,
  isRequired,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const options = useMemo(() => {
    return fieldMetadata.options.choices.map(({ name }) => ({
      label: name,
      value: name,
    }));
  }, [fieldMetadata.options.choices]);
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  const [displayValue, setDisplayValue] = useState(undefined);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });

  useEffect(() => {
    if (isMulti) {
      setDisplayValue(options.filter((opt) => value.indexOf(opt.value) !== -1));
    } else {
      setDisplayValue(options.find((opt) => opt.value === value));
    }
  }, [value, isMulti, options]);

  const handleValueChanged = (e) => {
    setDisplayValue(e);
    if (isMulti) {
      dispatch(setFormSubmit({ ...formSubmit, [name]: e }));
    } else {
      dispatch(setFormSubmit({ ...formSubmit, [name]: e?.value }));
    }
    if (onValueChange) {
      if (
        isMulti
          ? !compareTwoArrayOfObject(e, value)
          : e?.value !== value
      ) {
        onValueChange({ name, value: true });
      } else {
        onValueChange({ name, value: false });
        let newObj = {};
        Object.assign(newObj, formSubmit);
        if (newObj[name]) {
          delete newObj[name];
        }
        dispatch(setFormSubmit({ ...newObj }));
      }
    }
  };

  const handleValidate = () => {
    if (isRequired) {
      if (isMulti) {
        if (displayValue) {
          !displayValue.length &&
            setError({
              hasError: true,
              errorMsg: "This field cannot be empty",
            });
        }
      } else {
        if (!displayValue) {
          setError({
            hasError: true,
            errorMsg: "This field cannot be empty",
          });
        }
      }
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`FormSelect_${table}_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <Select
        inputId={`FormSelect_${table}_${name}`}
        ref={inputRef}
        tabIndex={tabIndex}
        onChange={handleValueChanged}
        onBlur={handleValidate}
        value={displayValue}
        isMulti={isMulti}
        options={options}
        isClearable
        placeholder={`${label}...`}
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: "1000",
          }),
        }}
      />

      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

FormSelect.propTypes = {
  table: PropTypes.string,
  tabIndex: PropTypes.number,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  fieldMetadata: PropTypes.object,
  onValueChange: PropTypes.func,
  isMulti: PropTypes.bool,
  isRequired: PropTypes.bool,
};
