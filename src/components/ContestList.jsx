import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Pagination } from "@shopify/polaris";
import "./styles/ContestList.css"; // Import custom styles for the contest list

const ContestList = ({ contests, favorites, onFavoriteToggle }) => {
  // State to manage the current page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of contests per page

  // Calculate the index for slicing the contests array based on the current page
  const indexOfLastContest = currentPage * itemsPerPage;
  const indexOfFirstContest = indexOfLastContest - itemsPerPage;
  const currentContests = contests.slice(indexOfFirstContest, indexOfLastContest); // Get contests for the current page

  // Calculate the total number of pages
  const totalPages = Math.ceil(contests.length / itemsPerPage);

  // Function to handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Card sectioned> {/* Card component for styling the contest list */}
      <table className="contest-table">
        <thead>
          <tr>
            {/* Table headers for contest name, type, phase, start time, and favorite status */}
            <th>Name</th>
            <th>Type</th>
            <th>Phase</th>
            <th>Start Time</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through the contests for the current page */}
          {currentContests.map((contest) => (
            <tr key={contest.id}>
              <td data-label="Name">
                {/* Link to the contest detail page */}
                <Link to={`/contest/${contest.id}`} className="contest-name-link">
                  {contest.name}
                </Link>
              </td>
              <td data-label="Type" className={`contest-type ${contest.type.toLowerCase()}`}>
                {/* Contest type */}
                {contest.type}
              </td>
              <td data-label="Phase" className={`contest-phase ${contest.phase.toLowerCase()}`}>
                {/* Contest phase */}
                {contest.phase}
              </td>
              <td data-label="Start Time">
                {/* Format and display the start time of the contest */}
                {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
              </td>
              <td data-label="Favorite">
                {/* Button to toggle contest as favorite */}
                <Button
                  onClick={() => onFavoriteToggle(contest.id)} // Toggle favorite status when clicked
                  size="slim"
                  primary={favorites.includes(contest.id)} // Set primary style if the contest is in favorites
                >
                  {/* Display "Unfavorite" if contest is in favorites, otherwise "Favorite" */}
                  {favorites.includes(contest.id) ? "Unfavorite" : "Favorite"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination-container">
        <Pagination
          hasPrevious={currentPage > 1} // Show previous button if not on the first page
          onPrevious={() => handlePageChange(currentPage - 1)} // Go to the previous page
          hasNext={currentPage < totalPages} // Show next button if not on the last page
          onNext={() => handlePageChange(currentPage + 1)} // Go to the next page
          label={`Page ${currentPage} of ${totalPages}`} // Display current page and total pages
        />
      </div>
    </Card>
  );
};

export default ContestList;
