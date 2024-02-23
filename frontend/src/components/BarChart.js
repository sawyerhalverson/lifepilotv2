// BarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto';

function formatTimeInHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
  
    return `${hours}h ${remainingMinutes}m`;
  }
  

function BarChart({ chartData }) {
  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 60, // Set the stepSize to 60 minutes (1 hour)
          callback: function (value, index, values) {
            return `${value / 60}h`;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const minutes = context.parsed.y;
            return `Time: ${formatTimeInHoursAndMinutes(minutes)}`;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default BarChart;
