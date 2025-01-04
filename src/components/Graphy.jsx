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

// Define the smallBarPlugin
const smallBarPlugin = {
  id: 'smallBarLabel',
  afterDatasetsDraw: (chart, args, options) => {
    const { ctx, data, scales } = chart;
    ctx.save();
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#1e293b';

    data.datasets[0].data.forEach((value, index) => {
      const x = scales.x.getPixelForValue(index);
      const y = scales.y.getPixelForValue(value);
      if (scales.y.getPixelForValue(value) > chart.height - 30) {
        ctx.fillText(`${value.toFixed(1)}h`, x, y - 5);
      }
    });
    ctx.restore();
  }
};

// Register ChartJS components
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

const ContestGraph = ({ filterPhase, filterType }) => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contest data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://codeforces.com/api/contest.list");
        const data = await response.json();
        
        if (data.status !== "OK") {
          throw new Error("Failed to fetch contests");
        }
        
        setContests(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter contests based on phase and type
  useEffect(() => {
    const filtered = contests
      .filter((contest) => {
        const matchesPhase = filterPhase ? contest.phase === filterPhase : true;
        const matchesType = filterType ? contest.type === filterType : true;
        return matchesPhase && matchesType;
      })
      .slice(0, 15); // Limit to 15 contests for better visualization
    setFilteredContests(filtered);
  }, [contests, filterPhase, filterType]);

  // Chart configuration
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
        minBarLength: 10, // Ensure a minimum visible height for very small values
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
        backgroundColor: "rgba(17, 24, 39, 0.8)",
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
            size: 12,
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
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#64748b",
          callback: (value) => `${value}h`,
          autoSkip: false,
          maxTicksLimit: 8,
        },
        min: 0.1, // Set minimum value to 0.1 hours (6 minutes)
        max: 6, // Set maximum value to 6 hours
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  return (
    <div className=" p-6 rounded-xl ">
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

export default ContestGraph;

