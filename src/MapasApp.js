import React from "react";
import { PageMap } from "./pages/PageMap";
import { SocketProvider } from "./contexts/SocketContext";

export const MapasApp = () => {
  return (
    <SocketProvider>
      <PageMap />
    </SocketProvider>
  );
};
