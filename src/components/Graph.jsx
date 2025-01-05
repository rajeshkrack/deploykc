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
import { Card, Text, Spinner } from "@shopify/polaris"; // Importing Shopify Polaris components
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
  // State hooks for storing data, loading state, and error state
  const [contests, setContests] = useState([]); 
  const [filteredContests, setFilteredContests] = useState([]); // State for storing filtered contests
  const [loading, setLoading] = useState(true); // Loading state for when data is being fetched
  const [error, setError] = useState(null); // Error state to handle API errors

  // Fetching data from the Codeforces API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true while fetching data
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch('https://codeforces.com/api/contest.list');
        const data = await response.json(); // Parse JSON response
        
        // Check if the API response is valid
        if (data.status !== "OK") {
          throw new Error("Failed to fetch contests.");
        }
        
        // Set the contests data into the state
        setContests(data.result);
      } catch (error) {
        setError(error.message); // Set the error state if an error occurs
      } finally {
        setLoading(false); // Set loading state to false once the fetch is complete
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Filtering contests based on the selected phase and type
  useEffect(() => {
    const filtered = contests.filter((contest) => {
      const matchesPhase = filterPhase ? contest.phase === filterPhase : true;
      const matchesType = filterType ? contest.type === filterType : true;
      return matchesPhase && matchesType; // Filter contests based on phase and type
    });
    setFilteredContests(filtered); // Update the filtered contests state
  }, [contests, filterPhase, filterType]); // Runs whenever contests, filterPhase, or filterType change

  // Chart.js data configuration
  const data = {
    labels: filteredContests.map((contest) => contest.name), // Labels for the X-axis (contest names)
    datasets: [
      {
        label: "Duration (Seconds)", // Label for the dataset
        data: filteredContests.map((contest) => contest.durationSeconds), // Contest duration in seconds for Y-axis data
        backgroundColor: "#000000", // Set bars color to black
        borderColor: "#444444", // Dark gray border for bars
        borderWidth: 2, // Border width for the bars
      },
    ],
  };

  // Chart.js options configuration
  const options = {
    responsive: true, // Make chart responsive to screen size
    plugins: {
      legend: {
        position: "top", // Position of the legend
        labels: {
          font: {
            size: 14, // Font size for legend
            weight: "bold", // Bold font weight
          },
          color: "#000000", // Legend text color (black)
        },
      },
      title: {
        display: true, // Display chart title
        text: "Contest Durations", // Title text
        font: {
          size: 20, // Font size for title
          weight: "bold", // Bold font weight
        },
        color: "#000000", // Title color (black)
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Black background for tooltips
        titleFont: {
          size: 14, // Font size for tooltip title
          weight: "bold", // Bold font weight
          color: "#FFFFFF", // Tooltip title text color (white)
        },
        bodyFont: {
          size: 12, // Font size for tooltip body
          color: "#FFFFFF", // Tooltip body text color (white)
        },
        callbacks: {
          // Customize the title and label for the tooltip
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
      // X-axis configuration
      x: {
        grid: {
          color: "rgba(20,20,20,0.8)", // Dark grid lines
        },
        ticks: {
          color: "#000000", // Black ticks on X-axis
          font: {
            size: 12, // Font size for X-axis ticks
            weight: "bold", // Bold font weight for ticks
          },
        },
      },
      // Y-axis configuration
      y: {
        grid: {
          color: "rgba(20,20,20,0.8)", // Dark grid lines
        },
        ticks: {
          color: "#000000", // Black ticks on Y-axis
          font: {
            size: 12, // Font size for Y-axis ticks
            weight: "bold", // Bold font weight for ticks
          },
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <Card title="Contest Durations" sectioned>
        <div className="graph-content">
          <Text variation="strong" className="graph-title">
            Contest Durations
          </Text>
          {/* Render the Bar chart with the provided data and options */}
          <Bar data={data} options={options} />
        </div>
      </Card>
    </div>
  );
};

export default Graph;
