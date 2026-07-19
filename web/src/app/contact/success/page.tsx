import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Enquiry Sent | Xhabe Safari Lodge",
  description: "Thank you for your enquiry. The Xhabe Safari Lodge team will respond within 24 hours.",
};

export default function ContactSuccessPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-[70vh] bg-base-cream-light flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-accent-amber/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-accent-amber" />
            </div>
          </div>
          <h1 className="font-display text-4xl text-base-dark mb-5">
            Message Received
          </h1>
          <p className="font-body text-sm text-base-dark/70 leading-loose mb-10">
            Thank you for reaching out. A member of the Xhabe team will review your enquiry and respond within 24 hours with availability, rates, and a personalised quote.
          </p>
          <p className="font-body text-sm text-base-dark/50 mb-12">
            In the meantime, explore our gallery or read about what's included in each stay package.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/" variant="primary">
              Back to Home
            </Button>
            <Button href="/gallery" variant="secondary">
              View Gallery
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
