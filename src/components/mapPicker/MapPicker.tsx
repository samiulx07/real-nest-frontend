"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

// Inner component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Inner component to recenter the map when coordinates change externally
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const prevRef = useRef({ lat, lng });

  useEffect(() => {
    if (prevRef.current.lat !== lat || prevRef.current.lng !== lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
      prevRef.current = { lat, lng };
    }
  }, [lat, lng, map]);

  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  onChange,
  readOnly = false,
}) => {
  const [latInput, setLatInput] = useState(String(latitude));
  const [lngInput, setLngInput] = useState(String(longitude));

  // Sync inputs when props change
  useEffect(() => {
    setLatInput(String(latitude));
    setLngInput(String(longitude));
  }, [latitude, longitude]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (onChange && !readOnly) {
        onChange(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
      }
    },
    [onChange, readOnly]
  );

  const handleMarkerDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      if (onChange && !readOnly) {
        const marker = e.target;
        const pos = marker.getLatLng();
        onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
      }
    },
    [onChange, readOnly]
  );

  const handleLatInputBlur = () => {
    if (!onChange || readOnly) return;
    const val = parseFloat(latInput);
    if (!isNaN(val) && val >= -90 && val <= 90) {
      onChange(val, longitude);
    } else {
      setLatInput(String(latitude));
    }
  };

  const handleLngInputBlur = () => {
    if (!onChange || readOnly) return;
    const val = parseFloat(lngInput);
    if (!isNaN(val) && val >= -180 && val <= 180) {
      onChange(latitude, val);
    } else {
      setLngInput(String(longitude));
    }
  };

  return (
    <div className="map-picker">
      <div className="map-picker__container" style={{ height: "350px", borderRadius: "12px", overflow: "hidden", border: "2px solid var(--border-color, #e2e8f0)", position: "relative", zIndex: 1 }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={!readOnly}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[latitude, longitude]}
            icon={defaultIcon}
            draggable={!readOnly}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          />
          {!readOnly && onChange && <MapClickHandler onMapClick={handleMapClick} />}
          <MapRecenter lat={latitude} lng={longitude} />
        </MapContainer>
      </div>

      {!readOnly && (
        <>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "4px",
                  color: "var(--text-secondary, #64748b)",
                }}
              >
                Latitude
              </label>
              <input
                type="text"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                onBlur={handleLatInputBlur}
                onKeyDown={(e) => e.key === "Enter" && handleLatInputBlur()}
                placeholder="23.7925"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-color, #e2e8f0)",
                  fontSize: "14px",
                  background: "var(--input-bg, #fff)",
                  color: "var(--text-primary, #1e293b)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "4px",
                  color: "var(--text-secondary, #64748b)",
                }}
              >
                Longitude
              </label>
              <input
                type="text"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                onBlur={handleLngInputBlur}
                onKeyDown={(e) => e.key === "Enter" && handleLngInputBlur()}
                placeholder="90.4078"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-color, #e2e8f0)",
                  fontSize: "14px",
                  background: "var(--input-bg, #fff)",
                  color: "var(--text-primary, #1e293b)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "var(--text-tertiary, #94a3b8)",
              marginTop: "6px",
              fontStyle: "italic",
            }}
          >
            Click on the map or drag the marker to set coordinates
          </p>
        </>
      )}
    </div>
  );
};

export default MapPicker;
