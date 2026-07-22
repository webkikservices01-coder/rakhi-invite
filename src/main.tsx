import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import WeddingApp from "@/verticals/wedding/App";
import ChooserHome from "@/pages/ChooserHome";
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
        <Route path="/" element={<ChooserHome />} />
        <Route path="/rakhi" element={<App />} />
        <Route path="/rakhi/silver" element={<App tier="silver" />} />
        <Route path="/rakhi/gold" element={<App tier="gold" />} />
        <Route path="/rakhi/platinum" element={<App tier="platinum" />} />
        <Route path="/rakhi/t/:tier/:id" element={<App />} />
        <Route path="/rakhi/about" element={<AboutPage />} />
        <Route path="/rakhi/contact" element={<ContactPage />} />
        <Route path="/rakhi/faqs" element={<FAQPage />} />
        <Route path="/rakhi/terms" element={<TermsPage />} />
        <Route path="/rakhi/privacy" element={<PrivacyPage />} />
        <Route path="/rakhi/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/rakhi/cancellation-policy" element={<CancellationPolicyPage />} />
        <Route path="/wedding/*" element={<WeddingApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalChrome />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
