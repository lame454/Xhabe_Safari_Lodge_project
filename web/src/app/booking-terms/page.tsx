import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = { title: "Booking Terms | Xhabe Safari Lodge", description: "Booking terms and cancellation conditions for Xhabe Safari Lodge." };

const sections = [
  ["Booking requests", "Submitting a request does not create a confirmed reservation. We will confirm availability, rates, the deposit amount, and final terms in writing before a booking is secured."],
  ["Payments", "A deposit is required to secure a confirmed reservation. The remaining balance is due 30 days before arrival unless your written confirmation states otherwise."],
  ["Cancellations", "Cancellations made 30 or more days before arrival receive a full refund of the deposit. Cancellations 15–29 days before arrival receive a 50% deposit refund. Deposits are forfeited for cancellations within 14 days of arrival."],
  ["Travel and safety", "Guests are responsible for travel documents, visas, insurance, and following guide and lodge safety instructions. Wildlife activities carry inherent risks; please disclose relevant medical or mobility needs before arrival."],
  ["Changes", "We may adjust an itinerary where weather, safety, conservation requirements, or circumstances beyond our control make this necessary. We will communicate any material change as soon as practical."],
];

export default function BookingTermsPage() { return <><NavBar /><main className="bg-base-cream-light py-20"><article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"><span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold">Legal</span><h1 className="font-display text-5xl text-base-dark mt-3">Booking Terms</h1><p className="font-body text-sm text-base-dark/60 mt-4">Last updated: 19 July 2026</p>{sections.map(([title, text]) => <section key={title} className="mt-10"><h2 className="font-display text-2xl text-base-dark">{title}</h2><p className="font-body text-base text-base-dark/75 leading-loose mt-3">{text}</p></section>)}</article></main><Footer /></>; }
