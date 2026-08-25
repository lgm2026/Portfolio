import React from "react";
import { createRoot } from "react-dom/client";
import App from "./SecondChance.jsx";

const boot = document.getElementById("boot");
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// remove the boot splash once React has painted
requestAnimationFrame(() => setTimeout(() => boot && boot.remove(), 120));
