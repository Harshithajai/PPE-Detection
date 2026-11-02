import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const demoMetrics = [
  {
    model_name: "YOLOv8",
    mAP_50: 88.2,
    precision: 0.91,
    recall: 0.94
  },
  {
    model_name: "FasterRCNN",
    mAP_50: 82.5,
    precision: 0.85,
    recall: 0.90
  }
];

const performanceChartData = {
  labels: demoMetrics.map(m => m.model_name),
  datasets: [
    {
      label: 'mAP@0.5 (%)',
      data: demoMetrics.map(m => m.mAP_50),
      backgroundColor: '#3B82F6',
    },
    {
      label: 'Precision (%)',
      data: demoMetrics.map(m => m.precision * 100),
      backgroundColor: '#10B981',
    },
    {
      label: 'Recall (%)',
      data: demoMetrics.map(m => m.recall * 100),
      backgroundColor: '#F59E0B',
    }
  ]
};

const ModelComparison = () => {
  const [modelMetrics] = useState(demoMetrics); // Static demo data
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Model Performance Comparison</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Bar
          data={performanceChartData}
          options={{
            responsive: true,
            plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Model Metrics' } },
            scales: { y: { beginAtZero: true, max: 100 } }
          }}
        />
      </div>
    </div>
  );
};

export default ModelComparison;
