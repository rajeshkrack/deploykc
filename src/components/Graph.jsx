import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Text, Spinner } from "@shopify/polaris"; // Removed Stack
import "./styles/Graph.css"; // Importing the custom CSS

// Register the components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ filterPhase, filterType }) => {
  const [contests, setContests] = useState([]); // State to store contests
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetching data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://codeforces.com/api/contest.list');
        const data = await response.json();
        
        if (data.status !== "OK") {
          throw new Error("Failed to fetch contests.");
        }
        
        setContests(data.result); // Set the fetched contests data to state
      } catch (error) {
        setError(error.message); // Set error state
      } finally {
        setLoading(false); // Set loading state to false when fetch is complete
      }
    };

    fetchData();
  }, []);

  // Filtering contests based on phase and type
  useEffect(() => {
    const filtered = contests.filter((contest) => {
      const matchesPhase = filterPhase ? contest.phase === filterPhase : true;
      const matchesType = filterType ? contest.type === filterType : true;
      return matchesPhase && matchesType;
    });
    setFilteredContests(filtered);
  }, [contests, filterPhase, filterType]);

  const data = {
    labels: filteredContests.map((contest) => contest.name),
    datasets: [
      {
        label: "Duration (Seconds)",
        data: filteredContests.map((contest) => contest.durationSeconds),
        backgroundColor: "#36a2eb", // A single color for simplicity
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Contest Durations",
        font: {
          size: 20,
        },
        color: "#333333",
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: function (tooltipItem) {
            return `Contest: ${tooltipItem[0].label}`;
          },
          label: function (tooltipItem) {
            const contest = filteredContests[tooltipItem.dataIndex];
            const duration = contest.durationSeconds;
            return `Duration: ${duration} seconds`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200,200,200,0.3)",
        },
        ticks: {
          color: "#333333",
        },
      },
      y: {
        grid: {
          color: "rgba(200,200,200,0.3)",
        },
        ticks: {
          color: "#333333",
        },
      },
    },
  };

  if (loading) {
    return (
      <Card sectioned>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
          <Spinner size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sectioned>
        <Text color="critical" variant="bodyMd">
          Error: {error}
        </Text>
      </Card>
    );
  }

  return (
    <div className="graph-container">
      <Card title="Contest Durations" sectioned>
        <div className="graph-content">
          <Text variation="strong" className="graph-title">
            Contest Durations
          </Text>
          <Bar data={data} options={options} />
        </div>
      </Card>
    </div>
  );
};

export default Graph;
