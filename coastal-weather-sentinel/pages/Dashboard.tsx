import React from 'react';
import MapWrapper from '../components/MapWrapper';
import Alerts from '../components/Alerts';
import type { StationData, HoveredStation } from '../types';

interface DashboardProps {
    stations: StationData[];
    hoveredStation: HoveredStation | null;
    selectedStation: StationData | null;
    onStationHover: (hovered: HoveredStation | null) => void;
    onStationSelect: (station: StationData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stations, hoveredStation, selectedStation, onStationHover, onStationSelect }) => {
    return (
        <main className="p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                🌊 Coastal Monitoring Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts Section */}
                <div className="lg:col-span-1 lg:h-[70vh]">
                    <Alerts stations={stations} />
                </div>
                
                {/* Map Section */}
                <div className="lg:col-span-2 relative z-0 bg-white rounded-2xl shadow-xl overflow-hidden h-[65vh] lg:h-[70vh]">
                     <MapWrapper 
                        stations={stations}
                        hoveredStation={hoveredStation}
                        onStationHover={onStationHover}
                        onStationSelect={onStationSelect}
                    />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;