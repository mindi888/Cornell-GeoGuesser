import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngExpression, Icon, IconOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

// Define a custom pin icon
const pinIcon: Icon<IconOptions> = L.icon({
  iconUrl: "/Bear-icon.png", // replace with your marker image
  iconSize: [38, 38],
  iconAnchor: [12, 41],
});

interface MapProps {
  markerPosition: LatLngExpression | null;
  setMarkerPosition: (pos: LatLngExpression) => void;
  initialPosition?: LatLngExpression;
}

const InteractiveMap = ({
  markerPosition,
  setMarkerPosition,
  initialPosition = [42.4470, -76.4832], // Cornell coords
}: MapProps) => {
  // This component handles map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(guess) {
        setMarkerPosition([guess.latlng.lat, guess.latlng.lng]);
      },
    });
    return null; // This component doesn't render anything
  };

  return (
    <MapContainer
      center={initialPosition}
      zoom={16}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markerPosition && <Marker position={markerPosition} icon={pinIcon} />}
      <MapClickHandler />
    </MapContainer>
  );
};

export default InteractiveMap;
