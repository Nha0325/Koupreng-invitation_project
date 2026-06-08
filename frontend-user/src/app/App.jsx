import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import ScrollToTop from "./ScrollToTop";
import SiteAnimations from "../shared/animations/SiteAnimations";
import ChatBot from "../shared/ui/ChatBot";

/**
 * App — root component.
 * No more Context providers needed — auth/theme are Zustand stores now.
 */
function App() {
  return (
    <Router>
      <ScrollToTop />
      <SiteAnimations />
      <div className="app-container">
        <AppRouter />
      </div>
      <ChatBot />
    </Router>
  );
}

export default App;
