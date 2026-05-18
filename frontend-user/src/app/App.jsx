/**
 * កំណត់ចំណាំ: កុំព្យូទ័រដើម
 * ឯកសារ: src/app/App.jsx
 * ចាស់: src/App.jsx (Router + AnimatedRoutes + Providers)
 */
import { BrowserRouter as Router } from "react-router-dom";
import { useLenis } from "../shared/hooks/useLenis"; // ចាស់: ./hooks/useLenis
import { AppProviders } from "./providers"; // ចាស់: AuthProvider ពី ./context/AuthContext
import AppRouter from "./router"; // ចាស់: AnimatedRoutes + Routes ក្នុងឯកសារនេះ

export default function App() {
  useLenis(); // សម្រាប់ Smooth Scrolling

  return (
    <AppProviders>
      <Router>
        <div className="app-container">
          <AppRouter />
        </div>
      </Router>
    </AppProviders>
  );
}
