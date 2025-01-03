import { AppProvider } from "@shopify/polaris";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContestDetails from "./pages/ContestDetails";
import NotFound from "./pages/NotFound"; // Optional: Create a NotFound component

function App() {
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
  console.log("Base URL:", baseUrl);

  return (
    <AppProvider i18n={{}}>
      <div className="min-h-screen" style={{ backgroundColor: '#d3f8f8' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contest/:contestId" element={<ContestDetails />} />
            <Route path="*" element={<NotFound />} /> {/* Optional */}
          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

export default App;
