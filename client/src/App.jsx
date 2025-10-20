import { useState, useEffect } from 'react';
import './App.css';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import Dashboard from './components/Dashboard';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('${API_BASE}/reports');
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('${API_BASE}/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛡️</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PhishBlock
              </h1>
              <p className="text-xs text-gray-400">Community Threat Intelligence</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`px-4 py-2 rounded-lg transition font-medium ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('reports')} 
              className={`px-4 py-2 rounded-lg transition font-medium ${
                activeTab === 'reports' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              📋 Reports
            </button>
            <button 
              onClick={() => setActiveTab('submit')} 
              className={`px-4 py-2 rounded-lg transition font-medium ${
                activeTab === 'submit' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              ➕ Submit
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading && activeTab !== 'submit' ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-400">Loading...</div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'reports' && (
              <ReportList 
                reports={reports} 
                onVote={() => {
                  fetchReports();
                  fetchStats();
                }} 
              />
            )}
            {activeTab === 'submit' && (
              <ReportForm 
                onSubmit={() => {
                  fetchReports();
                  fetchStats();
                  setActiveTab('reports');
                }} 
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>🛡️ PhishBlock - Community-driven threat intelligence platform</p>
          <p className="mt-2">Built for hackathons with React, Tailwind CSS, and Supabase</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
