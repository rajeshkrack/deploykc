// Filters contests based on a query string
export const filterContests = (contests, query) => {
  // If the query is empty or consists only of spaces, return all contests
  if (!query.trim()) return contests;

  // Convert the query string to lowercase for case-insensitive comparison
  const lowerCaseQuery = query.toLowerCase();

  // Filter the contests array to only include contests whose name contains the query string (case-insensitive)
  return contests.filter((contest) =>
    contest.name.toLowerCase().includes(lowerCaseQuery)
  );
};

// Formats a timestamp into a readable date and time
export const formatDate = (timestamp) => {
  // Define options for the formatted date and time
  const options = {
    year: "numeric",   // Include the year (e.g., 2025)
    month: "long",     // Include the full month name (e.g., January)
    day: "numeric",    // Include the day of the month (e.g., 4)
    hour: "2-digit",   // Include the hour with two digits (e.g., 09)
    minute: "2-digit", // Include the minute with two digits (e.g., 03)
    second: "2-digit", // Include the second with two digits (e.g., 45)
  };

  // Convert the timestamp from seconds to milliseconds and format it into a readable date string
  return new Date(timestamp * 1000).toLocaleString(undefined, options);
};
