/**
 * កំណត់ចំណាំ: AuthProvider + ThemeProvider
 * ឯកសារ: src/app/providers.jsx
 * ចាស់: <AuthProvider> ក្នុង App.jsx
 */
import { AuthProvider } from "./auth/AuthContext"; // ចាស់: ./context/AuthContext
import { ThemeProvider } from "./theme/ThemeContext";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
