import PropTypes from "prop-types";

export default function FormGroupText({
  name,
  label,
  value,
  readOnly,
  isRequired,
}) {
  const handleChange = (e) => {

  };
  return (
    <div className="form-group">
      <label htmlFor={name} ref={refList.FullName}>
        {`${label} `}
        {isRequired && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        className="form-control"
        disabled={readOnly}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleValidate}
        placeholder={`Enter ${label}...`}
      />
      {errorForm.errMsg.Staff.FullName !== "" && errorForm.isShowMsg && (
        <div className="err-text text-danger mt-1">
          {errorForm.errMsg.Staff.FullName}
        </div>
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
