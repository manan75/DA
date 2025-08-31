import React from 'react';
import { InfoIcon, LeafIcon, WindIcon, WaveIcon } from '../components/icons';

const AboutPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
                <InfoIcon className="w-8 h-8 mr-3"/>
                About Coastal Sentinel
            </h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                <p className="text-lg">
                    <strong>Coastal Sentinel</strong> is an advanced, interactive dashboard designed for monitoring and analyzing 16-day coastal weather forecasts across key locations in India. It provides real-time data, detailed metrics, and AI-powered insights to empower marine operators, port authorities, and researchers.
                </p>
                
                <h2 className="text-2xl font-semibold text-blue-800 pt-4">Key Features</h2>
                <ul className="list-none space-y-3">
                    <li className="flex items-start">
                        <WaveIcon className="w-6 h-6 mr-3 mt-1 text-coast-blue shrink-0"/>
                        <div>
                            <h3 className="font-bold">Interactive Map</h3>
                            <p>A centralized map interface showing all monitoring stations. Hover over any station for a quick preview of current conditions or click to open a detailed report.</p>
                        </div>
                    </li>
                     <li className="flex items-start">
                        <WindIcon className="w-6 h-6 mr-3 mt-1 text-storm-red shrink-0"/>
                        <div>
                            <h3 className="font-bold">Comprehensive Forecasts</h3>
                            <p>Access detailed 16-day forecasts including temperature, precipitation, wind speed, and local threat assessments for each station.</p>
                        </div>
                    </li>
                     <li className="flex items-start">
                        <LeafIcon className="w-6 h-6 mr-3 mt-1 text-teal shrink-0"/>
                        <div>
                            <h3 className="font-bold">AI-Powered Analysis</h3>
                            <p>Leveraging the power of Google's Gemini AI, the system provides concise summaries, identifies key days of concern, and offers actionable advisories based on complex weather data.</p>
                        </div>
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold text-blue-800 pt-4">Technology Stack</h2>
                <p>
                    This application is built with a modern, production-ready frontend stack, including:
                </p>
                 <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>React</strong> for the user interface</li>
                    <li><strong>TailwindCSS</strong> for styling</li>
                    <li><strong>Leaflet & React-Leaflet</strong> for the interactive map</li>
                    <li><strong>Recharts</strong> for data visualization</li>
                    <li><strong>Framer Motion</strong> for smooth animations</li>
                </ul>

            </div>
        </div>
    );
};

export default AboutPage;
