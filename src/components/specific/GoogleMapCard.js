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
import { MdGpsFixed, MdReorder } from "react-icons/md";
import { GOOGLE } from "../../constants";
import Dropdown from "../common/Dropdown";

function GoogleMapCard({ title, styleContainer, zoom, dataList }) {
  // hooks
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
    if (!dataList) return null;
    const newDataList = [...dataList];
    const sortedDataList = newDataList.sort((a, b) => {
      let createdDateA = new Date(a.fields.CreatedDate).getTime();
      let createdDateB = new Date(b.fields.CreatedDate).getTime();
      return createdDateB - createdDateA;
    });
    return sortedDataList.map((item) => {
      let lat = parseFloat(item.fields.CoordinatePosition.split(" ")[0]);
      let lng = parseFloat(item.fields.CoordinatePosition.split(" ")[1]);
      let header = item.fields.Type;
      let notes = item.fields.Notes;
      let createdDate = new Date(item.fields.CreatedDate);
      return {
        location: { lat, lng },
        header,
        title: createdDate.toUTCString(),
        notes,
        isFocused: false,
        isInfoWindowShown: false,
      };
    });
  }, [dataList]);

  // state list
  const [mapInstance, setMapInstance] = useState(null);
  const [isCurrentSelected, selectCurrent] = useState(true);
  const [markerAnim, setMarkerAnim] = useState(
    window.google?.maps.Animation.BOUNCE
  );
  const [locationList, setLocationList] = useState(null);
  const [isCloseLocationList, setCloseLocationList] = useState(false);

  // handler list
  const onLoaded = (map) => {
    setMapInstance(map);
    map.setCenter(currentPosition);
  };
  const onUnmounted = () => {
    setMapInstance(null);
    window?.google.maps.event.clearInstanceListeners(mapInstance);
  };
  const handleSelectCurrentPosition = (e) => {
    e.stopPropagation();
    selectCurrent(true);
    mapInstance.panTo(currentPosition);
    handleControlAnimation();
    handleCloseAllInfoWindow();
  };
  const handleCloseAllInfoWindow = () => {
    setLocationList(mappedDataList);
  };
  const handleSelectCheckInItemOnMap = (index) => {
    let { lat, lng } = locationList[index].location;
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
    mapInstance.panTo(new window.google.maps.LatLng({ lat, lng }));
    selectCurrent(false);
  };
  const handleControlAnimation = () => {
    setMarkerAnim(window.google?.maps.Animation.BOUNCE);
    setTimeout(() => setMarkerAnim(null), 1000);
  };
  const handleSelectCheckInItemOnList = (e, index) => {
    e.stopPropagation();
    setCloseLocationList(true);
    handleSelectCheckInItemOnMap(index);
    setTimeout(() => setCloseLocationList(false), 100);
  };

  useEffect(() => handleControlAnimation(), []);
  useEffect(() => {
    loadError && console.log("Loadding Map Javascript API failed!", loadError);
    mappedDataList && setLocationList(mappedDataList);
  }, [currentPosition, loadError, mappedDataList]);

  return (
    <Card
      cardHeader={{
        title: title,
        extension: true,
      }}
      isLoading={!isLoaded || !currentPosition}
      isHasHideCard
      noBodyPadding
      elementList={[
        isLoaded && currentPosition && (
          <GoogleMap
            mapContainerStyle={styledContainer}
            center={currentPosition}
            id="google-map"
            zoom={zoom}
            options={{
              fullscreenControl: false,
              gestureHandling: "cooperative",
              mapTypeControl: false,
            }}
            onLoad={onLoaded}
            onUnmount={onUnmounted}
          >
            <CurrentPositionToggle
              className="btn btn-light"
              onClick={handleSelectCurrentPosition}
            >
              <MdGpsFixed />
            </CurrentPositionToggle>
            <Dropdown
              variant="light"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
              }}
              toggleStyle={{
                width: "40px",
                height: "40px",
                boxShadow: "rgb(0 0 0 / 30%) 0px 1px 4px -1px",
              }}
              boxStyle={{
                width: "250px",
                maxHeight: "300px",
                overflow: "auto",
                padding: "10px 8px",
                flexDirection: "column",
                gap: "5px",
              }}
              position="left"
              title={<MdReorder />}
              isForceClose={isCloseLocationList}
            >
              {locationList?.length === 0 && (
                <span className="text-center">{"No record"}</span>
              )}
              {locationList?.map((item, index) => (
                <button
                  key={index}
                  className="loc-list-item btn btn-light text-left"
                  onClick={(e) => handleSelectCheckInItemOnList(e, index)}
                >
                  <strong>{`${item.header}: `}</strong>
                  <span>{item.title}</span>
                </button>
              ))}
            </Dropdown>
            {isCurrentSelected && (
              <Marker
                animation={markerAnim}
                position={currentPosition}
                onClick={handleSelectCurrentPosition}
                onUnmount={(marker) =>
                  window?.google.maps.event.clearInstanceListeners(marker)
                }
              />
            )}
            {locationList?.map((item, index) => {
              return (
                <div className="checkin-pos-item" key={index}>
                  <Circle
                    radius={1}
                    center={{
                      lat: item.location.lat,
                      lng: item.location.lng,
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
                    onUnmount={(circle) =>
                      window?.google.maps.event.clearInstanceListeners(circle)
                    }
                  />
                  {item.isInfoWindowShown && (
                    <InfoWindow
                      position={{
                        lat: item.location.lat,
                        lng: item.location.lng,
                      }}
                      onCloseClick={handleCloseAllInfoWindow}
                      onUnmount={(infoWindow) =>
                        window?.google.maps.event.clearInstanceListeners(
                          infoWindow
                        )
                      }
                    >
                      <>
                        <div
                          className={`map-checkin-type font-weight-bold text-center 
                            py-2 mb-2 mr-1 border border-1 border-primary rounded
                          `}
                        >
                          {item.header}
                        </div>
                        <div className="map-checkin-info mr-1">
                          <strong className="map-checkin-time">
                            {item.title}
                          </strong>
                          {`${item.notes ? `: ${item.notes}` : ""}`}
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
  border-radius: 5px;
  border: none;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
  cursor: alias;
  :hover, :active, :focus {
    box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
    outline: none;
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
