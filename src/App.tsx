import "./App.css";
import { Navbar } from "@/components/navbar/navbar";
import { AppRoutes } from "./routes/routes";

function App() {
  return (
    <>
      <div className="bg-beige mx-auto">
        <Navbar />
        <div className="flex flex-col gap-y-8 mx-2 items-center">
          <AppRoutes />
        </div>
      </div>
    </>
  );
}

export default App;
