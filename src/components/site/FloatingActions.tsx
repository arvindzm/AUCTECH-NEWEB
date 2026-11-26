"use client";
import { MessageSquareQuote } from "lucide-react";
import { SocialIcon } from "@/components/site/SocialIcon";
import { useQuoteModal } from "@/components/site/QuoteModal";
import { company } from "@/lib/site";

export function FloatingActions() {
  const { openQuote } = useQuoteModal();
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="flex size-13 items-center justify-center rounded-full bg-[#25d366] p-3.5 text-white shadow-lg transition hover:scale-105">
        <SocialIcon name="whatsapp" className="size-6" />
      </a>
      <button type="button" onClick={openQuote}
        className="flex h-12 items-center gap-2 rounded-full bg-cta-gradient px-5 text-sm font-semibold text-white shadow-lift transition hover:-translate-y-0.5">
        <MessageSquareQuote aria-hidden className="size-4" /><span className="hidden sm:inline">Get Your Custom Quote</span><span className="sm:hidden">Quote</span>
      </button>
    </div>
  );
}
