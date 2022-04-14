import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useState, useEffect, useMemo } from "react";
import Card from "../common/Card";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectPos } from "../../features/geolocationSlice";
import styledComponents from "styled-components";
import { MdGpsFixed } from "react-icons/md";
import useGeolocation from "../hooks/useGeolocation";
import { GOOGLE } from "../../constants";

function GoogleMapCard({ title, styleContainer, zoom, dataList }) {
  // hooks
  useGeolocation();
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE.MAP_JAVASCRIPT_KEY,
  });

  // redux getter and re-computed props
  const currentPosition = useSelector(selectPos);
  const styledContainer = useMemo(() => {
    return {
      ...styleContainer,
      borderBottomLeftRadius: "0.5rem",
      borderBottomRightRadius: "0.5rem",
    };
  }, [styleContainer]);
  const mappedDataList = useMemo(() => {
    return dataList?.map((item) => ({
      ...item,
      isFocused: false,
      isInfoWindowShown: false,
    }));
  }, [dataList]);

  // state list
  const [center, setCenter] = useState(currentPosition);
  const [isCurrentSelected, selectCurrent] = useState(true);
  const [markerAnim, setMarkerAnim] = useState(
    window.google?.maps.Animation.BOUNCE
  );
  const [locationList, setLocationList] = useState(null);

  // handler list
  const onLoaded = (map) => {
    map.addListener("dragend", () => {
      setCenter({
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      });
    });
    map.addListener("zoom_changed", () => {
      setCenter({
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      });
    });
  };
  const handleSelectCurrentPosition = (e) => {
    selectCurrent(true);
    setCenter(currentPosition);
    handleControlAnimation();
    handleCloseAllInfoWindow();
  };
  const handleCloseAllInfoWindow = () => {
    setLocationList(mappedDataList);
  };
  const handleSelectCheckInItemOnMap = (index) => {
    let rec = locationList[index];
    let geo = rec.fields.CoordinatePosition;
    let selectedCenter = {
      lat: parseFloat(geo.split(" ")[0]),
      lng: parseFloat(geo.split(" ")[1]),
    };
    handleCloseAllInfoWindow();
    setLocationList((state) => [
      ...state.slice(0, index),
      {
        ...state[index],
        isFocused: true,
        isInfoWindowShown: true,
      },
      ...state.slice(index + 1),
    ]);
    setCenter(selectedCenter);
    selectCurrent(false);
  };
  const handleControlAnimation = () => {
    setMarkerAnim(window.google?.maps.Animation.BOUNCE);
    setTimeout(() => setMarkerAnim(null), 1000);
  };

  useEffect(() => handleControlAnimation(), []);
  useEffect(() => {
    currentPosition && setCenter(currentPosition);
    loadError && console.log("Loadding Map Javascript API failed!", loadError);
    mappedDataList && setLocationList(mappedDataList);
  }, [currentPosition, loadError, mappedDataList]);

  return (
    <Card
      cardHeader={{
        title: title,
      }}
      isLoading={!isLoaded && !center}
      noBodyPadding
      elementList={[
        isLoaded && center && (
          <GoogleMap
            mapContainerStyle={styledContainer}
            center={center}
            id="google-map"
            zoom={zoom}
            options={{
              fullscreenControl: false,
              gestureHandling: "cooperative",
              mapTypeControl: false,
            }}
            onLoad={onLoaded}
          >
            <CurrentPositionToggle onClick={handleSelectCurrentPosition}>
              <MdGpsFixed />
            </CurrentPositionToggle>
            {isCurrentSelected && (
              <Marker
                animation={markerAnim}
                position={currentPosition}
                onClick={handleSelectCurrentPosition}
              />
            )}
            {locationList?.map((item, index) => {
              let lat = parseFloat(
                item.fields.CoordinatePosition.split(" ")[0]
              );
              let lng = parseFloat(
                item.fields.CoordinatePosition.split(" ")[1]
              );
              let createdDate = new Date(item.fields.CreatedDate);
              let notes = item.fields.Notes;
              return (
                <div className="checkin-pos-item" key={item.id}>
                  <Circle
                    radius={1}
                    center={{
                      lat,
                      lng,
                    }}
                    options={{
                      fillColor: "#2883DA",
                      fillOpacity: 0.3,
                      strokeColor: "#2883DA",
                      strokeOpacity: 0.8,
                      strokeWeight: 1,
                      strokePosition:
                        window.google?.maps.StrokePosition.OUTSIDE,
                    }}
                    onClick={(e) => {
                      e.stop();
                      handleSelectCheckInItemOnMap(index);
                    }}
                  />
                  {item.isInfoWindowShown && (
                    <InfoWindow
                      position={{ lat, lng }}
                      onCloseClick={handleCloseAllInfoWindow}
                    >
                      <>
                        <div
                          className={`map-checkin-type font-weight-bold text-center 
                            py-2 mb-2 border border-1 border-primary rounded
                          `}
                        >
                          {item.fields.Type}
                        </div>
                        <div className="map-checkin-info">
                          <strong className="map-checkin-time">
                            {createdDate.toUTCString()}
                          </strong>
                          {`${notes ? `: ${notes}` : ""}`}
                        </div>
                      </>
                    </InfoWindow>
                  )}
                </div>
              );
            })}
          </GoogleMap>
        ),
      ]}
    />
  );
}

const CurrentPositionToggle = styledComponents.button`
  position: absolute;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 10px;
  right: 10px;
  background-color: #FFF;
  border-radius: 5px;
  border: none;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
  cursor: alias;
  :hover {
    background-color: aliceblue;
  }
`;

GoogleMapCard.propTypes = {
  title: PropTypes.string,
  /**
   * Style config for the GoogleMap container
   */
  styleContainer: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
  }).isRequired,
  /**
   * Initial zoom for GoogleMap
   */
  zoom: PropTypes.number.isRequired,
  /**
   * Array of data to display on map
   */
  dataList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
    })
  ),
};

export default GoogleMapCard;
