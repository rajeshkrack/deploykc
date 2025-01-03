// Favorites.jsx
import React from "react";
import { Button, Card, Text, CalloutCard } from "@shopify/polaris";
import "./styles/Favorites.css"; // Importing the custom CSS file

const Favorites = ({ contests, favorites, onFavoriteToggle }) => {
  const favoriteContests = contests.filter((contest) =>
    favorites.includes(contest.id)
  );

  return (
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
                <Text variation="strong" className="favorite-item-name">
                  {contest.name}
                </Text>
                <Button
                  onClick={() => onFavoriteToggle(contest.id)}
                  destructive
                  accessibilityLabel={`Remove ${contest.name} from favorites`}
                  className="remove-button"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-favorites">
            <CalloutCard
              title="No favorite contests yet"
              illustration="https://cdn.shopify.com/s/files/1/0264/2036/6839/files/empty-state.svg"
              primaryAction={{
                content: "Explore Contests",
                url: "/contests", // Replace with your actual contests page URL
              }}
              className="callout-card"
            >
              <p className="no-favorites-text">
                You haven't added any contests to your favorites yet. Start exploring and add some!
              </p>
            </CalloutCard>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Favorites;
