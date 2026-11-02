import React, { useState } from 'react';
import WebcamDetection from './components/WebcamDetection';
import Dashboard from './components/Dashboard';
import ModelComparison from './components/ModelComparison';

function App() {
  const [activeTab, setActiveTab] = useState('detection');
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              PPE Compliance Monitor
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('detection')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'detection' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Live Detection
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Model Comparison
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'detection' && <WebcamDetection />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'comparison' && <ModelComparison />}
      </div>
    </div>
  );
}
export default App;
