// StatsCards.jsx

import React from 'react';
import { Briefcase, PhoneCall, ThumbsUp, ThumbsDown } from 'lucide-react'; // optional icons

const statsConfig = [
  { label: 'Applied',    key: 'applied',    colorLight: 'text-blue-600',   colorDark: 'text-blue-400',   icon: <Briefcase /> },
  { label: 'Interview',  key: 'interview',  colorLight: 'text-amber-400',  colorDark: 'text-amber-200',  icon: <PhoneCall /> },
  { label: 'Offer',      key: 'offer',      colorLight: 'text-green-600',  colorDark: 'text-green-400',  icon: <ThumbsUp /> },
  { label: 'Rejected',   key: 'rejected',   colorLight: 'text-red-600',    colorDark: 'text-red-400',    icon: <ThumbsDown /> },
];

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 ">
      {statsConfig.map(({ label, key, colorLight, colorDark, icon }) => (
        <div
          key={key}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center"
        >
          <div className={`mb-2 ${colorLight} dark:${colorDark}`}>{icon}</div>
          <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">{label}</h3>
          <p className={`text-3xl font-bold ${colorLight} dark:${colorDark}`}>{stats[key] || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
