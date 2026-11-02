import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const demoStats = {
  total_detections: 532,
  compliance_rate: 78.3,
  compliant_detections: 416,
  non_compliant_detections: 116,
  detections_by_hour: {
    0: 5, 1: 4, 2: 2, 3: 3, 4: 2, 5: 7, 6: 9, 7: 12, 8: 25, 9: 38,
    10: 55, 11: 66, 12: 60, 13: 40, 14: 35, 15: 34, 16: 30, 17: 29,
    18: 27, 19: 21, 20: 18, 21: 12, 22: 9, 23: 6
  },
  most_common_violation: 'Mask'
};

const demoRecents = [
  {
    timestamp: Date.now(),
    model_name: "YOLOv8",
    ppe_detected: "Mask, Gloves",
    compliance_status: "Compliant",
    confidence_avg: 0.93,
    missing_ppe: "-"
  },
  {
    timestamp: Date.now() - 60*60000,
    model_name: "FasterRCNN",
    ppe_detected: "Mask",
    compliance_status: "Non-Compliant",
    confidence_avg: 0.85,
    missing_ppe: "Gloves"
  },
  {
    timestamp: Date.now() - 2*60*60000,
    model_name: "YOLOv8",
    ppe_detected: "Gloves",
    compliance_status: "Non-Compliant",
    confidence_avg: 0.85,
    missing_ppe: "Mask"
  }
  // Add more items as needed for a realistic effect
];

const Dashboard = () => {
  const [complianceStats, setComplianceStats] = useState(demoStats);
  const [recentDetections, setRecentDetections] = useState(demoRecents);

  // No fetching here in demo mode

  const compliancePieData = complianceStats ? {
    labels: ['Compliant', 'Non-Compliant'],
    datasets: [{
      data: [
        complianceStats.compliant_detections,
        complianceStats.non_compliant_detections
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }]
  } : null;

  const hourlyChartData = complianceStats && complianceStats.detections_by_hour ? {
    labels: Object.keys(complianceStats.detections_by_hour).map(h => `${h}:00`),
    datasets: [{
      label: 'Detections per Hour',
      data: Object.values(complianceStats.detections_by_hour),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  } : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Compliance Dashboard (Demo View)</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Detections</h3>
          <p className="text-4xl font-bold text-blue-600">{complianceStats?.total_detections || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Compliance Rate</h3>
          <p className="text-4xl font-bold text-green-600">{complianceStats?.compliance_rate?.toFixed(1) || 0}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Violations</h3>
          <p className="text-4xl font-bold text-red-600">{complianceStats?.non_compliant_detections || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Common Violation</h3>
          <p className="text-lg font-bold text-orange-600 mt-3">{complianceStats?.most_common_violation || 'None'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Compliance Distribution</h2>
          {compliancePieData && (
            <div className="h-64">
              <Pie data={compliancePieData} options={{responsive: true, maintainAspectRatio: false, plugins:{legend:{position:'bottom'}}}} />
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Detections by Hour (Last 24h)</h2>
          {hourlyChartData && (
            <div className="h-64">
              <Line data={hourlyChartData} options={{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true}},plugins:{legend:{display:false}}}} />
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Detections</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PPE Detected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing PPE</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDetections.map((detection, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(detection.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detection.model_name.toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{detection.ppe_detected || 'None'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      detection.compliance_status === 'Compliant'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {detection.compliance_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {detection.confidence_avg ? `${(detection.confidence_avg * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600">{detection.missing_ppe || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
