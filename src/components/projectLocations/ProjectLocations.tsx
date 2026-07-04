"use client";

import React, { useEffect, useRef } from "react";
import { MapProject } from "@/shared/interface";

interface ProjectLocationsProps {
  projects: MapProject[];
}

const ProjectLocations: React.FC<ProjectLocationsProps> = ({ projects }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load Leaflet CSS
    const cssId = "leaflet-cdn-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Inject custom Leaflet map styles
    const customStyleId = "leaflet-custom-tooltip-css";
    if (!document.getElementById(customStyleId)) {
      const style = document.createElement("style");
      style.id = customStyleId;
      style.innerHTML = `
        .custom-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-map-tooltip::before {
          display: none !important;
        }
        .custom-pin-icon {
          background: transparent !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Dynamically load Leaflet JS
    const jsId = "leaflet-cdn-js";
    const existingScript = document.getElementById(jsId);

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current || !isMounted) return;

      // Prevent multiple map initializations
      if (mapInstanceRef.current) return;

      // Map center coordinates (Dhaka)
      const dhakaCenter: [number, number] = [23.7925, 90.395];

      // Create map instance
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView(dhakaCenter, 12);

      mapInstanceRef.current = map;

      // Position zoom controls top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Set light-theme tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      // Theme-colored SVG marker icon
      const primaryPinIcon = L.divIcon({
        html: `
          <svg width="28" height="40" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.25));">
            <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.72 23.28 0 15 0ZM15 20.25C12.1 20.25 9.75 17.9 9.75 15C9.75 12.1 12.1 9.75 15 9.75C17.9 9.75 20.25 12.1 20.25 15C20.25 17.9 17.9 20.25 15 20.25Z" fill="#FF4C00"/>
          </svg>
        `,
        className: "custom-pin-icon",
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -40]
      });

      // Bind markers and always-visible labels
      projects.forEach((proj) => {
        // Label card HTML template
        const cardContent = `
          <div class="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-2.5 border border-gray-100 flex flex-col gap-0.5 min-w-[130px] select-none text-left">
            <h4 class="font-bold text-[12px] text-[#00062A] m-0 leading-tight" style="font-family: inherit;">${proj.projectName}</h4>
            <p class="text-[9.5px] text-gray-500 m-0 font-semibold" style="font-family: inherit;">${proj.locationName}</p>
          </div>
        `;

        L.marker([proj.lat, proj.lng], { icon: primaryPinIcon })
          .addTo(map)
          .bindTooltip(cardContent, {
            permanent: true,
            direction: "top",
            className: "custom-map-tooltip",
            offset: [0, -48], // Position tooltip above marker icon
          });
      });
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    } else {
      // Initialize map or attach script load listener
      if ((window as any).L) {
        initMap();
      } else {
        existingScript.addEventListener("load", initMap);
      }
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      const script = document.getElementById(jsId);
      if (script) {
        script.removeEventListener("load", initMap);
      }
    };
  }, [projects]);

  return (
    <section className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-[580px] mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight mb-3">
            Project Locations
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Locate our signature real estate projects mapped across the most convenient and prestigious zones of Dhaka.
          </p>
        </div>

        {/* Map container wrapper */}
        <div className="relative w-full h-[480px] rounded-[24px] overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.06)] border border-gray-200/80 bg-gray-50">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>
      </div>
    </section>
  );
};

export default ProjectLocations;
