import React, { useRef, useEffect, useState } from "react";
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
import { Card, Text } from "@shopify/polaris";
import "./styles/Graph.css"; // Importing the custom CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({ contests, filterPhase, filterType }) => {
  const chartRef = useRef(null);
  const [filteredContests, setFilteredContests] = useState(contests);

  useEffect(() => {
    // Filtering contests based on phase and type before rendering the chart
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
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
        hoverBackgroundColor: [
          "#ff435e",
          "#239bdd",
          "#ffd146",
          "#3ca6a6",
          "#8858e0",
          "#ff8c34",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
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

  return (
    <div className="graph-container">
      <Card title="Contest Durations" sectioned>
        <div className="graph-content">
          <Text variation="strong" className="graph-title">
            Contest Durations
          </Text>
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </Card>
    </div>
  );
};

export default Graph;
