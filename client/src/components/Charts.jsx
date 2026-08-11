import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({ labels, dataValues, labelName = 'Monthly Growth', color = '#2563EB' }) => {
  const data = {
    labels,
    datasets: [
      {
        label: labelName,
        data: dataValues,
        borderColor: color,
        backgroundColor: `${color}15`, // transparency
        fill: true,
        tension: 0.4,
        pointBackgroundColor: color,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#64748B',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { family: 'Inter' } },
      },
      y: {
        grid: { color: '#E2E8F0', borderDash: [5, 5] },
        ticks: { color: '#64748B', font: { family: 'Inter' } },
      },
    },
  };

  return (
    <div className="h-64 md:h-80 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export const BarChart = ({ labels, dataValues, labelName = 'Activity Count', color = '#7C3AED' }) => {
  const data = {
    labels,
    datasets: [
      {
        label: labelName,
        data: dataValues,
        backgroundColor: color,
        borderRadius: 8,
        borderWidth: 0,
        maxBarThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#64748B',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { family: 'Inter' } },
      },
      y: {
        grid: { color: '#E2E8F0', borderDash: [5, 5] },
        ticks: { color: '#64748B', font: { family: 'Inter' } },
      },
    },
  };

  return (
    <div className="h-64 md:h-80 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};
