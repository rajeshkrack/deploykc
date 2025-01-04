import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./styles/Graph.css";

// Define a custom plugin to display small labels on bars
const smallBarPlugin = {
  id: 'smallBarLabel',
  afterDatasetsDraw: (chart, args, options) => {
    const { ctx, data, scales } = chart;
    ctx.save();
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#1e293b';

    // Display a label for each bar above the bar
    data.datasets[0].data.forEach((value, index) => {
      const x = scales.x.getPixelForValue(index); // Get x-position of the bar
      const y = scales.y.getPixelForValue(value); // Get y-position of the bar
      if (scales.y.getPixelForValue(value) > chart.height - 30) {
        ctx.fillText(`${value.toFixed(1)}h`, x, y - 5); // Show value in hours
      }
    });
    ctx.restore();
  }
};

// Register ChartJS components and the custom plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  smallBarPlugin
);

const Graph = ({ filterPhase, filterType }) => {
  const [contests, setContests] = useState([]); // All contests fetched from API
  const [filteredContests, setFilteredContests] = useState([]); // Contests after applying filters
  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const [error, setError] = useState(null); // Error state for API fetch

  // Fetch contest data from the Codeforces API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://codeforces.com/api/contest.list");
        const data = await response.json();

        // Handle errors from the API response
        if (data.status !== "OK") {
          throw new Error("Failed to fetch contests");
        }

        setContests(data.result); // Set contests to the API result
      } catch (err) {
        setError(err.message); // Handle fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter contests based on selected phase and type
  useEffect(() => {
    const filtered = contests
      .filter((contest) => {
        const matchesPhase = filterPhase ? contest.phase === filterPhase : true;
        const matchesType = filterType ? contest.type === filterType : true;
        return matchesPhase && matchesType;
      })
      .slice(0, 15); // Limit results to 15 contests for visualization
    setFilteredContests(filtered);
  }, [contests, filterPhase, filterType]);

  // Chart data and configurations
  const data = {
    labels: filteredContests.map((contest) => contest.name.substring(0, 20) + "..."), // Contest names
    datasets: [
      {
        label: "Contest Duration (Hours)",
        data: filteredContests.map((contest) => Math.max(contest.durationSeconds / 3600, 0.1)), // Duration in hours
        backgroundColor: filteredContests.map(
          (_, index) => `hsla(${index * (360 / filteredContests.length)}, 70%, 75%, 0.6)` // Dynamic colors
        ),
        borderColor: filteredContests.map(
          (_, index) => `hsla(${index * (360 / filteredContests.length)}, 70%, 65%, 0.8)` // Border color
        ),
        borderWidth: 2,
        borderRadius: 8, // Rounded corners for bars
        minBarLength: 10, // Ensure minimum visible height for small values
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow flexible resizing
    plugins: {
      legend: {
        position: "top", // Position legend at the top
        labels: {
          font: {
            size: 14,
            weight: "bold",
            family: "'Inter', sans-serif",
          },
          padding: 20,
          color: "#334155",
        },
      },
      title: {
        display: true,
        text: "Contest Durations Overview",
        font: {
          size: 20,
          weight: "bold",
          family: "'Inter', sans-serif",
        },
        padding: 20,
        color: "#1e293b",
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)", // Tooltip background
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          title: (tooltipItems) => {
            const contest = filteredContests[tooltipItems[0].dataIndex];
            return contest.name; // Tooltip title
          },
          label: (tooltipItem) => {
            const contest = filteredContests[tooltipItem.dataIndex];
            const hours = (contest.durationSeconds / 3600).toFixed(1);
            return [
              `Duration: ${hours} hours`,
              `Type: ${contest.type}`,
              `Phase: ${contest.phase}`,
            ]; // Tooltip details
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#64748b",
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'logarithmic', // Use logarithmic scale for better visualization
        grid: {
          color: "rgba(203, 213, 225, 0.4)", // Grid line color
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#64748b",
          callback: (value) => `${value}h`, // Add 'h' to values
          autoSkip: false,
          maxTicksLimit: 8, // Limit number of ticks
        },
        min: 0.1, // Minimum value on y-axis
        max: 6, // Maximum value on y-axis
      },
    },
    animation: {
      duration: 2000, // Animation duration
      easing: "easeInOutQuart", // Smooth animation
    },
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-red-50 rounded-lg">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Render the graph
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="h-[600px]">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {filteredContests.length} contests
        {filterPhase && ` in ${filterPhase} phase`}
        {filterType && ` of type ${filterType}`}
      </div>
    </div>
  );
};

export default Graph;
