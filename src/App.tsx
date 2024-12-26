import { Navbar } from "@/components/navbar/navbar";
import { AppRoutes } from "./routes/routes";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="bg-white">
        <Navbar />
        <div className="flex flex-col gap-y-8 items-center">
          <AppRoutes />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
