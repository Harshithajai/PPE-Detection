import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const ModelComparison = () => {
  const [modelMetrics, setModelMetrics] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/compare-models')
      .then(res => res.json())
      .then(data => setModelMetrics(data));
  }, []);
  const performanceChartData = {
    labels: modelMetrics.map(m => m.model_name),
    datasets: [
      {
        label: 'mAP@0.5 (%)',
        data: modelMetrics.map(m => m.mAP_50),
        backgroundColor: '#3B82F6',
      },
      {
        label: 'Precision (%)',
        data: modelMetrics.map(m => m.precision * 100),
        backgroundColor: '#10B981',
      },
      {
        label: 'Recall (%)',
        data: modelMetrics.map(m => m.recall * 100),
        backgroundColor: '#F59E0B',
      }
    ]
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Model Performance Comparison</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Bar data={performanceChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
      </div>
    </div>
  );
};
export default ModelComparison;
