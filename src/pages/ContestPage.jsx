import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../utils/api"; // Function to fetch contests data
import { formatDate } from "../utils/helpers"; // Helper function to format date
import { Page, Card, BlockStack, Text, Spinner, Layout, Footer } from "@shopify/polaris"; // Polaris components
import './styles/ContestPage.css'; // Import custom CSS for styling

/**
 * ContestPage Component
 * Displays detailed information about a specific contest
 * The contest is identified by its ID, retrieved from the URL params.
 */
const ContestPage = () => {
  // Extract contestId from the URL using useParams hook
  const { contestId } = useParams();
  const [contest, setContest] = useState(null); // State to hold contest details

  /**
   * Fetch contest data when the component mounts or the contestId changes.
   */
  useEffect(() => {
    fetchContests().then((data) => {
      // Find the contest details that match the contestId
      const contestDetails = data.find((item) => item.id === Number(contestId));
      setContest(contestDetails); // Update the state with the contest data
    });
  }, [contestId]); // Re-run the effect when contestId changes

  // Show a spinner while the contest data is being fetched
  if (!contest) {
    return (
      <div className="flex">
        <Spinner size="large" /> {/* Spinner component from Polaris */}
      </div>
    );
  }

  // Render contest details once the data is available
  return (
    <Page title="Codeforces Dashboard">
      <Layout>
        <Layout.Section>
          <Card title="Contest Details" sectioned>
            <BlockStack>
              {/* Contest name displayed as a large heading */}
              <h2 className="text-3xl font-semibold text-blue-700 mb-6">{contest.name}</h2>
              
              <div className="space-y-4 text-gray-700">
                {/* Contest type */}
                <p>
                  <Text variation="strong" className="text-blue-600">Type:</Text> {contest.type}
                </p>
                
                {/* Contest phase */}
                <p>
                  <Text variation="strong" className="text-blue-600">Phase:</Text> {contest.phase}
                </p>
                
                {/* Formatted contest start time */}
                <p>
                  <Text variation="strong" className="text-blue-600">Start Time:</Text> {formatDate(contest.startTimeSeconds)}
                </p>
                
                {/* Contest duration in hours */}
                <p>
                  <Text variation="strong" className="text-blue-600">Duration:</Text> {contest.durationSeconds / 3600} hours
                </p>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Footer with a link to the contest listing page */}
      <Footer
        primaryAction={{
          content: "Go to Contests", // Button text
          url: "/contests", // URL to navigate to contest listing page
        }}
      >
        {/* Footer content */}
        <div className="text-center py-6">
          <p>&copy; 2025 Codeforces Dashboard. All rights reserved.</p>
        </div>
      </Footer>
    </Page>
  );
};

export default ContestPage;
