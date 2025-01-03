import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../utils/api";
import { formatDate } from "../utils/helpers";
import './styles/ContestDetails.css'; // Import the custom CSS file

const ContestDetails = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests().then((data) => {
      const selectedContest = data.find((item) => item.id === Number(contestId));
      setContest(selectedContest);
      setLoading(false);
    });
  }, [contestId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="loading-container">
        <p className="error-message">Contest not found!</p>
      </div>
    );
  }

  return (
    <div className="contest-container">
      <div className="contest-card">
        <div className="contest-header">
          <h1 className="contest-name">{contest.name}</h1>
        </div>
        <div className="contest-details">
          <p className="contest-detail">
            <span className="detail-label">ID:</span> {contest.id}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Type:</span> {contest.type}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Phase:</span> {contest.phase}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Start Time:</span>{" "}
            {formatDate(contest.startTimeSeconds)}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Duration:</span>{" "}
            {contest.durationSeconds / 3600} hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
