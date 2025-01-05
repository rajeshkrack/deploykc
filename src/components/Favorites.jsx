import React from "react";
import { 
  Button, 
  Card, 
  Text, 
  Modal, 
  LegacyStack,
  Icon,
  TextContainer
} from "@shopify/polaris";
// import { StarFilledMinor } from '@shopify/polaris-icons';
import "./styles/Favorites.css"; // Import custom styles for the Favorites component

const Favorites = ({ contests, favorites, onFavoriteToggle, isModalOpen, toggleModal }) => {
  // Filter the contests array to get the contests that are in the favorites list
  const favoriteContests = contests.filter((contest) =>
    favorites.includes(contest.id)
  );

  // Modal content that displays the list of favorite contests
  const modalContent = (
    <Modal
      open={isModalOpen} // Modal visibility
      onClose={toggleModal} // Close the modal when toggled
      title="Your Favorite Contests" // Title of the modal
      primaryAction={{
        content: "Close", // Primary action button with "Close" text
        onAction: toggleModal, // Toggle modal close action
      }}
    >
      <Modal.Section>
        {/* If there are favorite contests, display them */}
        {favoriteContests.length > 0 ? (
          <LegacyStack vertical spacing="loose"> {/* Stack for vertical layout */}
            {favoriteContests.map((contest) => (
              <LegacyStack distribution="equalSpacing" alignment="center" key={contest.id}> {/* Each favorite contest item */}
                <TextContainer>
                  <Text variant="bodyMd" as="span"> {/* Contest name */}
                    {contest.name}
                  </Text>
                </TextContainer>
                {/* Button to remove contest from favorites */}
                <Button
                  onClick={() => onFavoriteToggle(contest.id)} // On click, toggle favorite status
                  destructive
                  size="slim"
                >
                  Remove
                </Button>
              </LegacyStack>
            ))}
          </LegacyStack>
        ) : (
          // If there are no favorite contests, display a message
          <TextContainer>
            <Text variant="bodyMd" as="p" color="subdued">
              No favorite contests added yet. Add some from the contest list!
            </Text>
          </TextContainer>
        )}
      </Modal.Section>
    </Modal>
  );

  // Card view to display the favorites on the dashboard
  const cardContent = (
    <Card title="Favorites" sectioned> {/* Card component to display the favorites */}
      <div className="favorites-container">
        {/* If there are favorite contests, display them */}
        {favoriteContests.length > 0 ? (
          <div>
            <h3 className="favorites-title"> {/* Title for favorites list */}
              Here is your favorite list
            </h3>
            {/* Display each favorite contest */}
            {favoriteContests.map((contest) => (
              <div
                key={contest.id}
                className="favorite-item"
              >
                <Text variant="bodyMd" as="span" className="favorite-item-name">
                  {contest.name} {/* Contest name */}
                </Text>
                {/* Button to remove contest from favorites */}
                <Button
                  onClick={() => onFavoriteToggle(contest.id)} // On click, toggle favorite status
                  destructive
                  size="slim"
                  className="remove-button"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          // If no favorites are added, display a message
          <div className="no-favorites">
            <p className="no-favorites-text">
              Add your fav here, no one added yet.
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <>
      {modalContent} {/* Render the modal */}
      {/* {cardContent} */} {/* Render the card content (currently commented out) */}
    </>
  );
};

export default Favorites;
