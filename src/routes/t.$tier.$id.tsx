import { createFileRoute, notFound } from "@tanstack/react-router";
import { findTemplate, type Tier } from "@/data/templates";
import { TemplateEngine } from "@/features/template/TemplateEngine";
import { getInvite } from "@/lib/invites.server";
import type { TemplateState } from "@/features/template/useTemplateState";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/t/$tier/$id")({
  head: ({ params }) => {
    const t = findTemplate(params.tier as Tier, params.id);
    if (!t) return { meta: [{ title: "Not found" }] };
    return {
      meta: [
        { title: `${t.name} — ${t.tier.toUpperCase()} · Rakhi Vibes` },
        {
          name: "description",
          content: `${t.tagline}. ${t.tier} Rakhi template.`,
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  loader: async ({ params }) => {
    const t = findTemplate(params.tier as Tier, params.id);
    if (t) return { template: t, locked: false, initialState: undefined };

    if (UUID_RE.test(params.id)) {
      const invite = await getInvite({ data: { id: params.id } });
      if (invite && invite.tier === params.tier) {
        const base = findTemplate(invite.tier, invite.templateId);
        if (base) {
          return {
            template: base,
            locked: true,
            initialState: invite.state as TemplateState,
          };
        }
      }
    }

    throw notFound();
  },
  component: Viewer,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-6xl">Template not found</h1>
        <p className="mt-2 opacity-70">Ye template maujood nahi hai.</p>
      </div>
    </div>
  ),
});

function Viewer() {
  const { template, locked, initialState } = Route.useLoaderData();
  return (
    <TemplateEngine
      template={template}
      locked={locked}
      initialState={initialState}
    />
  );
}
