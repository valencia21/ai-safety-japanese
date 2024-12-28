import { AppRoutes } from "./routes/routes";
import { AuthProvider } from './context/AuthContext';
import { initializeProject } from "./supabase-client";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    initializeProject();
  }, []);

  return (
    <AuthProvider>
      <div className="bg-white">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
