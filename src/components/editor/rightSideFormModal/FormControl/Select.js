import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Select from "react-select/dist/declarations/src/Select";
import { selectMetadata } from "../../../../features/metadataSlice";

export default function FormGroupSelect({
  name,
  label,
  value,
  options,
  isMulti,
  isRequired,
}) {
  return (
    <div className="form-group-select">
      <label htmlFor={name}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <Select
        id={name}
        onChange={handleStaffInput}
        onBlur={handleValidate}
        value={
          value && isMulti
            ? optionList.filter((opt) => value.indexOf(opt.name) !== -1)
            : optionList.find((opt) => opt.name === value)
        }
        isMulti={isMulti}
        options={options}
        placeholder={`${label}...`}
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: "1000",
          }),
        }}
      />
    </div>
  );
}

FormGroupSelect.propTypes = {
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOf([
    // isMulti === true
    PropTypes.arrayOf(PropTypes.string),
    // isMulti === false
    PropTypes.string,
  ]),
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  isMulti: PropTypes.bool,
  isRequired: PropTypes.bool,
};
