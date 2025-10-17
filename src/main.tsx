import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // keep this as JSX if your App file is in JSX
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
