import axios from "axios";

// Function to fetch contests from the Codeforces API
export const fetchContests = async () => {
  try {
    // Send a GET request to the Codeforces API to fetch contest list
    const response = await axios.get("https://codeforces.com/api/contest.list");

    // Check if the response status is "OK" (successful)
    if (response.data.status === "OK") {
      // Return the list of contests from the API response
      return response.data.result;
    } else {
      // Log an error message if the API response is not successful
      console.error("Failed to fetch contest data.");
      return [];
    }
  } catch (error) {
    // Catch and log any errors that occur during the API request
    console.error("Error fetching contests:", error);
    return [];
  }
};
