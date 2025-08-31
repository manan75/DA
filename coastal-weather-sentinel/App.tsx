import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/AlertsPage';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
import StationDetailDrawer from './components/StationDetailDrawer';
import { getAllStationsData } from './services/weatherService';
import type { WeatherCache, StationData, HoveredStation } from './types';
import { motion } from 'framer-motion';

export type Page = 'home' | 'dashboard' | 'alerts' | 'about';

const App: React.FC = () => {
    const [stations, setStations] = useState<StationData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const [hoveredStation, setHoveredStation] = useState<HoveredStation | null>(null);
    const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                setIsLoading(true);
                const data: WeatherCache = await getAllStationsData();
                setStations(Object.values(data));
                setError(null);
            } catch (err) {
                setError('Failed to load weather data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStations();
    }, []);

    const handleCloseDrawer = () => {
        setSelectedStation(null);
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full"
                    />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-red-50 text-red-600">
                    <p className="text-xl mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Retry</button>
                </div>
            );
        }

        switch (currentPage) {
            case 'home':
                return <LandingPage onNavigate={() => setCurrentPage('dashboard')} />;
            case 'dashboard':
                return (
                    <Dashboard 
                        stations={stations}
                        hoveredStation={hoveredStation}
                        selectedStation={selectedStation}
                        onStationHover={setHoveredStation}
                        onStationSelect={setSelectedStation}
                    />
                );
            case 'alerts':
                return <AlertsPage stations={stations} />;
            case 'about':
                return <AboutPage />;
            default:
                return null;
        }
    }
    
    return (
        <div className="min-h-screen bg-slate-100 text-gray-800">
           <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main>
                {renderContent()}
            </main>
            <StationDetailDrawer 
                station={selectedStation}
                onClose={handleCloseDrawer}
            />
        </div>
    );
};

export default App;