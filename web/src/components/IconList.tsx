import { Check } from "lucide-react";

interface IconListProps {
  items: string[];
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}

export default function IconList({
  items,
  icon: IconComponent = Check,
  className = "",
  itemClassName = "",
  iconClassName = "",
}: IconListProps) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className={`flex items-start gap-2.5 text-sm font-body text-base-dark/85 leading-relaxed ${itemClassName}`}>
          <span className="shrink-0 mt-1">
            <IconComponent className={`w-4.5 h-4.5 text-accent-amber ${iconClassName}`} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
