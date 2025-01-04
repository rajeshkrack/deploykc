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
            <p className="no-favorites-text">
              Add your fav here, no one added yet.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Favorites;
