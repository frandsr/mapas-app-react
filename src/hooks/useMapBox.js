import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZnJhbmRzciIsImEiOiJjbDNxZ2lxNTYxODRxM2ptOWJmNXJvZHNmIn0.olFzm9QiGMePRUQq22MZrg";

export const useMapBox = ({ INITIAL_POSITION }) => {
  const mapaDiv = useRef();
  //Referecnia de marcadores
  const markers = useRef({});
  // Observables de RXJS
  const newMarker = useRef(new Subject());
  const movedMarker = useRef(new Subject());
  const setRef = useCallback((nodo) => {
    mapaDiv.current = nodo;
  }, []);
  const mapObject = useRef();
  const [coords, setCoords] = useState(INITIAL_POSITION);

  const addMarker = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat ?? ev;
    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();
    marker.setLngLat([lng, lat]).addTo(mapObject.current).setDraggable(true);
    //Addition to markers array
    markers.current[id ?? marker.id] = marker;
    //Update newMarker reference
    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat
      });
    }

    marker.on("drag", (ev) => {
      const { lat, lng } = ev?.target?.getLngLat();
      movedMarker.current.next({
        id: ev?.target.id,
        lat,
        lng
      });
    });
  }, []);

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

  useEffect(() => {
    mapObject.current?.on("click", addMarker);
  }, [addMarker]);

  const updateMarkerPosition = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat([lng, lat]);
  }, []);

  return {
    markers,
    coords,
    $newMarker: newMarker.current,
    $movedMarker: movedMarker.current,
    setRef,
    addMarker,
    updateMarkerPosition
  };
};
