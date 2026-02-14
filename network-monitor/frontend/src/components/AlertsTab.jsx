import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';

const LEVEL_COLORS = {
  CRITICAL: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-green-100 text-green-800 border-green-200"
};

const AlertsTab = ({ alerts }) => {
  const [filter, setFilter] = useState("ALL");

  const filteredAlerts = filter === "ALL" 
    ? alerts 
    : alerts.filter(a => a.level === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
              ${filter === level 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"}`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {filteredAlerts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No alerts found.</p>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg border-l-4 flex items-start gap-3 shadow-sm
                bg-white dark:bg-gray-800
                ${alert.level === 'CRITICAL' ? 'border-red-500' : 
                  alert.level === 'HIGH' ? 'border-orange-500' : 
                  alert.level === 'MEDIUM' ? 'border-yellow-500' : 'border-green-500'}`}
            >
              <div className="mt-1">
                {alert.level === 'CRITICAL' && <AlertOctagon className="w-5 h-5 text-red-500" />}
                {alert.level === 'HIGH' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                {(alert.level === 'MEDIUM' || alert.level === 'LOW') && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    {alert.message}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${LEVEL_COLORS[alert.level] || "bg-gray-100"}`}>
                    {alert.level}
                  </span>
                  {alert.id && <span className="text-[10px] text-gray-400">ID: {alert.id}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsTab;
