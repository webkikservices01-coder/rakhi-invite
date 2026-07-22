import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/verticals/wedding/components/site/WeddingInfoPageLayout";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import { COMPANY } from "@/verticals/wedding/data/company";

export default function AboutPage() {
  useDocumentHead({
    title: `About Us · ${COMPANY.brand}`,
    description: `The story behind ${COMPANY.brand} — premium wedding invitation templates.`,
  });

  return (
    <InfoPageLayout
      title="About Us"
      subtitle={`The story behind ${COMPANY.brand}.`}
    >
      <p>
        {COMPANY.brand} is built and operated by <strong>{COMPANY.name}</strong>
        , a Delhi-based digital services company. We design cinematic,
        ready-to-personalise wedding invitation templates that let couples
        create and share a beautiful digital invitation in minutes — no design
        skills required.
      </p>

      <h2>What We Do</h2>
      <p>
        Our platform offers 65 country-based wedding invitation templates — a
        large India-focused collection alongside UAE, France, USA and Italy
        editions — across <strong>Silver</strong>, <strong>Gold</strong>, and{" "}
        <strong>Platinum</strong> tiers, ranging from elegant single-page
        invites to cinematic, multi-page experiences with music, 3D parallax
        monument backdrops, and an AI-powered chat concierge that helps you
        customise every detail in real time. Every invitation is editable
        directly in the browser and shared with a single link.
      </p>

      <h2>Our Mission</h2>
      <p>
        A wedding invitation is often the first thing your guests see — we built{" "}
        {COMPANY.brand} to make that first impression feel as premium, personal,
        and memorable as the celebration itself, blending destination wedding
        aesthetics with modern web technology.
      </p>

      <h2>Why Choose Us</h2>
      <ul>
        <li>
          Cinematic templates set against real destination landmarks — the Taj,
          Burj Khalifa, Eiffel Tower, Venice canals and more.
        </li>
        <li>
          Instant, secure one-time payments for Gold and Platinum tiers via
          Cashfree.
        </li>
        <li>
          No account or app download needed — everything works in your browser.
        </li>
        <li>
          Transparent pricing, clear policies, and responsive human support.
        </li>
      </ul>

      <h2>Get in Touch</h2>
      <p>
        Have a question, feedback, or a business enquiry? Visit our{" "}
        <Link to="/wedding/contact">Contact Us</Link> page — we'd love to hear from you.
      </p>
    </InfoPageLayout>
  );
}
