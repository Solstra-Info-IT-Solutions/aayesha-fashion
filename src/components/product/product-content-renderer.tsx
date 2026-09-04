"use client";

import type {
  ProductContent,
  ProductContentBlock,
} from "@/types/product";

interface ProductContentRendererProps {
  content: ProductContent;
}

export function ProductContentRenderer({
  content,
}: ProductContentRendererProps) {
  if (content.descriptionFormat === "html" && content.richContent) {
    return (
      <div
        className="product-rich-content text-sm leading-7 text-[var(--color-text-secondary)]"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(content.richContent),
        }}
      />
    );
  }

  if (content.descriptionFormat === "rich" && content.richContent) {
    return (
      <RichBlocks
        blocks={
          typeof content.richContent === "string"
            ? []
            : content.richContent
        }
      />
    );
  }

  return (
    <div className="space-y-5 text-sm leading-7 text-[var(--color-text-secondary)]">
      {content.description && <p>{content.description}</p>}

      {content.highlights?.length ? (
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Highlights
          </p>

          <ul className="space-y-2">
            {content.highlights.map((item) => (
              <li
                key={item}
                className="relative pl-4"
              >
                <span className="absolute left-0 top-[11px] h-1 w-1 rounded-full bg-[var(--color-rose)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {content.stylingNotes && (
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-charcoal)]">
            Styling Notes
          </p>

          <p>{content.stylingNotes}</p>
        </div>
      )}
    </div>
  );
}

function RichBlocks({
  blocks,
}: {
  blocks: ProductContentBlock[];
}) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h3
                key={index}
                className="font-[var(--font-cormorant)] text-2xl text-[var(--color-charcoal)]"
              >
                {block.content}
              </h3>
            );

          case "paragraph":
            return (
              <p
                key={index}
                className="text-sm leading-7 text-[var(--color-text-secondary)]"
              >
                {block.content}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-[var(--color-rose)] pl-5 font-[var(--font-cormorant)] text-xl italic leading-7 text-[var(--color-charcoal)]"
              >
                {block.content}
              </blockquote>
            );

          case "list":
            return (
              <ul
                key={index}
                className="space-y-2 text-sm leading-6 text-[var(--color-text-secondary)]"
              >
                {(Array.isArray(block.content)
                  ? block.content
                  : [block.content]
                ).map((item) => (
                  <li
                    key={item}
                    className="relative pl-4"
                  >
                    <span className="absolute left-0 top-3 h-1 w-1 rounded-full bg-[var(--color-rose)]" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "divider":
            return (
              <div
                key={index}
                className="h-px bg-[var(--color-border)]"
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Lightweight defensive HTML sanitization.
 * For production-grade CMS HTML, replacing this with DOMPurify
 * is recommended.
 */
function sanitizeHtml(html: string) {
  if (typeof window === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  document
    .querySelectorAll(
      "script, iframe, object, embed, form, input, textarea, button",
    )
    .forEach((node) => node.remove());

  document.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (
        attribute.name.toLowerCase().startsWith("on") ||
        attribute.value.toLowerCase().includes("javascript:")
      ) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}