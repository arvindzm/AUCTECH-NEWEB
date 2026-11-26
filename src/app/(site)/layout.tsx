import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { QuoteModalProvider } from "@/components/site/QuoteModal";
import { JsonLd } from "@/components/site/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuoteModalProvider>
      <JsonLd data={localBusinessJsonLd} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingActions />
    </QuoteModalProvider>
  );
}
