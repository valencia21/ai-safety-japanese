import { AppRoutes } from "./routes/routes";
import { AuthProvider } from './context/AuthContext';
import { initializeProject } from "./supabase-client";
import { useEffect } from "react";
import { currentProject } from './config/project';

function App() {
  useEffect(() => {
    initializeProject();
    document.documentElement.setAttribute('data-project', currentProject.id);
  }, []);

  return (
    <AuthProvider>
      <div className={currentProject.backgroundColor}>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
