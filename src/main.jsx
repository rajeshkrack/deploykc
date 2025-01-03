import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "@shopify/polaris";
import { BrowserRouter as Router } from "react-router-dom";
import "@shopify/polaris/build/esm/styles.css";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <Router>
      <App />
    </Router>
  </AppProvider>
);
