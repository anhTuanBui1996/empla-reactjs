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
import { setBadgeTheme } from "../../../../utils/setBadgeTheme";

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
  isReadOnly,
}) {
  const dispatch = useDispatch();
  const formSubmit = useSelector(selectFormSubmit);
  const options = useMemo(() => {
    return fieldMetadata.options.choices.map(({ name, color }) => ({
      label: name,
      value: name,
      color,
    }));
  }, [fieldMetadata.options.choices]);
  const labelRef = useRef(null);
  const inputRef = useRef(null);

  const [displayValue, setDisplayValue] = useState(undefined);
  const [error, setError] = useState({ hasError: false, errorMsg: "" });

  useEffect(() => {
    if (isMulti) {
      setDisplayValue(
        options.filter((opt) => value?.indexOf(opt.value) !== -1)
      );
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
          ? !compareTwoArrayOfObject(
              e.map((v) => v.value),
              value
            )
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
        isDisabled={isReadOnly}
        placeholder={`${label}...`}
        styles={{
          option: (styles, { data, isFocused, isSelected }) => {
            styles.color = "inherit";
            switch (data.color) {
              case "blueLight2":
                if (isSelected) {
                  styles.backgroundColor = "#d1e2ff";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#d1e2ff";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "cyanLight2":
                if (isSelected) {
                  styles.backgroundColor = "#c4ecff";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#c4ecff";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "tealLight2":
                if (isSelected) {
                  styles.backgroundColor = "#c1f5f0";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#c1f5f0";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "greenLight2":
                if (isSelected) {
                  styles.backgroundColor = "#cff5d1";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#cff5d1";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "yellowLight2":
                if (isSelected) {
                  styles.backgroundColor = "#ffeab6";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#ffeab6";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "orangeLight2":
                if (isSelected) {
                  styles.backgroundColor = "#ffe0cc";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#ffe0cc";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "redLight2":
                if (isSelected) {
                  styles.backgroundColor = "#ffd4e0";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#ffd4e0";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "pinkLight2":
                if (isSelected) {
                  styles.backgroundColor = "#fad2fc";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#fad2fc";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "purpleLight2":
                if (isSelected) {
                  styles.backgroundColor = "#e0dafd";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#e0dafd";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "grayLight2":
                if (isSelected) {
                  styles.backgroundColor = "#e5e9f0";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#e5e9f0";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "blueBright":
                if (isSelected) {
                  styles.color = "white";
                  styles.backgroundColor = "#166ee1";
                } else {
                  if (isFocused) {
                    styles.color = "white";
                    styles.backgroundColor = "#166ee1";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              case "pinkLight1":
                if (isSelected) {
                  styles.backgroundColor = "#f797ef";
                } else {
                  if (isFocused) {
                    styles.backgroundColor = "#f797ef";
                  } else {
                    styles.backgroundColor = "transparent";
                  }
                }
                break;
              default:
                console.log("Unknown color!", data.color);
                break;
            }
            return {
              ...styles,
            };
          },
          singleValue: (styles, data) => {
            if (!isMulti) {
              if (data.hasValue) {
                let singleVal = data.getValue()[0];
                styles.paddingLeft = "5px";
                styles.borderRadius = "3px";
                styles.color = "inherit";
                styles = setBadgeTheme(singleVal.color, styles);
              } else {
                styles.backgroundColor = "transparent";
              }
            }
            return {
              ...styles,
            };
          },
          multiValue: (styles, { data }) => {
            styles = setBadgeTheme(data.color, styles);
            return { ...styles };
          },
          menu: (styles) => ({
            ...styles,
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
