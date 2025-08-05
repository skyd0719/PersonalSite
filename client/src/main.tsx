import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";

console.log('Starting app with theme provider...');

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="kun-botond-theme">
    <App />
  </ThemeProvider>
);
