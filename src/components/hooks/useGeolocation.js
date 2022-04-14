import { useDispatch } from "react-redux";
import {
  setCoords,
  setIsBrowserSupport,
  setPos,
  setTimestamp,
} from "../../features/geolocationSlice";

/**
 * Get the newest current device location
 */
const useGeolocation = () => {
  const dispatch = useDispatch();

  const geoloc = navigator.geolocation;
  if (geoloc) {
    geoloc.getCurrentPosition((pos) => {
      const { coords, timestamp } = pos;
      const {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
      } = coords;
      const newPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      const newCoords = {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
      };
      dispatch(setPos(newPos));
      dispatch(setCoords(newCoords));
      dispatch(setTimestamp(timestamp));
      dispatch(setIsBrowserSupport(true));
    });
  } else {
    dispatch(setPos(null));
    dispatch(setCoords(null));
    dispatch(setTimestamp(Date.now()));
    dispatch(setIsBrowserSupport(false));
  }
};

export default useGeolocation;
