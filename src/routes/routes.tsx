// src/Routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContentPage from "../pages/content-page/content-page";
import { SessionInformation } from "../components/session-information/session-information";

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SessionInformation />} />
        <Route path="/:contentId" element={<ContentPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};
