import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { QuoteModalProvider } from "@/components/site/QuoteModal";
import SiteNotFound from "./(site)/not-found";

/** Global 404 (unmatched URLs) rendered inside the public site chrome. */
export default function NotFound() {
  return (
    <QuoteModalProvider>
      <Header />
      <main id="main"><SiteNotFound /></main>
      <Footer />
    </QuoteModalProvider>
  );
}
