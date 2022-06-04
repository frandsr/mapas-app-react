import React from "react";
import { useMapBox } from "../hooks/useMapBox";
import { useSocketMapbox } from "../hooks/useSocketMapbox";

const INITIAL_POSITION = {
  longitude: -68.843,
  latitude: -32.9286,
  zoom: 18
};

export const PageMap = () => {
  const {
    setRef,
    coords,
    $newMarker,
    $movedMarker,
    addMarker,
    updateMarkerPosition
  } = useMapBox({
    INITIAL_POSITION
  });

  useSocketMapbox({
    $newMarker,
    $movedMarker,
    addMarker,
    updateMarkerPosition
  });

  return (
    <>
      <div className="info">
        Lng: {coords.longitude} | Lat: {coords.latitude} | Zoom: {coords.zoom}
      </div>
      <div className="map-container" ref={setRef}></div>
    </>
  );
};
