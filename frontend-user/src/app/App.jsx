import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";
import { useLenis } from "../shared/hooks/useLenis";
import AppRouter from "./router";

function App() {
    useLenis();

    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="app-container">
                        <AppRouter />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
