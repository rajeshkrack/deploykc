// ContestList.jsx

// Importing React and useState for state management
import React, { useState } from "react";
// Importing Link for navigation between routes
import { Link } from "react-router-dom";
// Importing Polaris components for UI elements
import { Card, Button, Text } from "@shopify/polaris";
// Importing custom CSS for styling the ContestList component
import "./styles/ContestList.css";

// The ContestList component receives three props:
// - contests: An array of contest objects to be displayed
// - favorites: An array of favorite contest IDs
// - onFavoriteToggle: A function to handle toggling a contest as favorite
const ContestList = ({ contests, favorites, onFavoriteToggle }) => {
  // State to track the ID of the currently selected contest
  const [selectedContestId, setSelectedContestId] = useState(null);

  // Function to handle clicks on a contest row (used for highlighting)
  const handleContestClick = (contestId) => {
    setSelectedContestId(contestId); // Update the selected contest ID in the state
  };

  return (
    <div>
      {/* A card wrapper for styling the contest table */}
      <Card sectioned>
        {/* Table to display the contest list */}
        <table className="contest-table">
          <thead>
            <tr className="contest-table-header">
              {/* Table headers with strong text */}
              <th>
                <Text variation="strong">Name</Text>
              </th>
              <th>
                <Text variation="strong">Type</Text>
              </th>
              <th>
                <Text variation="strong">Phase</Text>
              </th>
              <th>
                <Text variation="strong">Start Time</Text>
              </th>
              <th>
                <Text variation="strong">Favorite</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through contests to render each contest as a row */}
            {contests.map((contest) => (
              <tr
                key={contest.id} // Unique key for each contest row
                className={`contest-row ${
                  selectedContestId === contest.id ? "contest-row-selected" : ""
                }`} // Add a CSS class if the row is selected
                onClick={() => handleContestClick(contest.id)} // Highlight row on click
              >
                {/* Contest name with a link to the contest details page */}
                <td>
                  <Link
                    to={`/contest/${contest.id}`} // Link path based on contest ID
                    className="contest-name-link" // Custom CSS class for the link
                  >
                    {contest.name}
                  </Link>
                </td>
                {/* Contest type with a dynamic CSS class based on the type */}
                <td className={`contest-type ${contest.type.toLowerCase()}`}>
                  {contest.type}
                </td>
                {/* Contest phase with a dynamic CSS class based on the phase */}
                <td className={`contest-phase ${contest.phase.toLowerCase()}`}>
                  {contest.phase}
                </td>
                {/* Contest start time formatted as a readable date-time string */}
                <td>
                  {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                </td>
                {/* Favorite button to toggle favorite status */}
                <td className="text-center">
                  <Button
                    onClick={() => onFavoriteToggle(contest.id)} // Call function to toggle favorite
                    size="slim"
                    primary={favorites.includes(contest.id)} // Change button style based on favorite status
                    className={`favorite-button ${
                      favorites.includes(contest.id)
                        ? "favorited" // CSS class if favorited
                        : "not-favorited" // CSS class if not favorited
                    }`}
                  >
                    {favorites.includes(contest.id) ? "Unfavorite" : "Favorite"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ContestList; // Exporting the component for use in other files
