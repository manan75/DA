import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import type { DailyForecast } from '../../types';

interface ForecastChartProps {
  data: DailyForecast[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg text-gray-800">
        <p className="font-bold text-blue-700">{`Date: ${label}`}</p>
        {payload.map((pld: any) => (
          <p key={pld.dataKey} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}${pld.unit}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tempRange: [d.tempMin, d.tempMax]
  }));

  return (
    <div className="h-[250px] w-full text-xs">
      <ResponsiveContainer>
        <ComposedChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
          <YAxis yAxisId="left" label={{ value: '°C / mm', angle: -90, position: 'insideLeft', fill: '#6b7280', dy:40 }} tick={{ fill: '#6b7280' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'm/s', angle: -90, position: 'insideRight', fill: '#6b7280', dy:-20 }} tick={{ fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Bar yAxisId="left" dataKey="totalPrecipMm" name="Precip (mm)" fill="#3DDC97" barSize={10} unit="mm"/>
          <Line yAxisId="left" type="monotone" dataKey="tempMax" name="Max Temp" stroke="#FFC857" strokeWidth={2} dot={false} unit="°C"/>
          <Line yAxisId="left" type="monotone" dataKey="tempMin" name="Min Temp" stroke="#60a5fa" strokeWidth={2} dot={false} unit="°C"/>
          <Line yAxisId="right" type="monotone" dataKey="maxWindMs" name="Wind (m/s)" stroke="#DB504A" strokeWidth={2} dot={false} unit="m/s"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;