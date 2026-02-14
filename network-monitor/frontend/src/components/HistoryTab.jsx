import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoryTab = ({ history }) => {
  // Process history data for chart
  // History is list of full metric objects (which might contain multiple interfaces if we sent list of lists)
  // But backfill sends list of single Interface metrics (from get_metrics)
  // Live update sends list of metrics (one per interface)
  // Let's assume history is a flat list of metrics for the primary interface to chart.
  
  if (!history || history.length === 0) return <div className="p-4 text-center">No history data available.</div>;

  const data = history.slice().reverse().map(m => ({
    time: new Date(m.timestamp).toLocaleTimeString(),
    packets: m.packets_sent + m.packets_recv,
    bytes: (m.bytes_sent + m.bytes_recv) / 1024, // KB
  }));

  return (
    <div className="h-[400px] w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Network Traffic (Last 5 mins)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tick={{fill: '#6b7280'}} />
          <YAxis yAxisId="left" stroke="#8884d8" fontSize={12} label={{ value: 'Packets', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} label={{ value: 'KB', angle: 90, position: 'insideRight' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="packets" stroke="#8884d8" activeDot={{ r: 8 }} name="Packets" />
          <Line yAxisId="right" type="monotone" dataKey="bytes" stroke="#82ca9d" name="Bytes (KB)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryTab;
