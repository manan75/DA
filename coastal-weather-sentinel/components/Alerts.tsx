import React, { useMemo } from 'react';
import type { StationData, LocalThreat } from '../types';
import { AlertCircleIcon } from './icons';

interface AlertsProps {
    stations: StationData[];
}

const severityOrder: { [key in LocalThreat['severity']]: number } = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
};

const severityStyles: { [key in LocalThreat['severity']]: string } = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  High: 'bg-red-100 text-red-800 border-red-300',
  Critical: 'bg-red-200 text-red-900 border-red-400 animate-pulse',
};

const Alerts: React.FC<AlertsProps> = ({ stations }) => {
    const allThreats = useMemo(() => {
        const threats = stations.flatMap(station => 
            station.localThreats.map(threat => ({ ...threat, stationName: station.name }))
        );
        // Sort by severity (desc) and then by date (asc)
        return threats.sort((a, b) => {
            const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
            if (severityDiff !== 0) return severityDiff;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }, [stations]);

    return (
        <div className="bg-white shadow-xl rounded-2xl p-4 h-full flex flex-col">
            <div className="flex items-center mb-3 shrink-0">
                <AlertCircleIcon className="w-6 h-6 mr-2 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-800">Recent Alerts</h2>
            </div>
            {allThreats.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-center">
                    <p className="text-gray-500">No active alerts at the moment.</p>
                </div>
            ) : (
                <ul className="space-y-2 pr-2 overflow-y-auto flex-grow max-h-[50vh] lg:max-h-full">
                    {allThreats.map((threat, i) => (
                        <li key={i} className={`p-3 border rounded-lg shadow-sm ${severityStyles[threat.severity]}`}>
                           <div className="flex justify-between items-start font-bold">
                             <span>{threat.stationName}: {threat.type}</span>
                             <span>{new Date(threat.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                           </div>
                           <p className="text-sm mt-1">{threat.detail}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Alerts;