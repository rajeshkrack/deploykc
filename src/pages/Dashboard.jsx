import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Select,
  Spinner,
  Page,
  Layout,
  TopBar,
  Frame,
  Modal,
  Icon,
} from "@shopify/polaris";
// Importing utility functions and custom components
import ContestList from "../components/ContestList";
import Favorites from "../components/Favorites";
import ContestGraph from "../components/Graphy";
import { fetchContests } from "../utils/api";
import { debounce } from "lodash";
import "./styles/Dashboard.css";

// Main Dashboard Component
const Dashboard = () => {
  // State variables for managing contests and user interactions
  const [contests, setContests] = useState([]); // All contests
  const [filteredContests, setFilteredContests] = useState([]); // Filtered contests
  const [favorites, setFavorites] = useState([]); // User's favorite contests
  const [searchQuery, setSearchQuery] = useState(""); // Search query input
  const [selectedType, setSelectedType] = useState(""); // Selected contest type
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State for favorites modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State for filter modal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu toggle state

  // Fetch contests on initial render
  useEffect(() => {
    fetchContests().then((data) => {
      setContests(data);
      setFilteredContests(data);
      setLoading(false);
    });
  }, []);

  // Handles search functionality with debounce for optimized performance
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    filterContests(query, selectedType);
  }, 300);

  // Handles changes in the contest type filter
  const handleTypeChange = (type) => {
    setSelectedType(type);
    filterContests(searchQuery, type);
    setIsFilterModalOpen(false); // Close filter modal
  };

  // Toggles a contest as a favorite or removes it
  const handleFavorite = (contestId) => {
    const updatedFavorites = favorites.includes(contestId)
      ? favorites.filter((id) => id !== contestId)
      : [...favorites, contestId];
    setFavorites(updatedFavorites);
  };

  // Utility functions to toggle modals and menus
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleFilterModal = () => setIsFilterModalOpen(!isFilterModalOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Filters contests based on the search query and selected type
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

  // User menu markup for the top bar
  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{ content: "Settings", onAction: () => console.log("Settings clicked") }],
        },
      ]}
      name="Admin"
      initials="A"
    />
  );

  // Search field markup for desktop and mobile views
  const searchFieldMarkup = (
    <div className="search-field">
      <TopBar.SearchField
        onChange={handleSearch}
        value={searchQuery}
        placeholder="Search contests..."
      />
    </div>
  );

  // Top bar markup with search, filter, and favorites
  const topBarMarkup = (
    <div style={{ position: "relative" }}>
      <TopBar
        showNavigationToggle
        searchField={searchFieldMarkup}
        secondaryMenu={
          <div className="desktop-menu">
            <Button onClick={toggleFilterModal} icon="FilterMajor">
              Filter
            </Button>
            <Button onClick={toggleModal} icon="StarFilledMajor" className="favorites-button">
              Favorites ({favorites.length})
            </Button>
          </div>
        }
      />
      {/* Mobile menu toggle button */}
      <div className="mobile-menu-toggle">
        <Button onClick={toggleMobileMenu} icon="isMobileMenuOpen">
          {isMobileMenuOpen ? "Close" : "Menu"}
        </Button>
      </div>
      {/* Mobile menu content */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <TopBar.SearchField
            onChange={handleSearch}
            value={searchQuery}
            placeholder="Search contests..."
          />
          <Button onClick={toggleFilterModal} icon="FilterMajor" fullWidth>
            Filter
          </Button>
          <Button onClick={toggleModal} icon="StarFilledMajor" fullWidth className="favorites-button">
            Favorites ({favorites.length})
          </Button>
        </div>
      )}
    </div>
  );

  // Main render section
  return (
    <Frame topBar={topBarMarkup}>
      {/* Filter modal */}
      <Modal
        open={isFilterModalOpen}
        onClose={toggleFilterModal}
        title="Filter Contests"
        primaryAction={{
          content: "Apply",
          onAction: toggleFilterModal,
        }}
      >
        <Modal.Section>
          <Select
            label="Contest Type"
            options={[
              { label: "All", value: "" },
              { label: "CF", value: "CF" },
              { label: "ICPC", value: "ICPC" },
            ]}
            onChange={handleTypeChange}
            value={selectedType}
          />
        </Modal.Section>
      </Modal>

      {/* Dashboard layout */}
      <Page title="CodeForces Dashboard">
        <Layout>
          {/* Contest list section */}
          <Layout.Section>
            <div className="contest-section">
              <Card title="Contests" sectioned>
                {loading ? (
                  <div className="spinner-container">
                    <Spinner size="large" />
                  </div>
                ) : (
                  <ContestList
                    contests={filteredContests}
                    favorites={favorites}
                    onFavoriteToggle={handleFavorite}
                  />
                )}
              </Card>
            </div>
          </Layout.Section>

          {/* Graph section */}
          <Layout.Section>
            <Card sectioned>
              <div className="graph-container">
                <ContestGraph contests={filteredContests} />
              </div>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Favorites modal */}
        <Favorites
          contests={contests}
          favorites={favorites}
          onFavoriteToggle={handleFavorite}
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
        />
      </Page>
    </Frame>
  );
};

export default Dashboard;
