import PropTypes from "prop-types";

export default function LinkRecordPicker({
  name,
  label,
  value,
  onValueChange,
  options,
  isMulti,
  isRequired,
}) {
  return (
    <div className="reference-picker-bg">
      <article>Test</article>
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
