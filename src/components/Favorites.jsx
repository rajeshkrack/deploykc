// Favorites.jsx

// Importing necessary libraries and components
import React from "react";
import { Button, Card, Text } from "@shopify/polaris"; // Polaris components for UI design
import "./styles/Favorites.css"; // Importing custom CSS for styling the Favorites component

// The Favorites component displays a list of favorited contests
// Props:
// - contests: An array of all contest objects
// - favorites: An array of favorite contest IDs
// - onFavoriteToggle: A function to handle toggling a contest as favorite
const Favorites = ({ contests, favorites, onFavoriteToggle }) => {
  // Filter the contests array to include only favorited contests
  const favoriteContests = contests.filter((contest) =>
    favorites.includes(contest.id)
  );

  return (
    // Card container for the Favorites section
    <Card title="Favorites" sectioned>
      <div className="favorites-container">
        {/* Check if there are any favorite contests */}
        {favoriteContests.length > 0 ? (
          <div>
            {/* Header for the list of favorite contests */}
            <h3 className="favorites-title">Here is your favorite list</h3>
            {/* Render each favorited contest */}
            {favoriteContests.map((contest) => (
              <div key={contest.id} className="favorite-item">
                {/* Display contest name in bold text */}
                <Text variation="strong" className="favorite-item-name">
                  {contest.name}
                </Text>
                {/* Button to remove the contest from favorites */}
                <Button
                  onClick={() => onFavoriteToggle(contest.id)} // Call the toggle function to remove the contest
                  destructive // Use a destructive style for the remove action
                  accessibilityLabel={`Remove ${contest.name} from favorites`} // Accessibility label for screen readers
                  className="remove-button" // Custom CSS class for styling the button
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          // Message to display when there are no favorites
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

export default Favorites; // Exporting the component for use in other parts of the application
