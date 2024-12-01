import "./App.css";
import { Navbar } from "@/components/navbar/navbar";
import { AppRoutes } from "./routes/routes";
import { SidenoteEditorPage } from "./pages/sidenote-editor-page/sidenote-editor-page";

function App() {
  return (
    <>
      <div className="bg-beige">
        <Navbar />
        <div className="flex flex-col gap-y-8 items-center">
          <AppRoutes />
        </div>
      </div>
    </>
  );
}

export default App;
