import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../utils/api";
import { formatDate } from "../utils/helpers";
import { Page, Card, BlockStack, Text, Spinner, Layout, Footer } from "@shopify/polaris";
import './styles/ContestPage.css'; // Import the custom CSS file

const ContestPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    fetchContests().then((data) => {
      const contestDetails = data.find((item) => item.id === Number(contestId));
      setContest(contestDetails);
    });
  }, [contestId]);

  if (!contest) {
    return (
      <div className="flex">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <Page title="Codeforces Dashboard">
      <Layout>
        <Layout.Section>
          <Card title="Contest Details" sectioned>
            <BlockStack>
              <h2 className="text-3xl font-semibold text-blue-700 mb-6">{contest.name}</h2>
              <div className="space-y-4 text-gray-700">
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

      <Footer
        primaryAction={{
          content: "Go to Contests",
          url: "/contests", // Replace with your contest listing page URL
        }}
      >
        <div className="text-center py-6">
          <p>&copy; 2025 Codeforces Dashboard. All rights reserved.</p>
        </div>
      </Footer>
    </Page>
  );
};

export default ContestPage;
