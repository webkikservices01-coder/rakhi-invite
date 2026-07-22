import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/verticals/wedding/components/site/WeddingInfoPageLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";
import { COMPANY } from "@/verticals/wedding/data/company";
import { TIER_PRICE } from "@/verticals/wedding/lib/payment";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "What is Dream Wedding?",
    a: "Dream Wedding is a digital wedding invitation platform. Pick a template, personalise it with your names, dates, venue, photos and story, then share it with a single link — no design skills or app download needed.",
  },
  {
    q: "What's the difference between Silver, Gold, and Platinum?",
    a: (
      <>
        Silver is free — elegant single-page invitations with a countdown, venue
        map and photo gallery. Gold (₹{TIER_PRICE.gold}) unlocks richer
        templates with background music, a ceremonies grid, and animated
        reveals. Platinum (₹{TIER_PRICE.platinum}) unlocks the full cinematic
        experience — a mandala entry loader, 3D parallax monument hero, live
        chat concierge, and a guest wishes wall.
      </>
    ),
  },
  {
    q: "Do I need to create an account?",
    a: "No. There's no login or account system — your finished invitation is shared via a link, and a fast copy is also kept in your own browser's local storage.",
  },
  {
    q: "How do I pay for Gold or Platinum?",
    a: "Payment is a one-time, secure checkout powered by Cashfree Payments (cards, UPI, netbanking, wallets). Once payment is verified, your chosen tier unlocks instantly and you can deploy/share your invitation.",
  },
  {
    q: "Is my payment information safe?",
    a: "Yes. Your payment is processed entirely by Cashfree — we never see or store your card or UPI details.",
  },
  {
    q: "My payment went through but the tier didn't unlock. What do I do?",
    a: (
      <>
        This is rare, but sorry if it happened! Contact us via the{" "}
        <Link to="/wedding/contact">Contact Us</Link> page or WhatsApp with your payment
        reference and we'll resolve it — see our{" "}
        <Link to="/wedding/refund-policy">Refund Policy</Link> for details.
      </>
    ),
  },
  {
    q: "Can I get a refund after unlocking a template?",
    a: (
      <>
        Since unlocks are digital and delivered instantly, refunds are limited
        to failed/duplicate payments — see our full{" "}
        <Link to="/wedding/refund-policy">Refund Policy</Link>.
      </>
    ),
  },
  {
    q: "How does the customize chat work?",
    a: "Our Wedding Assistant chat lets you type your couple names, date, venue, story and more — it fills in your invitation as you talk, and can upload photos, video and music too.",
  },
  {
    q: "Can I upload my own photos, video and music?",
    a: "Yes — every tier supports photo uploads, and templates support uploading your own video and background music alongside the built-in options.",
  },
  {
    q: "How do I share my finished invitation?",
    a: "Once you're happy with your invitation, use the Deploy/Share option to generate a unique link — send it via WhatsApp, SMS, or any messaging app. Anyone with the link can view it, on any device.",
  },
  {
    q: "Who do I contact for support?",
    a: (
      <>
        Reach us anytime via our <Link to="/wedding/contact">Contact Us</Link> page,
        email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, or
        call/WhatsApp {COMPANY.phone} ({COMPANY.hours}).
      </>
    ),
  },
];

export default function FAQPage() {
  useDocumentHead({
    title: `FAQs · ${COMPANY.brand}`,
    description: `Answers to common questions about ${COMPANY.brand}.`,
  });

  return (
    <InfoPageLayout
      title="FAQs"
      subtitle={`Answers to common questions about ${COMPANY.brand}.`}
    >
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger
              className="text-base sm:text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed opacity-80 sm:text-base">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-8">
        Didn't find your answer? Visit our <Link to="/wedding/contact">Contact Us</Link>{" "}
        page and we'll get back to you.
      </p>
    </InfoPageLayout>
  );
}
