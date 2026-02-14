import React from 'react';
import { ArrowUp, ArrowDown, Activity, AlertTriangle, CloudRain } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color = "blue" }) => (
  <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-${color}-500`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={`p-2 bg-${color}-100 dark:bg-${color}-900 rounded-full`}>
        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-300`} />
      </div>
    </div>
    {subtext && <p className="text-sm text-gray-500 mt-2">{subtext}</p>}
  </div>
);

const LiveStatsTab = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return <div className="p-4 text-center">Waiting for data...</div>;

  // Find the interface with the most activity (bytes sent + recv) to show by default
  const metric = metrics.reduce((max, current) => {
    const currentTotal = (current.bytes_sent || 0) + (current.bytes_recv || 0);
    const maxTotal = (max.bytes_sent || 0) + (max.bytes_recv || 0);
    return currentTotal > maxTotal ? current : max;
  }, metrics[0]); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Interface: <span className="text-blue-600 font-mono">{metric.interface}</span>
        </h2>
        <span className="text-xs text-gray-400 font-mono">
           {new Date(metric.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Bytes Sent" 
          value={((metric?.bytes_sent || 0) / 1024 / 1024).toFixed(2) + " MB"} 
          icon={ArrowUp} 
          color="green"
        />
        <StatCard 
          title="Bytes Recv" 
          value={((metric?.bytes_recv || 0) / 1024 / 1024).toFixed(2) + " MB"} 
          icon={ArrowDown} 
          color="blue"
        />
        <StatCard 
          title="Packets" 
          value={(metric?.packets_sent || 0) + (metric?.packets_recv || 0)} 
          subtext="Total Packets"
          icon={Activity} 
          color="purple"
        />
        <StatCard 
          title="Issues" 
          value={(metric?.err_in || 0) + (metric?.err_out || 0) + (metric?.drop_in || 0) + (metric?.drop_out || 0)} 
          subtext={`Errors: ${(metric?.err_in || 0)+(metric?.err_out || 0)} | Drops: ${(metric?.drop_in || 0)+(metric?.drop_out || 0)}`}
          icon={AlertTriangle} 
          color={(metric?.err_in || 0) + (metric?.err_out || 0) > 0 ? "red" : "gray"}
        />
      </div>
    </div>
  );
};

export default LiveStatsTab;
