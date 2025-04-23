import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { configureAmplify } from './services/auth/amplifyConfig';

// Configure Amplify before rendering the app
configureAmplify();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root element not found");
}