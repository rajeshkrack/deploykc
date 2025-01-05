import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../utils/api";
import { formatDate } from "../utils/helpers";
import './styles/ContestDetails.css'; // Importing custom CSS for styling the component

const ContestDetails = () => {
  const { contestId } = useParams(); // Extracting contestId from the URL parameters
  const [contest, setContest] = useState(null); // State to hold the details of the selected contest
  const [loading, setLoading] = useState(true); // State to manage the loading state of the component

  // useEffect hook to fetch contest data when the component mounts or contestId changes
  useEffect(() => {
    fetchContests().then((data) => {
      // Finding the contest that matches the contestId from the fetched data
      const selectedContest = data.find((item) => item.id === Number(contestId));
      setContest(selectedContest); // Updating the contest state with the selected contest
      setLoading(false); // Setting loading state to false once data is fetched
    });
  }, [contestId]); // Dependency array to refetch data if contestId changes

  // Display a loading spinner while the data is being fetched
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> {/* Spinner to indicate loading state */}
      </div>
    );
  }

  // If no contest is found for the given contestId, display an error message
  if (!contest) {
    return (
      <div className="loading-container">
        <p className="error-message">Contest not found!</p> {/* Error message for invalid contestId */}
      </div>
    );
  }

  // Render the contest details if data is available
  return (
    <div className="contest-container">
      {/* Card to display contest details */}
      <div className="contest-card">
        {/* Header section for contest name */}
        <div className="contest-header">
          <h1 className="contest-name">{contest.name}</h1>
        </div>
        {/* Body section with contest details */}
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
            <span className="detail-label">Start Time:</span> {formatDate(contest.startTimeSeconds)}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Duration:</span> {contest.durationSeconds / 3600} hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
