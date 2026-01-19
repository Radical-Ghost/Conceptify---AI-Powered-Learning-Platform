import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Clear any old theme settings from localStorage
localStorage.removeItem("conceptify_theme");
// Remove data-theme attribute if it exists
document.documentElement.removeAttribute("data-theme");

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
);
