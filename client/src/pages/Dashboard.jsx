// Dashboard.jsx

import React, { useEffect, useState } from 'react';
import API from '../services/api';
import StatsCards from '../components/StatsCards';
import Charts from '../components/Charts';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';


const Dashboard = () => {
  // Local state to hold fetched statistics
  const [stats, setStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading indicator

  const navigate = useNavigate();
  // Fetch stats from API on component mount
  const fetchStats = async () => {
    try {
      const response = await API.get('/job/stats');
      console.log('API response:', response.data); // Log the API response for debugging
      const { stats, monthlyApplications } = response.data;
      console.log('Fetched stats:', stats); // Log the fetched stats for debugging
      console.log('Fetched monthly applications:', monthlyApplications); // Log the fetched monthly applications for debugging

      setStats(stats);                     // Set job application stats
      setMonthlyStats(monthlyApplications); // Set chart data
    } catch (err) {
      console.error('Error fetching stats:', err.message);
      if (err.response && err.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token'); // remove from storage
        // setToken(null); // update context
        navigate('/login');
      } else {

        toast.error('Failed to load dashboard data. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Call fetch on first render
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-100 mb-6">Dashboard</h1>

        {/* Loading State */}
        {loading ? (
          + <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg h-64">
            Loading dashboard data...
          </div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="mb-6">
              <StatsCards stats={stats} />
            </div>

            {/* Monthly Application Chart */}
            <div className="bg-gray-200 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Applications</h3>
              <Charts data={monthlyStats} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
