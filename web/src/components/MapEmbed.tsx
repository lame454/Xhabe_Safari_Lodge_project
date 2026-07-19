interface MapEmbedProps {
  className?: string;
  height?: string;
}

export default function MapEmbed({
  className = "",
  height = "450px",
}: MapEmbedProps) {
  // Free, no-key iframe embed URL for Xhabe Safari Lodge, Botswana
  const embedUrl = "https://maps.google.com/maps?q=Xhabe%20Safari%20Lodge,%20Muchenje,%20Botswana&t=&z=13&ie=UTF8&iwloc=&output=embed";

  return (
    <div className={`w-full overflow-hidden border border-base-dark/5 bg-base-cream/10 ${className}`}>
      <iframe
        title="Xhabe Safari Lodge Location Map"
        width="100%"
        height={height}
        style={{ border: 0 }}
        src={embedUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
}
