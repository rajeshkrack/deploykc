import React from "react";
import { TextField, Select, Stack } from "@shopify/polaris";
import { SearchMinor, FilterMinor } from "@shopify/polaris-icons";
import "./styles/SearchBar.css"; // Import custom CSS for styling
import '../styles/Dashboard.css'; // Import additional dashboard styles

/**
 * SearchBar Component
 * A reusable component that allows users to search for contests by name and filter by type.
 * Props:
 * - value: Current value of the search input
 * - onSearch: Callback for handling search input changes
 * - selectedType: Currently selected filter type
 * - onTypeChange: Callback for handling filter type changes
 */
const SearchBar = ({ value, onSearch, selectedType, onTypeChange }) => {
  // Options for the filter dropdown
  const filterOptions = [
    { label: "All Types", value: "" }, // Default option for all contest types
    { label: "ICPC", value: "ICPC" }, // Filter for ICPC contests
    { label: "Codeforces", value: "CF" }, // Filter for Codeforces contests
  ];

  return (
    <div className="searchbar-container">
      {/* Use a vertical Stack for layout with loose spacing */}
      <Stack vertical spacing="loose">
        {/* Horizontal Stack for aligning search input and filter dropdown */}
        <Stack alignment="center" distribution="equalSpacing" spacing="tight">
          {/* Search Input Field */}
          <div className="relative search-input-container">
            <TextField
              label="" // No label for simplicity
              value={value} // Bind input value to the current search term
              onChange={(newValue) => onSearch(newValue)} // Handle search input changes
              placeholder="Search contests by name..." // Placeholder text for guidance
              clearButton // Include a clear button for resetting the input
              onClearButtonClick={() => onSearch("")} // Clear input when clear button is clicked
              autoComplete="off" // Disable autocomplete for cleaner input
              className="search-input colorful-input" // Apply custom styles
            />
            {/* Icon to visually indicate the search field */}
            <span className="search-icon colorful-icon">
              <SearchMinor />
            </span>
          </div>

          {/* Filter Dropdown */}
          <div className="relative filter-container">
            <Select
              label="" // No label for simplicity
              options={filterOptions} // Dropdown options for filtering
              value={selectedType} // Bind value to the selected filter type
              onChange={onTypeChange} // Handle changes to the selected type
              placeholder="Filter by Type" // Placeholder text for guidance
              className="filter-select colorful-select" // Apply custom styles
            />
            {/* Icon to visually indicate the filter dropdown */}
            <span className="filter-icon colorful-icon">
              <FilterMinor />
            </span>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default SearchBar;
