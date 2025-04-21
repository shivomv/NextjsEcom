'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays, subMonths } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const SalesChart = ({ salesData, period, onDateRangeChange }) => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [customRange, setCustomRange] = useState(false);

  // Generate predefined date ranges
  const getDateRange = (rangeType) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    let startDate = new Date();

    switch (rangeType) {
      case 'last7days':
        startDate = subDays(today, 6);
        startDate.setHours(0, 0, 0, 0); // Start of day
        return { startDate, endDate: today };
      case 'last30days':
        startDate = subDays(today, 29);
        startDate.setHours(0, 0, 0, 0);
        return { startDate, endDate: today };
      case 'last3months':
        startDate = subMonths(today, 3);
        startDate.setHours(0, 0, 0, 0);
        return { startDate, endDate: today };
      case 'last6months':
        startDate = subMonths(today, 6);
        startDate.setHours(0, 0, 0, 0);
        return { startDate, endDate: today };
      default:
        return { startDate: null, endDate: null };
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (rangeType) => {
    setCustomRange(false);
    const range = getDateRange(rangeType);
    setDateRange(range);

    if (onDateRangeChange) {
      onDateRangeChange(range.startDate, range.endDate);
    }
  };

  useEffect(() => {
    if (!salesData || salesData.length === 0) return;

    // Format dates based on period
    const labels = salesData.map(day => {
      const date = new Date(day.date);
      if (period === 'week') {
        return format(date, 'EEE'); // Short weekday name
      } else if (period === 'month') {
        return format(date, 'd'); // Day of month
      } else {
        return format(date, 'MMM'); // Short month name
      }
    });

    // Prepare data for chart
    const data = {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Revenue',
          data: salesData.map(day => day.revenue),
          borderColor: '#6602C2',
          backgroundColor: 'rgba(102, 2, 194, 0.1)',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#6602C2',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6602C2',
          pointHoverBorderWidth: 3,
          tension: 0.3, // Smooth curve
        },
      ],
    };

    setChartData(data);
  }, [salesData, period, onDateRangeChange]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const revenue = salesData[index].revenue;
            return `₹${revenue.toLocaleString()}`;
          },
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const date = new Date(salesData[index].date);
            const formattedDate = date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            const orderCount = salesData[index].count;
            const orderText = orderCount === 1 ? '1 order' : `${orderCount} orders`;

            return [`${formattedDate}`, `${orderText}`];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
          callback: (value) => {
            if (value === 0) return '₹0';
            return `₹${value.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  if (!chartData) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Loading chart data...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Time Range:</div>
        <button
          onClick={() => handleDateRangeSelect('last7days')}
          className={`px-3 py-1 text-xs rounded-md ${!customRange && dateRange.startDate && dateRange.endDate && format(dateRange.startDate, 'yyyy-MM-dd') === format(subDays(new Date(), 6), 'yyyy-MM-dd') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => handleDateRangeSelect('last30days')}
          className={`px-3 py-1 text-xs rounded-md ${!customRange && dateRange.startDate && dateRange.endDate && format(dateRange.startDate, 'yyyy-MM-dd') === format(subDays(new Date(), 29), 'yyyy-MM-dd') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => handleDateRangeSelect('last3months')}
          className={`px-3 py-1 text-xs rounded-md ${!customRange && dateRange.startDate && dateRange.endDate && format(dateRange.startDate, 'yyyy-MM-dd') === format(subMonths(new Date(), 3), 'yyyy-MM-dd') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Last 3 Months
        </button>
        <button
          onClick={() => handleDateRangeSelect('last6months')}
          className={`px-3 py-1 text-xs rounded-md ${!customRange && dateRange.startDate && dateRange.endDate && format(dateRange.startDate, 'yyyy-MM-dd') === format(subMonths(new Date(), 6), 'yyyy-MM-dd') ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Last 6 Months
        </button>
      </div>

      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
