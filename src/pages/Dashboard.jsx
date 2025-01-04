import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Select,
  TextField,
  Spinner,
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris"; // Importing Polaris components
import ContestList from "../components/ContestList"; // Importing ContestList component
import Favorites from "../components/Favorites"; // Importing Favorites component
import Graph from "../components/Graph"; // Importing Graph component
import { fetchContests } from "../utils/api"; // Function to fetch contests data
import { debounce } from "lodash"; // Importing lodash debounce function
import './styles/Dashboard.css';  // Import the custom CSS file

/**
 * Dashboard Component
 * Displays the dashboard for contests with options for search, filtering by type, displaying favorites, pagination, and a graph.
 */
const Dashboard = () => {
  const [contests, setContests] = useState([]); // State to hold all contests
  const [filteredContests, setFilteredContests] = useState([]); // State to hold filtered contests based on search/type
  const [favorites, setFavorites] = useState([]); // State to hold the list of favorite contests
  const [searchQuery, setSearchQuery] = useState(""); // State to manage the search query
  const [selectedType, setSelectedType] = useState(""); // State to manage the selected contest type filter
  const [page, setPage] = useState(1); // State to manage the current page for pagination
  const [perPage, setPerPage] = useState(10); // State to manage the number of contests per page
  const [loading, setLoading] = useState(true); // State to manage loading state during data fetch

  // Fetch contests when the component is mounted
  useEffect(() => {
    fetchContests().then((data) => {
      setContests(data); // Set contests to state
      setFilteredContests(data); // Set filtered contests to initial contests data
      setLoading(false); // Set loading to false after data is fetched
    });
  }, []);

  /**
   * Handle search input, debounce to avoid excessive re-rendering
   */
  const handleSearch = debounce((query) => {
    setSearchQuery(query); // Update search query state
    filterContests(query, selectedType); // Filter contests based on search and selected type
  }, 300);

  /**
   * Handle type selection change (e.g., CF, ICPC)
   */
  const handleTypeChange = (type) => {
    setSelectedType(type); // Update selected type state
    filterContests(searchQuery, type); // Filter contests based on search query and selected type
  };

  /**
   * Toggle contest as favorite or remove from favorites
   */
  const handleFavorite = (contestId) => {
    const updatedFavorites = favorites.includes(contestId)
      ? favorites.filter((id) => id !== contestId) // Remove from favorites if already added
      : [...favorites, contestId]; // Add to favorites if not already there
    setFavorites(updatedFavorites); // Update favorites state
  };

  /**
   * Filter contests based on search query and selected type
   */
  const filterContests = (query, type) => {
    let result = contests;

    if (query) {
      result = result.filter((contest) =>
        contest.name.toLowerCase().includes(query.toLowerCase()) // Filter contests based on name
      );
    }

    if (type) {
      result = result.filter((contest) => contest.type === type); // Filter contests based on type
    }

    setFilteredContests(result); // Update filtered contests state
  };

  // Paginate the filtered contests based on current page and perPage
  const paginatedData = filteredContests.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <Page
      title={
        <span className="page-title">
          <span className="code">Code</span>
          <span className="forces">forces</span>
          <span className="dashboard">Dashboard</span>
        </span>
      }
    >
      <Layout>
        {/* Section for search and filter type */}
        <Layout.Section >
          <div className="search-type-container">
            <Card sectioned className="custom-card-search">
              {/* Search input for contests */}
              <TextField
                label="Search Contests"
                value={searchQuery}
                onChange={handleSearch} // Trigger search on change
                labelHidden={false}
                className="custom-text-field"
                clearButton
              />
            </Card>
            <Card sectioned className="custom-card-type">
              {/* Dropdown to select contest type */}
              <Select
                label="Filter by Type"
                options={[
                  { label: "All", value: "" },
                  { label: "CF", value: "CF" },
                  { label: "ICPC", value: "ICPC" },
                ]}
                onChange={handleTypeChange} // Trigger type filter on change
                value={selectedType}
              />
            </Card>
          </div>
        </Layout.Section>

        {/* Section for showing favorite contests */}
        <Layout.Section>
          <Card sectioned>
            <Favorites
              contests={contests} // Pass all contests to Favorites component
              favorites={favorites} // Pass favorite contests to Favorites component
              onFavoriteToggle={handleFavorite} // Toggle favorite contest
            />
          </Card>
        </Layout.Section>

        {/* Section to show contests */}
        <Layout.Section>
          <div className="fav-sec">
            <Card title="Contests" sectioned>
              {loading ? (
                <div style={{ textAlign: "center" }}>
                  <Spinner size="large" /> {/* Show spinner while loading */}
                </div>
              ) : (
                <ContestList
                  contests={paginatedData} // Pass paginated contests to ContestList
                  favorites={favorites} // Pass favorites to ContestList
                  onFavoriteToggle={handleFavorite} // Handle favorite toggle
                />
              )}
            </Card>
          </div>
        </Layout.Section>

        {/* Pagination section */}
        <Layout.Section>
          <Card sectioned>
            <div className="flex justify-between items-center">
              {/* Previous button */}
              <Button
                onClick={() => setPage(page - 1)} // Decrease page number
                disabled={page === 1} // Disable if on the first page
                primary
                className="px-4 py-2 bg-blue-500 text-white rounded shadow disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Previous
              </Button>

              {/* Page count */}
              <span className="text-gray-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{Math.ceil(filteredContests.length / perPage)}</span>
              </span>

              {/* Next button */}
              <Button
                onClick={() => setPage(page + 1)} // Increase page number
                disabled={page === Math.ceil(filteredContests.length / perPage)} // Disable if on the last page
                primary
                className="px-4 py-2 bg-blue-500 text-white rounded shadow disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Next
              </Button>
            </div>

            {/* Items per page selector */}
            <div className="mt-4 sm:mt-0 flex justify-center items-center space-x-4">
              <span className="text-gray-600">Items per page: </span>
              <Select
                value={perPage} // Items per page value
                onChange={(e) => setPerPage(Number(e))} // Update perPage state
                options={[
                  { label: '10', value: 10 },
                  { label: '20', value: 20 },
                  { label: '50', value: 50 },
                ]}
                className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>
        </Layout.Section>

        {/* Section to show Graph */}
        <Layout.Section>
          <Card sectioned>
            <Graph contests={filteredContests} /> {/* Pass filtered contests to Graph component */}
          </Card>
        </Layout.Section>

        {/* Footer section */}
        <Layout.Section>
          <Card sectioned>
            <footer className="bg-gray-800 text-white py-4 mt-10">
              <div className="text-center">
                <p>&copy; 2025 Codeforces Dashboard. All rights reserved.</p>
              </div>
            </footer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;
