import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { InfoPageLayout } from "@/components/site/InfoPageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { COMPANY } from "@/data/company";
import { TIER_PRICE } from "@/data/pricing";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "What is Rakhi Vibes?",
    a: "Rakhi Vibes is a digital Raksha Bandhan invite card platform. Pick a template, personalise it with names, photos, and messages, then share it with a single link — no design skills or app download needed.",
  },
  {
    q: "What's the difference between Silver, Gold, and Platinum?",
    a: (
      <>
        Silver is free — 10 simple, elegant one-page cards. Gold (₹{TIER_PRICE.gold}) unlocks 18 richer,
        2–3 page templates with a music player and photo uploads. Platinum (₹{TIER_PRICE.platinum})
        unlocks 32 cinematic, 3–5 page templates with everything in Gold plus an AI chatbot, voice
        control, and unlimited photos.
      </>
    ),
  },
  {
    q: "Do I need to create an account?",
    a: "No. There's no login or account system — your card edits are saved to your own browser's local storage, and your finished card is shared via a link.",
  },
  {
    q: "How do I pay for Gold or Platinum?",
    a: "Payment is a one-time, secure checkout powered by Cashfree Payments (cards, UPI, netbanking, wallets). Once payment is verified, your chosen tier unlocks instantly in your browser.",
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
        <Link to="/contact">Contact Us</Link> page or WhatsApp with your payment reference and we'll
        resolve it — see our <Link to="/refund-policy">Refund Policy</Link> for details.
      </>
    ),
  },
  {
    q: "Can I get a refund after unlocking a template?",
    a: (
      <>
        Since unlocks are digital and delivered instantly, refunds are limited to failed/duplicate
        payments — see our full <Link to="/refund-policy">Refund Policy</Link>.
      </>
    ),
  },
  {
    q: "What happens if I clear my browser data?",
    a: "Your card edits and unlock status are stored in your browser's local storage. Clearing site data or switching devices/browsers will remove them, so make sure to copy your shareable link once your card is ready.",
  },
  {
    q: "How does the AI chatbot work?",
    a: "On Platinum templates, you can type or speak requests like \"make the background pink\" or \"write a poem\" and the AI assistant (\"Marvels\") updates your card accordingly. If the AI service is briefly unavailable, it automatically falls back to a built-in assistant so it keeps working.",
  },
  {
    q: "Can I upload my own photos and music?",
    a: "Yes — Gold and Platinum templates support photo uploads, and several templates support uploading your own song alongside the built-in Bollywood track picks.",
  },
  {
    q: "How do I share my finished card?",
    a: "Once you're happy with your card, use the Deploy/Share option to generate a unique link — send it via WhatsApp, SMS, or any messaging app.",
  },
  {
    q: "Who do I contact for support?",
    a: (
      <>
        Reach us anytime via our <Link to="/contact">Contact Us</Link> page, email{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, or call/WhatsApp {COMPANY.phone} ({COMPANY.hours}).
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <InfoPageLayout title="FAQs" subtitle="Answers to common questions about Rakhi Vibes.">
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="font-display text-base sm:text-lg">{item.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed opacity-80 sm:text-base">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-8">
        Didn't find your answer? Visit our <Link to="/contact">Contact Us</Link> page and we'll get back
        to you.
      </p>
    </InfoPageLayout>
  );
}
