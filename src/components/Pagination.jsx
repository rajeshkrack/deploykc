import React from "react";
import { Button, Select, Stack, Icon, Text } from "@shopify/polaris";
import { ChevronLeftMinor, ChevronRightMinor } from "@shopify/polaris-icons";
import "./styles/Pagination.css"; // Import custom styles for pagination component

// Pagination component: Handles navigation between pages and controls items per page
const Pagination = ({ total, page, perPage, onPageChange, onPerPageChange }) => {
  // Calculate the total number of pages based on total items and items per page
  const totalPages = Math.ceil(total / perPage);

  // Handle click on "Previous" button
  const handlePrevPage = () => {
    if (page > 1) onPageChange(page - 1); // Navigate to the previous page if not on the first page
  };

  // Handle click on "Next" button
  const handleNextPage = () => {
    if (page < totalPages) onPageChange(page + 1); // Navigate to the next page if not on the last page
  };

  // Handle change in "Items per page" dropdown
  const handlePerPageChange = (value) => {
    onPerPageChange(Number(value)); // Update the number of items per page
  };

  // Options for the "Items per page" dropdown
  const perPageOptions = [
    { label: "10", value: "10" }, // Show 10 items per page
    { label: "20", value: "20" }, // Show 20 items per page
    { label: "50", value: "50" }, // Show 50 items per page
  ];

  return (
    <div className="pagination-container">
      {/* Use Polaris Stack for alignment and spacing */}
      <Stack alignment="center" distribution="spaceBetween">
        {/* Pagination Controls (Previous, Page Info, Next) */}
        <Stack spacing="tight">
          {/* "Previous" button */}
          <Button
            onClick={handlePrevPage} // Navigate to previous page on click
            disabled={page === 1} // Disable if on the first page
            icon={<Icon source={ChevronLeftMinor} />} // Chevron left icon
            plain // Style the button with no border
            className="pagination-button"
          >
            Previous
          </Button>

          {/* Display current page and total pages */}
          <Text variation="strong" className="pagination-info">
            Page <span className="highlight">{page}</span> of{" "}
            <span className="highlight">{totalPages}</span>
          </Text>

          {/* "Next" button */}
          <Button
            onClick={handleNextPage} // Navigate to next page on click
            disabled={page === totalPages} // Disable if on the last page
            icon={<Icon source={ChevronRightMinor} />} // Chevron right icon
            plain // Style the button with no border
            className="pagination-button"
          >
            Next
          </Button>
        </Stack>

        {/* Dropdown for selecting items per page */}
        <Select
          label="Items per page" // Label for the dropdown
          options={perPageOptions} // Options for items per page
          value={perPage.toString()} // Currently selected value
          onChange={handlePerPageChange} // Callback when the value changes
          className="items-per-page-dropdown"
        />
      </Stack>
    </div>
  );
};

export default Pagination;
