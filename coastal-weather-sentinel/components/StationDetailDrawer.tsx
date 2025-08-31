import React, { useState } from 'react';
// Fix: Explicitly import `Variants` type from framer-motion.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { StationData, LocalThreat } from '../types';
import ForecastChart from './charts/ForecastChart';
import { AlertTriangleIcon, ChevronDownIcon, XIcon, InfoIcon } from './icons';

interface StationDetailDrawerProps {
  station: StationData | null;
  onClose: () => void;
}

// Fix: Add explicit `Variants` type to the constant to fix type incompatibility.
const drawerVariants: Variants = {
  hidden: { x: '100%' },
  visible: { x: '0%', transition: { type: 'spring', stiffness: 250, damping: 30 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

// Fix: Add explicit `Variants` type to the constant for correctness.
const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const severityStyles: { [key in LocalThreat['severity']]: string } = {
  Low: 'bg-green-100 text-green-800 border-green-400',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  High: 'bg-red-100 text-red-800 border-red-400',
  Critical: 'bg-red-200 text-red-900 border-red-500 animate-pulse',
};


const StationDetailDrawer: React.FC<StationDetailDrawerProps> = ({ station, onClose }) => {
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(true);

  if (!station) return null;

  return (
    <AnimatePresence>
      {station && (
        <>
            <motion.div
                key="backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
                className="fixed inset-0 bg-black/60 z-40"
                aria-hidden="true"
            />
            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col text-gray-800"
              role="dialog"
              aria-modal="true"
              aria-labelledby="station-drawer-title"
            >
              {/* Header */}
              <header className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
                <div>
                  <h2 id="station-drawer-title" className="text-2xl font-bold text-blue-800">{station.name}</h2>
                  <p className="text-sm text-gray-500">{station.coords.join(', ')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                  aria-label="Close station details"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </header>

              {/* Content */}
              <div className="flex-grow p-6 overflow-y-auto">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">16-Day Forecast</h3>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <ForecastChart data={station.daily} />
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Local Threats</h3>
                  {station.localThreats.length > 0 ? (
                    <div className="space-y-3">
                      {station.localThreats.map((threat, index) => (
                        <div key={index} className={`flex items-start p-3 rounded-lg border ${severityStyles[threat.severity]}`}>
                          <AlertTriangleIcon className="w-6 h-6 mr-3 mt-1 shrink-0" />
                          <div>
                            <p className="font-bold">{threat.type} - {new Date(threat.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p className="text-sm">{threat.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No significant local threats identified.</p>
                  )}
                </section>

                {station.ai.enabled && (
                  <section>
                    <button
                      className="w-full flex justify-between items-center text-left text-xl font-semibold mb-3 text-gray-700"
                      onClick={() => setIsAiSummaryOpen(!isAiSummaryOpen)}
                      aria-expanded={isAiSummaryOpen}
                    >
                      <span>AI Analysis & Advisories</span>
                      <ChevronDownIcon className={`w-6 h-6 transition-transform ${isAiSummaryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                    {isAiSummaryOpen && (
                        <motion.div
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                        >
                            <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                <p className="italic text-gray-600">{station.ai.summary}</p>
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">Key Advisories:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {station.ai.structured.advisories.map((advisory, i) => (
                                            <li key={i}>{advisory}</li>
                                        ))}
                                    </ul>
                                </div>
                                {station.ai.structured.key_days.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-yellow-700 mb-2">Key Dates of Concern:</h4>
                                        <ul className="space-y-1 text-gray-600">
                                            {station.ai.structured.key_days.map((day, i) => (
                                                <li key={i} className="flex items-start">
                                                    <InfoIcon className="w-4 h-4 mr-2 mt-1 shrink-0 text-yellow-600"/>
                                                    <span><strong>{new Date(day.date).toLocaleDateString()}:</strong> {day.reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                  </section>
                )}
              </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StationDetailDrawer;