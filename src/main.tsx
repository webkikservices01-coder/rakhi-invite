import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import CancellationPolicyPage from "@/pages/CancellationPolicyPage";
import { GlobalChrome } from "@/components/site/GlobalChrome";
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalChrome />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
