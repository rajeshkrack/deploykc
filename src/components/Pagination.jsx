import React from "react";
import { Button, Select, Stack, Icon, Text } from "@shopify/polaris";
import { ChevronLeftMinor, ChevronRightMinor } from "@shopify/polaris-icons";
import "./styles/Pagination.css"; // Import custom styles

const Pagination = ({ total, page, perPage, onPageChange, onPerPageChange }) => {
  const totalPages = Math.ceil(total / perPage);

  const handlePrevPage = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handlePerPageChange = (value) => {
    onPerPageChange(Number(value));
  };

  const perPageOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ];

  return (
    <div className="pagination-container">
      <Stack alignment="center" distribution="spaceBetween">
        {/* Pagination Controls */}
        <Stack spacing="tight">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            icon={<Icon source={ChevronLeftMinor} />}
            plain
            className="pagination-button"
          >
            Previous
          </Button>

          <Text variation="strong" className="pagination-info">
            Page <span className="highlight">{page}</span> of{" "}
            <span className="highlight">{totalPages}</span>
          </Text>

          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            icon={<Icon source={ChevronRightMinor} />}
            plain
            className="pagination-button"
          >
            Next
          </Button>
        </Stack>

        {/* Items per page dropdown */}
        <Select
          label="Items per page"
          options={perPageOptions}
          value={perPage.toString()}
          onChange={handlePerPageChange}
          className="items-per-page-dropdown"
        />
      </Stack>
    </div>
  );
};

export default Pagination;
