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
import "./Graph.css";

// Registering required Chart.js components for bar chart functionality
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContestGraph = ({ filterPhase, filterType }) => {
  // State variables for managing contest data, filtered contests, loading state, and errors
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching contest data from the Codeforces API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://codeforces.com/api/contest.list");
        const data = await response.json();
        
        // Checking if API returned an error
        if (data.status !== "OK") {
          throw new Error("Failed to fetch contests");
        }
        
        // Setting contests data on successful fetch
        setContests(data.result);
      } catch (err) {
        // Setting error message in case of failure
        setError(err.message);
      } finally {
        // Stopping the loading state
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering contests based on provided phase and type filters
  useEffect(() => {
    const filtered = contests
      .filter((contest) => {
        const matchesPhase = filterPhase ? contest.phase === filterPhase : true;
        const matchesType = filterType ? contest.type === filterType : true;
        return matchesPhase && matchesType;
      })
      .slice(0, 15); // Limiting to 15 contests for better visualization
    setFilteredContests(filtered);
  }, [contests, filterPhase, filterType]);

  // Preparing chart data and configuration
  const data = {
    labels: filteredContests.map((contest) => contest.name.substring(0, 20) + "..."),
    datasets: [
      {
        label: "Contest Duration (Hours)",
        data: filteredContests.map((contest) => Math.max(contest.durationSeconds / 3600, 0.1)),
        backgroundColor: filteredContests.map(
          (_, index) => `hsla(${index * (360 / filteredContests.length)}, 70%, 75%, 0.6)`
        ),
        borderColor: filteredContests.map(
          (_, index) => `hsla(${index * (360 / filteredContests.length)}, 70%, 65%, 0.8)`
        ),
        borderWidth: 2,
        borderRadius: 8,
        minBarLength: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            weight: "bold",
            family: "'Inter', sans-serif",
          },
          padding: 10,
          color: "#334155",
        },
      },
      title: {
        display: true,
        text: "Contest Durations Overview",
        font: {
          size: 16,
          weight: "bold",
          family: "'Inter', sans-serif",
        },
        padding: 10,
        color: "#1e293b",
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        padding: 8,
        titleFont: {
          size: 12,
          weight: "bold",
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 11,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          // Customizing tooltip content with contest details
          title: (tooltipItems) => {
            const contest = filteredContests[tooltipItems[0].dataIndex];
            return contest.name;
          },
          label: (tooltipItem) => {
            const contest = filteredContests[tooltipItem.dataIndex];
            const hours = (contest.durationSeconds / 3600).toFixed(1);
            return [
              `Duration: ${hours} hours`,
              `Type: ${contest.type}`,
              `Phase: ${contest.phase}`,
            ];
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
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
          color: "#64748b",
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'logarithmic',
        grid: {
          color: "rgba(203, 213, 225, 0.4)",
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
          color: "#64748b",
          callback: (value) => `${value}h`, // Displaying tick values with "h"
          autoSkip: false,
          maxTicksLimit: 6,
        },
        min: 0.1,
        max: 6,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  // Displaying loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Displaying error message if data fetch fails
  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-red-50 rounded-lg">
        <div className="text-red-500 text-center">
          <h3 className="text-base font-semibold mb-2">Error Loading Data</h3>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    );
  }

  // Rendering the bar chart
  return (
    <div className="graph-container p-2 sm:p-4 rounded-xl">
      <div className="h-[300px] sm:h-[400px] md:h-[500px]">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-2 text-center text-xs sm:text-sm text-gray-500">
        Showing {filteredContests.length} contests
        {filterPhase && ` in ${filterPhase} phase`}
        {filterType && ` of type ${filterType}`}
      </div>
    </div>
  );
};

export default ContestGraph;
