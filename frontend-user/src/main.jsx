/**
 * កំណត់ចំណាំ: ចំណុចចូល React — mount App
 * ឯកសារ: src/main.jsx
 * ចាស់: ./App.jsx → ./app/App.jsx
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
