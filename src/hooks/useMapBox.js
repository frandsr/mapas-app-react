import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZnJhbmRzciIsImEiOiJjbDNxZ2lxNTYxODRxM2ptOWJmNXJvZHNmIn0.olFzm9QiGMePRUQq22MZrg";

export const useMapBox = ({ INITIAL_POSITION }) => {
  const mapaDiv = useRef();
  const setRef = useCallback((nodo) => {
    mapaDiv.current = nodo;
  }, []);

  const mapObject = useRef();
  const [coords, setCoords] = useState(INITIAL_POSITION);

  useEffect(() => {
    let map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [INITIAL_POSITION.longitude, INITIAL_POSITION.latitude],
      zoom: INITIAL_POSITION.zoom
    });
    mapObject.current = map;
  }, [INITIAL_POSITION]);

  useEffect(() => {
    mapObject.current?.on("move", () => {
      let { lng, lat } = mapObject.current.getCenter();
      setCoords({
        latitude: lat.toFixed(4),
        longitude: lng.toFixed(4),
        zoom: mapObject.current.getZoom(2)
      });
    });
  }, []);

  return {
    coords,
    setRef
  };
};
