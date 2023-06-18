import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function ReactTimePicker({ timeValue, setTimeValue }) {
  const [currentTimeEdit, setCurrentTimeEdit] = useState(undefined);
  const [hour, setHour] = useState(timeValue ? timeValue.hour : 0);
  const [minute, setMinute] = useState(timeValue ? timeValue?.minute : 0);
  const [second, setSecond] = useState(timeValue ? timeValue?.second : 0);

  useEffect(() => {
    if (hour >= 0 && hour <= 23 && currentTimeEdit === "hour") {
      setTimeValue({ ...timeValue, hour: hour });
    } else if (hour < 0) {
      setHour(0);
    } else if (hour > 23) {
      setHour(23);
    } else if (minute >= 0 && minute <= 59 && currentTimeEdit === "minute") {
      setTimeValue({ ...timeValue, minute: minute });
    } else if (minute < 0) {
      setMinute(0);
    } else if (minute > 59) {
      setMinute(59);
    } else if (second >= 0 && second <= 59 && currentTimeEdit === "second") {
      setTimeValue({ ...timeValue, second: second });
    } else if (second < 0) {
      setSecond(0);
    } else if (second > 59) {
      setSecond(59);
    }
    // eslint-disable-next-line
  }, [hour, minute, second]);

  const handleChangeHour = (e) => {
    setCurrentTimeEdit("hour");
    setHour(parseInt(e.target.value));
  };
  const handleChangeMinute = (e) => {
    setCurrentTimeEdit("minute");
    setMinute(parseInt(e.target.value));
  };
  const handleChangeSecond = (e) => {
    setCurrentTimeEdit("second");
    setSecond(parseInt(e.target.value));
  };

  return (
    <div
      className="time-picker d-flex justify-content-center align-items-center pt-3 pb-2 bg-white"
      style={{
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      }}
    >
      <input
        id="time-picker-input-hour"
        className="form-control"
        type="number"
        style={{ width: "50px" }}
        max={23}
        min={0}
        value={hour < 10 ? `0${hour}` : `${hour}`}
        onChange={handleChangeHour}
      />
      <span className="mx-1">:</span>
      <input
        id="time-picker-input-minute"
        className="form-control"
        type="number"
        style={{ width: "50px" }}
        max={59}
        min={0}
        value={minute < 10 ? `0${minute}` : `${minute}`}
        onChange={handleChangeMinute}
      />
      <span className="mx-1">:</span>
      <input
        id="time-picker-input-second"
        className="form-control"
        type="number"
        style={{ width: "50px" }}
        max={59}
        min={0}
        value={second < 10 ? `0${second}` : `${second}`}
        onChange={handleChangeSecond}
      />
    </div>
  );
}

ReactTimePicker.propTypes = {
  dateValue: PropTypes.any,
  setTimeValue: PropTypes.func,
};
