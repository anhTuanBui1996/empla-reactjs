import PropTypes from "prop-types";

export default function LinkRecordPicker({
  tabIndex,
  table,
  name,
  label,
  value,
  onValueChange,
  options,
  isMulti,
  isRequired,
}) {
  return (
    <div className="form-group">
      <label htmlFor={`LineText_${table}_${name}`} ref={labelRef}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>

      {error.hasError && (
        <div className="err-text text-danger mt-1">{error.errorMsg}</div>
      )}
    </div>
  );
}

LinkRecordPicker.propTypes = {
  tabIndex: PropTypes.number,
  table: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
};
