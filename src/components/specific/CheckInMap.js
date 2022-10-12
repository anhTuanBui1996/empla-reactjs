import React from "react";
import { useSelector } from "react-redux";
import { selectCheckinTableData } from "../../features/checkinSlice";
import GoogleMapCard from "./GoogleMapCard";

function CheckInMap() {
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
    />
  );
}

export default CheckInMap;
