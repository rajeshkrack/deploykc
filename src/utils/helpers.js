// Filters contests based on a query string
export const filterContests = (contests, query) => {
    if (!query.trim()) return contests; // Return all contests if the query is empty
    const lowerCaseQuery = query.toLowerCase();
    return contests.filter((contest) =>
      contest.name.toLowerCase().includes(lowerCaseQuery)
    );
  };
  
  // Formats a timestamp into a readable date and time
  export const formatDate = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(timestamp * 1000).toLocaleString(undefined, options);
  };
  