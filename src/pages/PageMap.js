import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZnJhbmRzciIsImEiOiJjbDNxZ2lxNTYxODRxM2ptOWJmNXJvZHNmIn0.olFzm9QiGMePRUQq22MZrg";
const INITIAL_POSITION = {
  longitude: -68.843,
  latitude: -32.9286,
  zoom: 18
};

export const PageMap = () => {
  const mapaDiv = useRef();
  const [mapObject, setMapObject] = useState();
  const [coords, setCoords] = useState(INITIAL_POSITION);

  useEffect(() => {
    let map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [INITIAL_POSITION.longitude, INITIAL_POSITION.latitude],
      zoom: INITIAL_POSITION.zoom
    });
    setMapObject(map);
  }, []);

  useEffect(() => {
    mapObject?.on("move", () => {
      let { lng, lat } = mapObject.getCenter();
      console.log(lng, lat);
      setCoords({
        latitude: lat.toFixed(4),
        longitude: lng.toFixed(4),
        zoom: mapObject.getZoom(2)
      });
    });
  }, [mapObject]);

  return (
    <>
      <div className="info">
        Lng: {coords.longitude} | Lat: {coords.latitude} | Zoom: {coords.zoom}
      </div>
      <div className="map-container" ref={mapaDiv}></div>
    </>
  );
};
