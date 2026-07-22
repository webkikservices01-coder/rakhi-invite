import { Component, type ReactNode } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { RouteProgress } from "@/verticals/wedding/components/site/RouteProgress";
import { reportLovableError } from "@/lib/lovable-error-reporting";

import Home from "@/verticals/wedding/routes/index";
import TemplatesPage from "@/verticals/wedding/routes/templates.index";
import TemplatePreviewPage from "@/verticals/wedding/routes/templates.$slug";
import PricingPage from "@/verticals/wedding/routes/pricing";
import DeployedInvitePage from "@/verticals/wedding/routes/invite.$id";
import AboutPage from "@/verticals/wedding/routes/about";
import ContactPage from "@/verticals/wedding/routes/contact";
import FAQPage from "@/verticals/wedding/routes/faqs";
import TermsPage from "@/verticals/wedding/routes/terms";
import PrivacyPage from "@/verticals/wedding/routes/privacy-policy";
import RefundPolicyPage from "@/verticals/wedding/routes/refund-policy";
import CancellationPolicyPage from "@/verticals/wedding/routes/cancellation-policy";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The invitation you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/wedding"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              reset();
              navigate(0);
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/wedding"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    reportLovableError(error, { boundary: "app_error_boundary" });
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          reset={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}

export default function WeddingApp() {
  return (
    <ErrorBoundary>
      <div data-vertical="wedding">
        <RouteProgress />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:slug" element={<TemplatePreviewPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="invite/:id" element={<DeployedInvitePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faqs" element={<FAQPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy-policy" element={<PrivacyPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route
            path="cancellation-policy"
            element={<CancellationPolicyPage />}
          />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}
