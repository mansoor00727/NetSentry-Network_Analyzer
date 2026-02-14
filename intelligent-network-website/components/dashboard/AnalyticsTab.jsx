import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsTab = () => {
    const [summary, setSummary] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Summary
                const summaryRes = await fetch('http://localhost:8000/api/analytics/summary?days=7');
                const summaryData = await summaryRes.json();
                setSummary(summaryData);

                // Fetch Predictions
                const predRes = await fetch('http://localhost:8000/api/analytics/predictions?hours=24');
                const predData = await predRes.json();
                setPredictions(predData);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-4">Loading analytics...</div>;

    // Mock data for charts if API returns empty/dummy
    const mockTrendData = [
        { name: 'Mon', sent: 4000, recv: 2400 },
        { name: 'Tue', sent: 3000, recv: 1398 },
        { name: 'Wed', sent: 2000, recv: 9800 },
        { name: 'Thu', sent: 2780, recv: 3908 },
        { name: 'Fri', sent: 1890, recv: 4800 },
        { name: 'Sat', sent: 2390, recv: 3800 },
        { name: 'Sun', sent: 3490, recv: 4300 },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Traffic Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Traffic (7 Days)</h3>
                    <div>
                        <div className="text-2xl font-bold">
                            {summary?.metrics?.total_bytes_sent ? (summary.metrics.total_bytes_sent / 1e9).toFixed(2) : 0} GB Sent
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                             {summary?.metrics?.total_bytes_recv ? (summary.metrics.total_bytes_recv / 1e9).toFixed(2) : 0} GB Recv
                        </div>
                    </div>
                </div>
                
                {/* Error Rate Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
                    <div>
                        <div className="text-2xl font-bold text-red-500">
                            {summary?.metrics?.error_ratio ? (summary.metrics.error_ratio * 100).toFixed(4) : 0}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            PACKET ERRORS
                        </div>
                    </div>
                </div>

                {/* Forecast Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Forecast (24h)</h3>
                    <div>
                        <div className="text-2xl font-bold text-blue-500">
                            Stable
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            No anomalies predicted
                        </div>
                    </div>
                </div>
            </div>

            {/* Traffic Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Traffic Trend (Last 7 Days)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sent" stroke="#8884d8" />
                            <Line type="monotone" dataKey="recv" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
