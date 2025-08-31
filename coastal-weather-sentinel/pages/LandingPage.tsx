import React from 'react';
import { motion } from 'framer-motion';
import { LayersIcon, AlertCircleIcon, TrendingUpIcon, CloudRainIcon } from '../components/icons';
import FeatureCard from '../components/FeatureCard';

interface LandingPageProps {
  onNavigate: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-coast-blue-dark tracking-tight">
          Monitor Our Coasts, Protect Our Future.
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
          Harnessing real-time data to provide crucial insights into sea levels, weather patterns, and ecological health. Your comprehensive solution for coastal monitoring and forecasting.
        </p>
        <div className="mt-8">
          <motion.button
            onClick={onNavigate}
            className="inline-block bg-coast-blue text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-coast-blue-light transition-transform transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.button>
        </div>
      </motion.div>
      
      {/* Features Section */}
      <motion.div
        className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <FeatureCard 
          icon={<LayersIcon className="w-8 h-8"/>} 
          title="Eco Data" 
          description="Access comprehensive ecological datasets and historical trends for any monitored location."
        />
        <FeatureCard 
          icon={<AlertCircleIcon className="w-8 h-8"/>} 
          title="Live Alerts" 
          description="Receive instant notifications for critical events like high tides, storms, and equipment issues."
        />
        <FeatureCard 
          icon={<TrendingUpIcon className="w-8 h-8"/>} 
          title="Sea Levels" 
          description="Visualize real-time sea level data and analyze long-term trends with interactive charts."
        />
        <FeatureCard 
          icon={<CloudRainIcon className="w-8 h-8"/>} 
          title="Forecasts" 
          description="Get accurate 16-day weather and wave forecasts to plan and mitigate risks effectively."
        />
      </motion.div>
    </div>
  );
};

export default LandingPage;