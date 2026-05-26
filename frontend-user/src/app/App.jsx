import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";
import AppRouter from "./router";
import ScrollToTop from "./ScrollToTop";
import Toaster from "../shared/ui/Toaster";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <ScrollToTop />
                    <div className="app-container">
                        <AppRouter />
                        <Toaster />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
