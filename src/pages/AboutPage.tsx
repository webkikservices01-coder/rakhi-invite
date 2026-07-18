import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/site/InfoPageLayout";
import { COMPANY } from "@/data/company";

export default function AboutPage() {
  return (
    <InfoPageLayout title="About Us" subtitle={`The story behind ${COMPANY.brand}.`}>
      <p>
        {COMPANY.brand} is built and operated by <strong>{COMPANY.name}</strong>, a Delhi-based digital
        services company. We design premium, ready-to-personalise Raksha Bandhan invite cards that let
        every brother and sister create and share a heartfelt digital rakhi card in minutes — no design
        skills required.
      </p>

      <h2>What We Do</h2>
      <p>
        Our platform offers three tiers of Rakhi templates — <strong>Silver</strong>, <strong>Gold</strong>,
        and <strong>Platinum</strong> — ranging from simple one-page cards to cinematic, multi-page
        experiences with music, photo uploads, and an AI-powered chat assistant that helps you customise
        your card in real time. Every card is editable directly in the browser and can be shared with a
        single link.
      </p>

      <h2>Our Mission</h2>
      <p>
        Raksha Bandhan is about connection — and increasingly, that connection is digital-first, across
        cities and countries. We built {COMPANY.brand} to make that digital celebration feel as warm,
        personal, and premium as the festival itself, blending Indian craft aesthetics with modern web
        technology.
      </p>

      <h2>Why Choose Us</h2>
      <ul>
        <li>Handcrafted templates inspired by real Indian family photography and festive art.</li>
        <li>Instant, secure one-time payments for Gold and Platinum tiers via Cashfree.</li>
        <li>No account or app download needed — everything works in your browser.</li>
        <li>Transparent pricing, clear policies, and responsive human support.</li>
      </ul>

      <h2>Get in Touch</h2>
      <p>
        Have a question, feedback, or a business enquiry? Visit our{" "}
        <Link to="/contact">Contact Us</Link> page — we'd love to hear from you.
      </p>
    </InfoPageLayout>
  );
}
