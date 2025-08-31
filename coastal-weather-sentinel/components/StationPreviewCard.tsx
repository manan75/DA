
import React from 'react';
// Fix: Explicitly import `Variants` type from framer-motion.
import { motion, Variants } from 'framer-motion';
import type { HoveredStation } from '../types';
import { ThermometerIcon, CloudRainIcon, WindIcon, CompassIcon } from './icons';

interface StationPreviewCardProps {
  hoveredStation: HoveredStation;
}

// Fix: Add explicit `Variants` type to the constant to fix type incompatibility.
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
};

const StationPreviewCard: React.FC<StationPreviewCardProps> = ({ hoveredStation }) => {
  const { station, position } = hoveredStation;
  const today = station.daily[0];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      className="absolute z-[1000] p-4 w-64 rounded-2xl shadow-2xl text-white
                 bg-coast-blue/50 backdrop-blur-lg border border-coast-blue-light/50 pointer-events-none"
      style={{
        left: position.x + 15,
        top: position.y - 80, // Adjust vertical position
        transform: 'translate(-50%, -100%)', // Center on top of cursor, slightly offset
      }}
      aria-live="polite"
    >
      <h3 className="text-lg font-bold text-teal-light">{station.name}</h3>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ThermometerIcon className="w-5 h-5 text-sun-yellow" />
            <span>Temperature</span>
          </div>
          <span>{today.tempMin}°C / {today.tempMax}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CloudRainIcon className="w-5 h-5 text-blue-300" />
            <span>Precipitation</span>
          </div>
          <span>{today.totalPrecipMm} mm</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WindIcon className="w-5 h-5 text-storm-red" />
            <span>Wind / Gust</span>
          </div>
          <span>{today.maxWindMs} / {today.maxGustMs} m/s</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CompassIcon className="w-5 h-5 text-gray-300" />
            <span>Wind Direction</span>
          </div>
          <span>{today.predominantWindCardinal}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StationPreviewCard;