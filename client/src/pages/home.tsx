import { useEffect } from "react";
import KhushhalipurNavigation from "../components/khushalipur-navigation";
import HeroSection from "../components/hero-section";
import RecentActivitySection from "../components/recent-activity-section";
import LocationAdvantages from "../components/location-advantages";
import ComparisonTable from "../components/comparison-table";
import AmenitiesSection from "../components/amenities-section";
import InvestmentCalculator from "../components/investment-calculator";
import TestimonialsSection from "../components/testimonials-section";
import FAQSection from "../components/faq-section";
import ContactSection from "../components/contact-section";
import Footer from "../components/footer";

export default function Home() {
  // Set page title for SEO
  useEffect(() => {
    document.title = "Khushalipur - Premium Agricultural Land Investment | Felicity Hills";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Invest in premium agricultural land at Khushalipur near Dehradun. 15-20% annual returns, modern amenities, Delhi-Dehradun Expressway connectivity. Book site visit today!');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <KhushhalipurNavigation />
      <HeroSection />
      <RecentActivitySection />
      <LocationAdvantages />
      <AmenitiesSection />
      <ComparisonTable />
      <InvestmentCalculator />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      
      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/918588834221" 
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-[9999]"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
        data-testid="whatsapp-button"
      >
        <span className="text-3xl">💬</span>
      </a>
    </div>
  );
}
