import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | Xhabe Safari Lodge",
  description: "The page you were looking for could not be found. Navigate back to Xhabe Safari Lodge.",
};

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="min-h-[70vh] bg-base-dark flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <Compass className="w-8 h-8 text-accent-amber" />
            </div>
          </div>
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold mb-4 block">
            404
          </span>
          <h1 className="font-display text-5xl text-white mb-5">
            Lost in the Bush?
          </h1>
          <p className="font-body text-sm text-white/65 leading-loose mb-10">
            The page you were looking for doesn't exist — but there's plenty of wild country to explore. Let us guide you back.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/" variant="primary">
              Back to Home
            </Button>
            <Button href="/contact" variant="secondary" className="!border-white/30 !text-white/80 hover:!bg-white hover:!text-base-dark">
              Contact the Lodge
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
