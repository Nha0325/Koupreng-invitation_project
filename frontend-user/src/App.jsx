import { MotionConfig } from "framer-motion";
import { useLenis } from "./shared/hooks/useLenis";
import { usePrefersReducedMotion } from "./shared/hooks/usePrefersReducedMotion";
import { AuthProvider } from "./app/auth/AuthContext";
import { ThemeProvider } from "./app/theme/ThemeContext";
import AppRouter from "./app/router";

const App = () => {
  useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Provider order: <MotionConfig> → <ThemeProvider> → <AuthProvider>.
  // Theme is intentionally outside auth so themed loading states (e.g. the
  // unauthed marketing shell or a 401 redirect spinner) still pick up the
  // active light/dark tokens.
  return (
    <MotionConfig
      reducedMotion="user"
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
    >
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>
  );
};

export default App;
