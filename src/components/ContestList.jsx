import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Pagination } from "@shopify/polaris";
import "./styles/ContestList.css";

const ContestList = ({ contests, favorites, onFavoriteToggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastContest = currentPage * itemsPerPage;
  const indexOfFirstContest = indexOfLastContest - itemsPerPage;
  const currentContests = contests.slice(indexOfFirstContest, indexOfLastContest);

  const totalPages = Math.ceil(contests.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Card sectioned>
      <table className="contest-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Phase</th>
            <th>Start Time</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
  {currentContests.map((contest) => (
    <tr key={contest.id}>
      <td data-label="Name">
        <Link to={`/contest/${contest.id}`} className="contest-name-link">
          {contest.name}
        </Link>
      </td>
      <td data-label="Type" className={`contest-type ${contest.type.toLowerCase()}`}>
        {contest.type}
      </td>
      <td data-label="Phase" className={`contest-phase ${contest.phase.toLowerCase()}`}>
        {contest.phase}
      </td>
      <td data-label="Start Time">
        {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
      </td>
      <td data-label="Favorite">
        <Button
          onClick={() => onFavoriteToggle(contest.id)}
          size="slim"
          primary={favorites.includes(contest.id)}
        >
          {favorites.includes(contest.id) ? "Unfavorite" : "Favorite"}
        </Button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
      <div className="pagination-container">
        <Pagination
          hasPrevious={currentPage > 1}
          onPrevious={() => handlePageChange(currentPage - 1)}
          hasNext={currentPage < totalPages}
          onNext={() => handlePageChange(currentPage + 1)}
          label={`Page ${currentPage} of ${totalPages}`}
        />
      </div>
    </Card>
  );
};

export default ContestList;

