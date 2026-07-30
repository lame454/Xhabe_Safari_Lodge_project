"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  title: string;
  /** Rendered as a bulleted list when several lines, as a paragraph when one. */
  items: string[];
}

interface Props {
  sections: AccordionItem[];
  /** Index open on first render. Pass null to start fully collapsed. */
  defaultOpen?: number | null;
}

/**
 * Expandable sections for reference content (booking info, FAQs).
 *
 * Uses real buttons with `aria-expanded` / `aria-controls` rather than
 * hover-driven reveals, so it works identically under touch, mouse, and
 * keyboard.
 */
export default function Accordion({ sections, defaultOpen = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-base-dark/10 border-y border-base-dark/10">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={section.title}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 text-left py-5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2"
              >
                <span className="font-display text-lg text-base-dark group-hover:text-accent-amber group-active:text-accent-amber transition-colors duration-200">
                  {section.title}
                </span>
                <Plus
                  aria-hidden="true"
                  className={`w-4 h-4 flex-shrink-0 text-accent-amber transition-transform duration-300 ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                />
              </button>
            </h3>

            {/* Grid-rows transition animates height without needing a measured
                pixel value, and the panel stays in the DOM for find-in-page. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2 pb-6 pr-8">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent-amber mt-2 flex-shrink-0" />
                      <span className="font-body text-sm text-base-dark/75 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
