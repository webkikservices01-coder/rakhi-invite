import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/silver" element={<App tier="silver" />} />
        <Route path="/gold" element={<App tier="gold" />} />
        <Route path="/platinum" element={<App tier="platinum" />} />
        <Route path="/t/:tier/:id" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
