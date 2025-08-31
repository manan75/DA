import React from 'react';
import Alerts from '../components/Alerts';
import type { StationData } from '../types';

interface AlertsPageProps {
    stations: StationData[];
}

const AlertsPage: React.FC<AlertsPageProps> = ({ stations }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
                All Active Alerts
            </h1>
            <div className="h-[calc(100vh-10rem)]">
                <Alerts stations={stations} />
            </div>
        </div>
    );
};

export default AlertsPage;
