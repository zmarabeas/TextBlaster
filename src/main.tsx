import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create root element
const root = createRoot(document.getElementById("root")!);

// Render the app
root.render(<App />);
