import { useEffect } from "react";

type HeadOptions = {
  title: string;
  description?: string;
  og?: { title?: string; description?: string; image?: string };
  noindex?: boolean;
};

function upsertMeta(selector: string, build: () => HTMLMetaElement) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = build();
    document.head.appendChild(el);
  }
  return el;
}

/** Per-page <title>/meta, replacing TanStack Router's route-level `head()`. */
export function useDocumentHead({
  title,
  description,
  og,
  noindex,
}: HeadOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    if (description) {
      const meta = upsertMeta('meta[name="description"]', () => {
        const el = document.createElement("meta");
        el.name = "description";
        return el;
      });
      meta.content = description;
    }

    const ogTitle = og?.title ?? title;
    const ogTitleMeta = upsertMeta('meta[property="og:title"]', () => {
      const el = document.createElement("meta");
      el.setAttribute("property", "og:title");
      return el;
    });
    ogTitleMeta.content = ogTitle;

    if (og?.description ?? description) {
      const ogDescMeta = upsertMeta('meta[property="og:description"]', () => {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:description");
        return el;
      });
      ogDescMeta.content = og?.description ?? description ?? "";
    }

    if (og?.image) {
      const ogImageMeta = upsertMeta('meta[property="og:image"]', () => {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:image");
        return el;
      });
      ogImageMeta.content = og.image;
    }

    let robotsMeta: HTMLMetaElement | null = null;
    if (noindex) {
      robotsMeta = upsertMeta('meta[name="robots"]', () => {
        const el = document.createElement("meta");
        el.name = "robots";
        return el;
      });
      robotsMeta.content = "noindex";
    }

    return () => {
      document.title = previousTitle;
      if (robotsMeta) robotsMeta.remove();
    };
  }, [title, description, og?.title, og?.description, og?.image, noindex]);
}
