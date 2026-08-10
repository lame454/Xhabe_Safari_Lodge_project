import Image from "next/image";

/**
 * A translucent panel that floats above whatever sits behind it.
 *
 * `tone` picks the material: `light` for glass over pale surfaces, `dark` for
 * glass over photography where the plate has to carry white text.
 */
export function GlassPanel({
  children,
  tone = "light",
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`${tone === "dark" ? "glass-dark" : "glass"} rounded-glass ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * A photograph with a glass caption plate resting on it.
 *
 * The scrim is a gradient rather than a flat tint so the image stays visible
 * across most of the frame and only darkens where the type actually sits.
 */
export function PhotoCard({
  src,
  alt,
  eyebrow,
  title,
  body,
  aspect = "aspect-[4/5]",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  eyebrow?: string;
  title: string;
  body?: string;
  aspect?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-glass ${aspect} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className="object-cover transition-transform duration-[900ms] ease-soft group-hover:scale-105"
      />
      <span aria-hidden="true" className="absolute inset-0 scrim-bottom" />

      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {eyebrow && (
          <span className="block font-body text-[10px] uppercase tracking-[0.25em] text-accent-soft mb-2">
            {eyebrow}
          </span>
        )}
        <h3 className="font-display text-xl sm:text-2xl text-white leading-tight">{title}</h3>
        {body && (
          <p className="font-body text-sm text-white/80 leading-relaxed mt-2 max-w-prose">
            {body}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/** A number and a label on a glass plate, for the context statistics. */
export function StatPlate({
  stat,
  label,
  detail,
  tone = "light",
}: {
  stat: string;
  label: string;
  detail?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <GlassPanel tone={tone} className="p-6 sm:p-7">
      <div
        className={`font-display text-4xl sm:text-5xl leading-none mb-2 ${
          dark ? "text-white" : "text-base-dark"
        }`}
      >
        {stat}
      </div>
      <div
        className={`font-body text-[11px] uppercase tracking-[0.2em] font-semibold ${
          dark ? "text-accent-soft" : "text-accent-ink"
        }`}
      >
        {label}
      </div>
      {detail && (
        <p
          className={`font-body text-xs leading-relaxed mt-3 ${
            dark ? "text-white/65" : "text-base-dark/60"
          }`}
        >
          {detail}
        </p>
      )}
    </GlassPanel>
  );
}
