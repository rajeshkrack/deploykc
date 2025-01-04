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
import "./styles/Favorites.css";

const Favorites = ({ contests, favorites, onFavoriteToggle, isModalOpen, toggleModal }) => {
  const favoriteContests = contests.filter((contest) =>
    favorites.includes(contest.id)
  );

  const modalContent = (
    <Modal
      open={isModalOpen}
      onClose={toggleModal}
      title="Your Favorite Contests"
      primaryAction={{
        content: "Close",
        onAction: toggleModal,
      }}
    >
      <Modal.Section>
        {favoriteContests.length > 0 ? (
          <LegacyStack vertical spacing="loose">
            {favoriteContests.map((contest) => (
              <LegacyStack distribution="equalSpacing" alignment="center" key={contest.id}>
                <TextContainer>
                  <Text variant="bodyMd" as="span">
                    {contest.name}
                  </Text>
                </TextContainer>
                <Button
                  onClick={() => onFavoriteToggle(contest.id)}
                  destructive
                  size="slim"
                >
                  Remove
                </Button>
              </LegacyStack>
            ))}
          </LegacyStack>
        ) : (
          <TextContainer>
            <Text variant="bodyMd" as="p" color="subdued">
              No favorite contests added yet. Add some from the contest list!
            </Text>
          </TextContainer>
        )}
      </Modal.Section>
    </Modal>
  );

  // Card view for the dashboard
  const cardContent = (
    <Card title="Favorites" sectioned>
      <div className="favorites-container">
        {favoriteContests.length > 0 ? (
          <div>
            <h3 className="favorites-title">
              Here is your favorite list
            </h3>
            {favoriteContests.map((contest) => (
              <div
                key={contest.id}
                className="favorite-item"
              >
                <Text variant="bodyMd" as="span" className="favorite-item-name">
                  {contest.name}
                </Text>
                <Button
                  onClick={() => onFavoriteToggle(contest.id)}
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
      {modalContent}
      {/* {cardContent} */}
    </>
  );
};

export default Favorites;

