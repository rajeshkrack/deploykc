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
  TopBar,
  Icon,
} from "@shopify/polaris";

import ContestList from "../components/ContestList";
import Favorites from "../components/Favorites";
import ContestGraph from "../components/Graphy";
import { fetchContests } from "../utils/api";
import { debounce } from "lodash";
import './styles/Dashboard.css';

const Dashboard = () => {
  // State variables to manage contests, search, filters, pagination, and favorites
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch contests data when the component mounts
  useEffect(() => {
    fetchContests().then((data) => {
      setContests(data);
      setFilteredContests(data);
      setLoading(false);
    });
  }, []);

  // Handle search input with a debounce to improve performance
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    filterContests(query, selectedType);
  }, 300);

  // Handle changes to the contest type filter
  const handleTypeChange = (type) => {
    setSelectedType(type);
    filterContests(searchQuery, type);
  };

  // Add or remove a contest from the favorites list
  const handleFavorite = (contestId) => {
    const updatedFavorites = favorites.includes(contestId)
      ? favorites.filter((id) => id !== contestId)
      : [...favorites, contestId];
    setFavorites(updatedFavorites);
  };

  // Toggle the modal visibility for favorites
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Filter contests based on the search query and selected type
  const filterContests = (query, type) => {
    let result = contests;

    // Filter by search query
    if (query) {
      result = result.filter((contest) =>
        contest.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by contest type
    if (type) {
      result = result.filter((contest) => contest.type === type);
    }

    setFilteredContests(result);
  };

  // Calculate the paginated data to be displayed
  const paginatedData = filteredContests.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Custom page layout and header with a favorites button
  const pageMarkup = (
    <Page
      title={
        <div className="page-header-container">
          <span className="page-title">
            <span className="code">Code</span>
            <span className="forces">forces</span>
            <span className="dashboard">Dashboard</span>
          </span>
          <Button 
            onClick={toggleModal}
            icon={<Icon name="StarFilledMinor" />}
          >
            Favorites ({favorites.length})
          </Button>
        </div>
      }
    >
      <Layout>
        {/* Search and Filter Section */}
        <Layout.Section>
          <div className="search-type-container">
            <Card sectioned className="custom-card-search">
              <TextField
                label="Search Contests"
                value={searchQuery}
                onChange={handleSearch}
                labelHidden={false}
                className="custom-text-field"
                clearButton
              />
            </Card>
            <Card sectioned className="custom-card-type">
              <Select
                label="Filter by Type"
                options={[
                  { label: "All", value: "" },
                  { label: "CF", value: "CF" },
                  { label: "ICPC", value: "ICPC" },
                ]}
                onChange={handleTypeChange}
                value={selectedType}
              />
            </Card>
          </div>
        </Layout.Section>

        {/* Favorites Section */}
        <Favorites
          contests={contests}
          favorites={favorites}
          onFavoriteToggle={handleFavorite}
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />

        {/* Contest List Section */}
        <Layout.Section>
          <div className="fav-sec">
            <Card title="Contests" sectioned>
              {loading ? (
                <div style={{ textAlign: "center" }}>
                  <Spinner size="large" />
                </div>
              ) : (
                <ContestList
                  contests={paginatedData}
                  favorites={favorites}
                  onFavoriteToggle={handleFavorite}
                />
              )}
            </Card>
          </div>
        </Layout.Section>

        {/* Pagination Section */}
        <Layout.Section>
          <Card sectioned>
            <div className="flex justify-between items-center">
              {/* Previous Page Button */}
              <Button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                primary
              >
                Previous
              </Button>

              {/* Current Page Info */}
              <span className="text-gray-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">
                  {Math.ceil(filteredContests.length / perPage)}
                </span>
              </span>

              {/* Next Page Button */}
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page === Math.ceil(filteredContests.length / perPage)}
                primary
              >
                Next
              </Button>
            </div>

            {/* Items per Page Selector */}
            <div className="mt-4 sm:mt-0 flex justify-center items-center space-x-4">
              <span className="text-gray-600">Items per page: </span>
              <Select
                value={perPage}
                onChange={(e) => setPerPage(Number(e))}
                options={[
                  { label: '10', value: 10 },
                  { label: '20', value: 20 },
                  { label: '50', value: 50 },
                ]}
              />
            </div>
          </Card>
        </Layout.Section>

        {/* Graph Section */}
        <Layout.Section>
          <Card sectioned>
            <ContestGraph contest={filteredContests} />
          </Card>
        </Layout.Section>

        {/* Footer Section */}
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

  return pageMarkup;
};

export default Dashboard;
