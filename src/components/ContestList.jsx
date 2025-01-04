// ContestList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Text } from "@shopify/polaris";
import "./styles/ContestList.css"; // Importing the custom CSS file

const ContestList = ({ contests, favorites, onFavoriteToggle }) => {
  const [selectedContestId, setSelectedContestId] = useState(null);

  // Function to handle contest click (to highlight contest name)
  const handleContestClick = (contestId) => {
    setSelectedContestId(contestId);
  };

  return (
    <div>
      <Card sectioned>
        <table className="contest-table">
          <thead>
            <tr className="contest-table-header">
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
            {contests.map((contest) => (
              <tr
                key={contest.id}
                className={`contest-row ${
                  selectedContestId === contest.id ? "contest-row-selected" : ""
                }`}
                onClick={() => handleContestClick(contest.id)}
              >
                <td>
                  <Link
                    to={`/contest/${contest.id}`}
                    className="contest-name-link"
                  >
                    {contest.name}
                  </Link>
                </td>
                <td className={`contest-type ${contest.type.toLowerCase()}`}>
                  {contest.type}
                </td>
                <td className={`contest-phase ${contest.phase.toLowerCase()}`}>
                  {contest.phase}
                </td>
                <td>{new Date(contest.startTimeSeconds * 1000).toLocaleString()}</td>
                <td className="text-center">
                  <Button
                    onClick={() => onFavoriteToggle(contest.id)}
                    size="slim"
                    primary={favorites.includes(contest.id)}
                    className={`favorite-button ${
                      favorites.includes(contest.id) ? "favorited" : "not-favorited"
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

export default ContestList;
