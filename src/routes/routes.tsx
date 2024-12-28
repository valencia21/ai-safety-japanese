// src/Routes.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ContentPage from "../pages/content-page/content-page";
import { HomePage } from "../pages/home/index";
import { Navbar } from "../components/navbar/navbar";

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="flex flex-col gap-y-8 items-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:contentId" element={<ContentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};
