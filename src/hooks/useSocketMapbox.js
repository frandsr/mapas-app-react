import { useContext, useEffect } from "react";
import { SocketContext } from "../contexts/SocketContext";

export const useSocketMapbox = ({
  $newMarker,
  $movedMarker,
  addMarker,
  updateMarkerPosition
}) => {
  const { socket } = useContext(SocketContext);

  //Suscripciones a los cambios en los observabes
  useEffect(() => {
    $newMarker.subscribe((newMarker) => {
      socket.emit("new-marker", newMarker);
    });

    return () => {
      $newMarker.unsubscribe();
    };
  }, [$newMarker, socket]);

  useEffect(() => {
    $movedMarker.subscribe((movedMarker) => {
      socket.emit("moved-marker", movedMarker);
    });

    return () => $movedMarker.unsubscribe();
  }, [$movedMarker, socket]);

  //Escucha de socket eventos
  useEffect(() => {
    socket.on("new-marker", (newMarker) => {
      addMarker(newMarker, newMarker.id);
    });

    return () => socket.off("new-marker");
  }, [socket, addMarker]);

  useEffect(() => {
    socket.on("active-makers", (activeMarkers) => {
      for (const key of Object.keys(activeMarkers)) {
        addMarker(activeMarkers[key]);
      }
    });

    return () => socket.off("active-makers");
  }, [socket, addMarker]);

  useEffect(() => {
    socket.on("moved-marker", (updatedMarker) => {
      updateMarkerPosition(updatedMarker);
    });

    return () => socket.off("moved-marker");
  }, [socket, updateMarkerPosition]);
};
