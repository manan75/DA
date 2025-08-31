import React from 'react';
import type { StationData } from '../types';
import { ThermometerIcon, CloudRainIcon, WindIcon } from './icons';

interface StationMetricsProps {
    selectedStation: StationData | null;
}

const StationMetrics: React.FC<StationMetricsProps> = ({ selectedStation }) => {
    const today = selectedStation?.daily[0];

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
                {selectedStation ? `Live Metrics: ${selectedStation.name}` : 'Live Metrics'}
            </h2>
            {selectedStation && today ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <MetricCard 
                        icon={<ThermometerIcon className="w-6 h-6 text-orange-500"/>} 
                        label="Temp Range" 
                        value={`${today.tempMin}°C / ${today.tempMax}°C`}
                        color="orange"
                    />
                    <MetricCard 
                        icon={<CloudRainIcon className="w-6 h-6 text-blue-500"/>} 
                        label="Precipitation" 
                        value={`${today.totalPrecipMm} mm`}
                        color="blue"
                    />
                    <MetricCard 
                        icon={<WindIcon className="w-6 h-6 text-teal-500"/>} 
                        label="Wind Speed" 
                        value={`${today.maxWindMs} m/s`}
                        color="teal"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center h-full min-h-[150px] text-gray-500">
                    <p>Click a marker on the map to see live metrics.</p>
                </div>
            )}
        </div>
    );
};

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: 'orange' | 'blue' | 'teal';
}

const colorClasses = {
    orange: 'bg-orange-50 text-orange-800',
    blue: 'bg-blue-50 text-blue-800',
    teal: 'bg-teal-50 text-teal-800',
};

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color }) => {
    return (
        <div className={`p-3 rounded-xl shadow-sm flex items-center space-x-4 ${colorClasses[color]}`}>
            <div className="flex-shrink-0">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    )
}

export default StationMetrics;