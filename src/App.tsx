import "./App.css";
import { Navbar } from "@/components/navbar/navbar";
import { AppRoutes } from "./routes/routes";

function App() {
  return (
    <>
      <div className="bg-beige">
        <Navbar />
        <div className="flex flex-col mx-10 gap-y-8">
          <AppRoutes />
        </div>
      </div>
    </>
  );
}

export default App;
