import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectCheckinTableData } from "../../features/checkinSlice";
import GoogleMapCard from "./GoogleMapCard";

function CheckInMap({ onDataSelected }) {
  const checkinList = useSelector(selectCheckinTableData);

  return (
    <GoogleMapCard
      title="Check-in locations"
      styleContainer={{
        width: "100%",
        height: "487px",
      }}
      zoom={20}
      dataList={checkinList}
      onSelectData={onDataSelected}
    />
  );
}

CheckInMap.propTypes = {
  onDataSelected: PropTypes.func,
};

export default CheckInMap;
