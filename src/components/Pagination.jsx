import React from "react";
import { Button, Select, Stack, Icon, Text } from "@shopify/polaris";
import { ChevronLeftMinor, ChevronRightMinor } from "@shopify/polaris-icons";
import "./styles/Pagination.css"; // Import custom styles

const Pagination = ({ total, page, perPage, onPageChange, onPerPageChange }) => {
  // Calculate the total number of pages based on total items and items per page
  const totalPages = Math.ceil(total / perPage);

  // Handler for navigating to the previous page
  const handlePrevPage = () => {
    if (page > 1) onPageChange(page - 1);
  };

  // Handler for navigating to the next page
  const handleNextPage = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  // Handler for updating the number of items displayed per page
  const handlePerPageChange = (value) => {
    onPerPageChange(Number(value));
  };

  // Options for items per page dropdown
  const perPageOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ];

  return (
    <div className="pagination-container">
      {/* Use a Stack to align and space pagination elements */}
      <Stack alignment="center" distribution="spaceBetween">
        {/* Pagination Controls */}
        <Stack spacing="tight">
          {/* Button for navigating to the previous page */}
          <Button
            onClick={handlePrevPage}
            disabled={page === 1} // Disable if already on the first page
            icon={<Icon source={ChevronLeftMinor} />}
            plain
            className="pagination-button"
          >
            Previous
          </Button>

          {/* Display the current page and total pages */}
          <Text variation="strong" className="pagination-info">
            Page <span className="highlight">{page}</span> of{" "}
            <span className="highlight">{totalPages}</span>
          </Text>

          {/* Button for navigating to the next page */}
          <Button
            onClick={handleNextPage}
            disabled={page === totalPages} // Disable if already on the last page
            icon={<Icon source={ChevronRightMinor} />}
            plain
            className="pagination-button"
          >
            Next
          </Button>
        </Stack>

        {/* Dropdown for selecting the number of items per page */}
        <Select
          label="Items per page"
          options={perPageOptions} // Provide predefined options
          value={perPage.toString()} // Bind to the current value
          onChange={handlePerPageChange} // Update when selection changes
          className="items-per-page-dropdown"
        />
      </Stack>
    </div>
  );
};

export default Pagination;
