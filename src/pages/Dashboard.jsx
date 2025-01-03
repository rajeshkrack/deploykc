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
} from "@shopify/polaris";
import ContestList from "../components/ContestList";
import Favorites from "../components/Favorites";
import Graph from "../components/Graph";
import { fetchContests } from "../utils/api";
import { debounce } from "lodash";
import './styles/Dashboard.css';  // Import the custom CSS file

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests().then((data) => {
      setContests(data);
      setFilteredContests(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    filterContests(query, selectedType);
  }, 300);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    filterContests(searchQuery, type);
  };

  const handleFavorite = (contestId) => {
    const updatedFavorites = favorites.includes(contestId)
      ? favorites.filter((id) => id !== contestId)
      : [...favorites, contestId];
    setFavorites(updatedFavorites);
  };

  const filterContests = (query, type) => {
    let result = contests;

    if (query) {
      result = result.filter((contest) =>
        contest.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type) {
      result = result.filter((contest) => contest.type === type);
    }

    setFilteredContests(result);
  };

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
        {/* Side by side layout for Search and Type */}
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

        <Layout.Section>
          <Card sectioned>
            <Favorites
              contests={contests}
              favorites={favorites}
              onFavoriteToggle={handleFavorite}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
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
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <Graph contests={filteredContests} />
          </Card>
        </Layout.Section>

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
