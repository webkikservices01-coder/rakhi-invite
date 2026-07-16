import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gold-shine">404</h1>
        <h2 className="mt-4 text-2xl font-display text-foreground">Ye page kho gaya</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Jis page ki aap talaash kar rahe hain, wo yahaan nahi hai.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-maroon-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105">
            Ghar chalein
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display text-foreground">Kuch galat ho gaya</h1>
        <p className="mt-2 text-sm text-muted-foreground">Refresh karke phir se try karein.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rakhi Vibes — 60+ Premium Raksha Bandhan Templates | Silver Gold Platinum" },
      { name: "description", content: "Choose from 60+ luxury Rakhi templates with music, AI chatbot, voice control, real Indian family visuals. Silver, Gold aur Platinum tiers." },
      { name: "author", content: "Rakhi Vibes" },
      { property: "og:title", content: "Rakhi Vibes — 60+ Premium Raksha Bandhan Templates | Silver Gold Platinum" },
      { property: "og:description", content: "Choose from 60+ luxury Rakhi templates with music, AI chatbot, voice control, real Indian family visuals. Silver, Gold aur Platinum tiers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rakhi Vibes — 60+ Premium Raksha Bandhan Templates | Silver Gold Platinum" },
      { name: "twitter:description", content: "Choose from 60+ luxury Rakhi templates with music, AI chatbot, voice control, real Indian family visuals. Silver, Gold aur Platinum tiers." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700;900&family=Dancing+Script:wght@500;700&family=Tiro+Devanagari+Hindi&family=Rozha+One&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
