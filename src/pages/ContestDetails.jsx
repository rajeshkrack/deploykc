import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../utils/api"; // Function to fetch contest data
import { formatDate } from "../utils/helpers"; // Helper function to format date
import './styles/ContestDetails.css'; // Import custom CSS for styling

/**
 * ContestDetails Component
 * Displays detailed information about a specific contest.
 * The contest is identified by its ID, which is retrieved from the route parameters.
 */
const ContestDetails = () => {
  const { contestId } = useParams(); // Get contest ID from the URL parameters
  const [contest, setContest] = useState(null); // State to hold the contest details
  const [loading, setLoading] = useState(true); // State to track loading status

  /**
   * Fetch the contest details when the component is mounted
   * or when the `contestId` changes.
   */
  useEffect(() => {
    fetchContests().then((data) => {
      // Find the contest with the matching ID
      const selectedContest = data.find((item) => item.id === Number(contestId));
      setContest(selectedContest); // Update the contest state
      setLoading(false); // Mark loading as complete
    });
  }, [contestId]); // Dependency array ensures this effect runs on `contestId` change

  // Show a loading spinner while the contest data is being fetched
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> {/* Spinner animation */}
      </div>
    );
  }

  // Show an error message if the contest is not found
  if (!contest) {
    return (
      <div className="loading-container">
        <p className="error-message">Contest not found!</p>
      </div>
    );
  }

  // Render the contest details if the data is available
  return (
    <div className="contest-container">
      <div className="contest-card">
        {/* Header Section */}
        <div className="contest-header">
          <h1 className="contest-name">{contest.name}</h1> {/* Contest name */}
        </div>

        {/* Contest Details Section */}
        <div className="contest-details">
          <p className="contest-detail">
            <span className="detail-label">ID:</span> {contest.id} {/* Contest ID */}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Type:</span> {contest.type} {/* Contest type */}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Phase:</span> {contest.phase} {/* Contest phase */}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Start Time:</span>{" "}
            {formatDate(contest.startTimeSeconds)} {/* Formatted start time */}
          </p>
          <p className="contest-detail">
            <span className="detail-label">Duration:</span>{" "}
            {contest.durationSeconds / 3600} hours {/* Duration in hours */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
