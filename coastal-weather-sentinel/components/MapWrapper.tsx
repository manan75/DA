import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AnimatePresence } from 'framer-motion';

import type { StationData, HoveredStation } from '../types';
import { MAP_CENTER, MAP_URL, MAP_ATTRIBUTION, MAP_ZOOM } from '../constants';
import StationPreviewCard from './StationPreviewCard';

// Fix for default Leaflet icon path issues with bundlers like Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


// A child component that has access to the map instance via `useMap` hook
const MapContent = ({ stations, onStationHover, onStationSelect }: {
    stations: StationData[];
    onStationHover: (hovered: HoveredStation | null) => void;
    onStationSelect: (station: StationData) => void;
}) => {
    const map = useMap();

    const handleMarkerHover = (station: StationData, event: L.LeafletMouseEvent) => {
        const point = map.latLngToContainerPoint(event.latlng);
        onStationHover({ station, position: point });
    };

    return (
        <>
            {stations.map((station) => (
                <Marker
                    key={station.name}
                    position={station.coords}
                    icon={blueIcon}
                    eventHandlers={{
                        mouseover: (e) => handleMarkerHover(station, e),
                        mouseout: () => onStationHover(null),
                        click: () => onStationSelect(station),
                    }}
                    keyboard={true}
                    alt={station.name}
                />
            ))}
        </>
    );
};

interface MapWrapperProps {
  stations: StationData[];
  onStationHover: (hovered: HoveredStation | null) => void;
  onStationSelect: (station: StationData) => void;
  hoveredStation: HoveredStation | null;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ stations, onStationHover, onStationSelect, hoveredStation }) => {
  return (
    <div className="relative h-full w-full">
      <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} scrollWheelZoom={true} className="h-full w-full bg-gray-200">
        <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_URL} />
        <MapContent 
            stations={stations} 
            onStationHover={onStationHover} 
            onStationSelect={onStationSelect}
        />
      </MapContainer>
      <AnimatePresence>
        {hoveredStation && <StationPreviewCard hoveredStation={hoveredStation} />}
      </AnimatePresence>
    </div>
  );
};

export default MapWrapper;