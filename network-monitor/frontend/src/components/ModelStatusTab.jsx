import React, { useState, useEffect } from 'react';

const ModelStatusTab = () => {
    const [models, setModels] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/analytics/models');
                const data = await res.json();
                setModels(data);
            } catch (error) {
                console.error("Error fetching models:", error);
                setModels({ models: {} });
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    if (loading) return <div className="p-4">Loading model status...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Machine Learning Models</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Isolation Forest Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Isolation Forest</h3>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">Active</span>
                    </div>
                    <div className="space-y-2">
                            <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Type</span>
                            <span className="font-medium">Unsupervised Anomaly Detection</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Version</span>
                            <span className="font-medium">{models?.models?.isolation_forest?.latest || 'Not Trained'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Last Retrain</span>
                            <span className="font-medium">{models?.models?.isolation_forest?.v1?.created_at || 'Never'}</span>
                        </div>
                    </div>
                </div>

                {/* Autoencoder Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Autoencoder (TensorFlow)</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">Active</span>
                    </div>
                    <div className="space-y-2">
                            <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Type</span>
                            <span className="font-medium">Deep Neural Network</span>
                        </div>
                            <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Version</span>
                            <span className="font-medium">{models?.models?.autoencoder?.latest || 'Not Trained'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Threshold (MSE)</span>
                            <span className="font-medium">{models?.models?.autoencoder?.v1?.threshold ? models.models.autoencoder.v1.threshold.toFixed(4) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ensemble Strategy Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Ensemble Strategy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                    The system uses a <strong>Union Voting</strong> strategy. An alert is triggered if 
                    <span className="font-bold text-red-500"> EITHER </span> 
                    the Isolation Forest OR the Autoencoder detects an anomaly. This maximizes sensitivity to potential threats.
                </p>
            </div>
        </div>
    );
};

export default ModelStatusTab;
