import React from "react";
import { TextField, Select, Stack } from "@shopify/polaris";
import { SearchMinor, FilterMinor } from "@shopify/polaris-icons";
import "./styles/SearchBar.css"; // Importing custom CSS for styling the SearchBar component
import '../styles/Dashboard.css'; // Importing additional global styles for consistency

// SearchBar component: Provides a search field and filter dropdown for contests
const SearchBar = ({ value, onSearch, selectedType, onTypeChange }) => {
  // Options for the filter dropdown
  const filterOptions = [
    { label: "All Types", value: "" }, // Default option to show all contests
    { label: "ICPC", value: "ICPC" }, // Option to filter ICPC contests
    { label: "Codeforces", value: "CF" }, // Option to filter Codeforces contests
  ];

  return (
    <div className="searchbar-container">
      {/* Using Polaris Stack for vertical and horizontal alignment */}
      <Stack vertical spacing="loose">
        {/* Inner stack for aligning the search input and filter dropdown */}
        <Stack alignment="center" distribution="equalSpacing" spacing="tight">
          {/* Search Input Section */}
          <div className="relative search-input-container">
            {/* TextField for search input */}
            <TextField
              label="" // No label as the placeholder provides context
              value={value} // Current search input value
              onChange={(newValue) => onSearch(newValue)} // Callback for updating search input value
              placeholder="Search contests by name..." // Placeholder text for guidance
              clearButton // Enables a clear button inside the input
              onClearButtonClick={() => onSearch("")} // Clears the search input when the clear button is clicked
              autoComplete="off" // Disables autocomplete for better user experience
              className="search-input colorful-input" // Custom CSS classes for styling
            />
            {/* Icon for the search input field */}
            <span className="search-icon colorful-icon">
              <SearchMinor /> {/* Polaris search icon */}
            </span>
          </div>

          {/* Filter Dropdown Section */}
          <div className="relative filter-container">
            {/* Select dropdown for filtering contests by type */}
            <Select
              label="" // No label as the placeholder provides context
              options={filterOptions} // Options for the dropdown
              value={selectedType} // Currently selected filter value
              onChange={onTypeChange} // Callback for updating filter value
              placeholder="Filter by Type" // Placeholder text for guidance
              className="filter-select colorful-select" // Custom CSS classes for styling
            />
            {/* Icon for the filter dropdown */}
            <span className="filter-icon colorful-icon">
              <FilterMinor /> {/* Polaris filter icon */}
            </span>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default SearchBar;
