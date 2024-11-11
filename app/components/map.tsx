"use client";

import React, { useRef, useState, ReactNode } from "react";
import Map, { MapRef } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { Box } from "@chakra-ui/react";

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
    <Box
      ref={mapContainer}
      h="100%"
      w="100%"
      border="1px"
      borderColor="gray.200"
    >
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
        <Box>Test</Box>
        {map &&
          children &&
          React.Children.map(children, child =>
            React.cloneElement(child as JSX.Element, {})
          )}
      </Map>
    </Box>
  );
};

export default MapView;
