import { AppRoutes } from "./routes/routes";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="bg-white">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
