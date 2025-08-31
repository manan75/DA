import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUpIcon } from './icons';
import type { StationData } from '../types';


// Mock data for sea level trend
const seaLevelData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(0, i).toLocaleString('default', { month: 'short' }),
  level: parseFloat((1.5 + Math.sin(i / 2) * 0.3 + Math.random() * 0.2).toFixed(2)),
}));

interface SeaLevelChartProps {
    selectedStation: StationData | null;
}

const SeaLevelChart: React.FC<SeaLevelChartProps> = ({ selectedStation }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <div className="flex items-center mb-3">
        <TrendingUpIcon className="w-6 h-6 mr-2 text-blue-700" />
        <h2 className="text-xl font-semibold text-gray-800">
            Sea Level Trend {selectedStation ? `- ${selectedStation.name}` : ''}
        </h2>
      </div>
      <div className="h-[200px] w-full text-xs">
        <ResponsiveContainer>
          <LineChart data={seaLevelData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} domain={['dataMin - 0.2', 'dataMax + 0.2']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, fill: '#2563eb' }}
              name="Sea Level (m)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeaLevelChart;