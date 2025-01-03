import React from "react";
import { TextField, Select, Stack } from "@shopify/polaris";
import { SearchMinor, FilterMinor } from "@shopify/polaris-icons";
import "./styles/SearchBar.css"; // Import custom CSS

const SearchBar = ({ value, onSearch, selectedType, onTypeChange }) => {
  const filterOptions = [
    { label: "All Types", value: "" },
    { label: "ICPC", value: "ICPC" },
    { label: "Codeforces", value: "CF" },
  ];

  return (
    <div className="searchbar-container">
      <Stack vertical spacing="loose">
        <Stack alignment="center" distribution="equalSpacing" spacing="tight">
          {/* Search Input */}
          <div className="relative search-input-container">
            <TextField
              label=""
              value={value}
              onChange={(newValue) => onSearch(newValue)}
              placeholder="Search contests by name..."
              clearButton
              onClearButtonClick={() => onSearch("")}
              autoComplete="off"
              className="search-input"
            />
            <span className="search-icon">
              <SearchMinor />
            </span>
          </div>

          {/* Dropdown Filter */}
          <div className="relative filter-container">
            <Select
              label=""
              options={filterOptions}
              value={selectedType}
              onChange={onTypeChange}
              placeholder="Filter by Type"
              className="filter-select"
            />
            <span className="filter-icon">
              <FilterMinor />
            </span>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default SearchBar;
