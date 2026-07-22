import { Link, useParams } from "react-router-dom";
import { getTemplate } from "@/verticals/wedding/data/templates";
import { TemplateInvite } from "@/verticals/wedding/components/wedding/TemplateInvite";
import { useDocumentHead } from "@/verticals/wedding/lib/use-document-head";

function TemplateNotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Template not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The slug you followed doesn't match any template.
        </p>
        <Link
          to="/wedding/templates"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground"
        >
          Browse all
        </Link>
      </div>
    </div>
  );
}

export default function TemplatePreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const template = slug ? getTemplate(slug) : undefined;

  useDocumentHead(
    template
      ? {
          title: `${template.name} · ${template.countryLabel} ${template.tier} Wedding Template`,
          description: `${template.tagline}. A ${template.tier} tier wedding invitation template for ${template.countryLabel}.`,
          og: {
            title: `${template.name} · Dream Wedding`,
            description: template.tagline,
            image: template.hero,
          },
        }
      : { title: "Template not found · Dream Wedding", noindex: true },
  );

  if (!template) {
    return <TemplateNotFound />;
  }

  return (
    <div className="relative">
      {/* Floating back / info bar — positioned below the internal template nav */}
      <div className="fixed left-1/2 top-20 z-[80] flex -translate-x-1/2 items-center gap-2">
        <Link
          to="/wedding/templates"
          className="rounded-full bg-black/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur-md transition hover:bg-black/80"
          style={{ fontFamily: "var(--font-label)" }}
        >
          ← All Templates
        </Link>
        <span
          className="rounded-full bg-black/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur-md"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {template.countryLabel} · {template.tier}
        </span>
      </div>
      <TemplateInvite template={template} />
    </div>
  );
}
