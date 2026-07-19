import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
  showArrow?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  showArrow = false,
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-amber/50";
  
  const variants = {
    primary: "bg-accent-amber text-white px-6 py-3.5 hover:bg-base-dark shadow-sm hover:shadow",
    secondary: "border border-base-dark/30 text-base-dark px-6 py-3.5 hover:bg-base-dark hover:text-white hover:border-base-dark",
    tertiary: "text-accent-amber hover:text-base-dark p-0 gap-1 tracking-widest hover:translate-x-1",
  };

  const currentStyles = `${baseStyles} ${variants[variant]} ${className}`;

  const renderContent = () => (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${currentStyles}`}
        >
          {renderContent()}
        </a>
      );
    }
    return (
      <Link href={href} className={`group ${currentStyles}`}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`group ${currentStyles}`}>
      {renderContent()}
    </button>
  );
}
