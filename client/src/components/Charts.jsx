// Charts.jsx

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line
} from "recharts";

const Charts = ({ data }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="w-full h-80 p-4 bg-gray-200 rounded-xl flex items-center justify-center">
      {isEmpty ? (
        <p className="text-gray-500">No chart data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Charts;
