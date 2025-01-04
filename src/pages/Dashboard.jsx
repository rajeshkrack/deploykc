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
  Icon,
  Modal,
} from "@shopify/polaris";
// import { SearchMinor, FilterMinor, StarFilledMinor } from '@shopify/polaris-icons';
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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            {
              content: "Settings",
              onAction: () => console.log("Settings clicked"),
            },
          ],
        },
      ]}
      name="Admin"
      initials="A"
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearch}
      value={searchQuery}
      placeholder="Search contests..."
    />
  );

  


  const titleMarkup = (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#000",
      }}
    >
      <span style={{ marginRight: "5px" }}>Code</span>
      <span style={{ marginRight: "5px" }}>Forces</span>
      <span>Dashboard</span>
    </div>
  );

  const topBarMarkup = (
    <div style={{ position: "relative" }}>
      <TopBar
        showNavigationToggle
        userMenu={userMenuMarkup}
        searchField={searchFieldMarkup}
        secondaryMenu={ <div 
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
           // Ensure it takes the full height of the TopBar
          }}>
        <Button onClick={toggleFilterModal} icon="FilterMinor">
          Filter
        </Button>
        <Button
          onClick={toggleModal}
          icon={<Icon name="StarFilledMinor" />}
          className="favorites-button"
        >
          Favorites ({favorites.length})
        </Button>
      </div>}
      />
      {titleMarkup}
    </div>
  );

  return (
    <Frame topBar={topBarMarkup}>
      {/* <TopBar
  showNavigationToggle
  userMenu={ userMenuMarkup }
  searchField={searchFieldMarkup}
  secondaryMenu={
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
       // Ensure it takes the full height of the TopBar
      }}
    >
      <Button onClick={toggleFilterModal} icon="FilterMinor">
        Filter
      </Button>
      <Button
        onClick={toggleModal}
        icon={<Icon source="StarFilledMinor" />}
        className="favorites-button"
      >
        Favorites ({favorites.length})
      </Button>
    </div>
  }
>
  <div className="topbar-title" style={{ textAlign: "center", width: "100%" }}>
    <span className="code">Code</span>
    <span className="forces">forces</span>
    <span className="dashboard">Dashboard</span>
  </div>
</TopBar> */}


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

      <Page>
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
                    contests={paginatedData}
                    favorites={favorites}
                    onFavoriteToggle={handleFavorite}
                  />
                )}
              </Card>
            </div>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned>
              <div className="pagination-container">
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>

                <div className="pagination-info">
                  Page {page} of {Math.ceil(filteredContests.length / perPage)}
                </div>

                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={
                    page === Math.ceil(filteredContests.length / perPage)
                  }
                >
                  Next
                </Button>
              </div>

              <div className="items-per-page">
                <Select
                  label="Items per page"
                  options={[
                    { label: "10", value: 10 },
                    { label: "20", value: 20 },
                    { label: "50", value: 50 },
                  ]}
                  onChange={(value) => setPerPage(Number(value))}
                  value={perPage}
                />
              </div>
            </Card>
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
