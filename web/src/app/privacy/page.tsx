import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = { title: "Privacy Policy | Xhabe Safari Lodge", description: "How Xhabe Safari Lodge handles personal information." };

const sections = [
  ["Information we collect", "When you send an enquiry or booking request, we collect the information you provide, such as your name, email address, phone number, travel dates, guest count, and special requests."],
  ["How we use it", "We use this information only to respond to your request, prepare and manage a reservation, communicate about your stay, and meet legal or operational obligations."],
  ["Sharing and retention", "We do not sell personal information. We share it only with trusted service providers needed to operate your booking or where required by law. We keep it only as long as reasonably necessary."],
  ["Your choices", "You may ask us to access, correct, or delete your personal information, subject to applicable legal requirements. Contact reservations@xhabesafarilodge.com for privacy requests."],
];

export default function PrivacyPage() { return <><NavBar /><main className="bg-base-cream-light py-20"><article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"><span className="text-[10px] uppercase tracking-[0.3em] text-accent-amber font-semibold">Legal</span><h1 className="font-display text-5xl text-base-dark mt-3">Privacy Policy</h1><p className="font-body text-sm text-base-dark/60 mt-4">Last updated: 19 July 2026</p><p className="font-body text-base text-base-dark/75 leading-loose mt-10">Xhabe Safari Lodge respects your privacy and handles guest information with care.</p>{sections.map(([title, text]) => <section key={title} className="mt-10"><h2 className="font-display text-2xl text-base-dark">{title}</h2><p className="font-body text-base text-base-dark/75 leading-loose mt-3">{text}</p></section>)}</article></main><Footer /></>; }
