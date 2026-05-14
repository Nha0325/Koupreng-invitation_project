import { MotionConfig } from "framer-motion";
import { useLenis } from "./shared/hooks/useLenis";
import { usePrefersReducedMotion } from "./shared/hooks/usePrefersReducedMotion";
import { AuthProvider } from "./shared/AuthContext";
import AppRoutes from "./routes";

const App = () => {
  useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionConfig
      reducedMotion="user"
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
    >
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MotionConfig>
  );
};

export default App;
