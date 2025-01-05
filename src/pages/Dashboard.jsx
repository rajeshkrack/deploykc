
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
// import { SearchMinor, FilterMinor, StarFilledMinor, MenuIcon, SearchMajor, FilterMajor, StarFilledMajor, MobileCancelMajor } from '@shopify/polaris-icons';
import ContestList from "../components/ContestList";
import Favorites from "../components/Favorites";
import ContestGraph from "../components/Graphy";
import { fetchContests } from "../utils/api";
import { debounce } from "lodash";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsFilterModalOpen(false);
  };

  const handleFavorite = (contestId) => {
    const updatedFavorites = favorites.includes(contestId)
      ? favorites.filter((id) => id !== contestId)
      : [...favorites, contestId];
    setFavorites(updatedFavorites);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleFilterModal = () => setIsFilterModalOpen(!isFilterModalOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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

  const searchFieldMarkup = (
    <div className="search-field">
    <TopBar.SearchField
      onChange={handleSearch}
      value={searchQuery}
      placeholder="Search contests..."
      
    />
    </div>
  );

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
      <div className="mobile-menu-toggle">
        <Button onClick={toggleMobileMenu} icon="isMobileMenuOpen" >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </Button>
      </div>
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


  return (
    <Frame topBar={topBarMarkup}>
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

      <Page title="CodeForces Dashboard">
        <Layout>
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

          <Layout.Section>
            <Card sectioned>
              <div className="graph-container">
                <ContestGraph contests={filteredContests} />
              </div>
            </Card>
          </Layout.Section>
        </Layout>

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