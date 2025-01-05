import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../utils/api";
import { formatDate } from "../utils/helpers";
import { Page, Card, BlockStack, Text, Spinner, Layout, Footer } from "@shopify/polaris";
import './styles/ContestPage.css'; // Importing custom CSS for styling

const ContestPage = () => {
  // Extract contestId from the URL parameters
  const { contestId } = useParams();
  const [contest, setContest] = useState(null); // State to store contest details

  // Fetch contest data when the component mounts or contestId changes
  useEffect(() => {
    fetchContests().then((data) => {
      // Find the contest that matches the contestId from the API data
      const contestDetails = data.find((item) => item.id === Number(contestId));
      setContest(contestDetails); // Set the contest details in the state
    });
  }, [contestId]); // Dependency on contestId to refetch data when it changes

  // If contest data is not available yet, show a loading spinner
  if (!contest) {
    return (
      <div className="flex">
        <Spinner size="large" /> {/* Loading spinner until the contest data is fetched */}
      </div>
    );
  }

  return (
    <Page title="Codeforces Dashboard">
      <Layout>
        <Layout.Section>
          <Card title="Contest Details" sectioned>
            <BlockStack>
              {/* Contest name with larger font size and blue color */}
              <h2 className="text-3xl font-semibold text-blue-700 mb-6">{contest.name}</h2>
              <div className="space-y-4 text-gray-700">
                {/* Displaying contest details such as type, phase, start time, and duration */}
                <p>
                  <Text variation="strong" className="text-blue-600">Type:</Text> {contest.type}
                </p>
                <p>
                  <Text variation="strong" className="text-blue-600">Phase:</Text> {contest.phase}
                </p>
                <p>
                  <Text variation="strong" className="text-blue-600">Start Time:</Text> {formatDate(contest.startTimeSeconds)}
                </p>
                <p>
                  <Text variation="strong" className="text-blue-600">Duration:</Text> {contest.durationSeconds / 3600} hours
                </p>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Footer with a call to action to go back to contests listing */}
      <Footer
        primaryAction={{
          content: "Go to Contests", // Button text for navigation
          url: "/contests", // URL to redirect the user to the contest listing page
        }}
      >
        <div className="text-center py-6">
          <p>&copy; 2025 Codeforces Dashboard. All rights reserved.</p> {/* Footer text */}
        </div>
      </Footer>
    </Page>
  );
};

export default ContestPage;
