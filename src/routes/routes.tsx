// src/Routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContentPage from "../pages/content-page/content-page";
import { SessionInformation } from "../components/session-information/session-information";
import { Navbar } from "../components/navbar/navbar";

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="flex flex-col gap-y-8 items-center">
        <Routes>
          <Route path="/" element={<SessionInformation />} />
          <Route path="/:contentId" element={<ContentPage />} />
        </Routes>
      </div>
    </Router>
  );
};
