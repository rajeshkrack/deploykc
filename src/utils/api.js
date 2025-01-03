import axios from "axios";

export const fetchContests = async () => {
  const response = await axios.get("https://codeforces.com/api/contest.list");
  if (response.data.status === "OK") {
    return response.data.result;
  } else {
    console.error("Failed to fetch contest data.");
    return [];
  }
};
