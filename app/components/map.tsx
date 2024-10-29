"use client";

import React, { useRef, useState, ReactNode } from "react";
import Map, { MapRef } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

type MapViewProps = {
  children?: ReactNode;
  center: number[];
  zoom: number;
};

export type MapFeature = { id: string; shading: number; isSelected: boolean };

const MapView = ({ center, zoom, children }: MapViewProps) => {
  const [map, setMap] = useState<MapRef>();
  const mapContainer = useRef(null);
  const setMapRef = (m: MapRef) => setMap(m);

  return (
    <div ref={mapContainer} className="h-full w-full">
      <Map
        ref={setMapRef}
        style={{ width: "100%", height: "100%" }}
        initialViewState={{
          latitude: center[1],
          longitude: center[0],
          zoom,
        }}
        mapLib={maplibregl as any}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <div> Test</div>
        {map &&
          children &&
          React.Children.map(children, child =>
            React.cloneElement(child as JSX.Element, {})
          )}
      </Map>
    </div>
  );
};

export default MapView;
