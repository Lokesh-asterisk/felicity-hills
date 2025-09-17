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
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" role="img" aria-label="WhatsApp icon">
          <path d="M12.017 2.011c-5.506 0-9.98 4.474-9.98 9.98 0 1.75.46 3.47 1.33 4.98L2 22l5.13-1.35c1.43.81 3.04 1.24 4.89 1.24 5.51 0 9.98-4.47 9.98-9.98S17.53 2.011 12.017 2.011zm5.89 14.16c-.26.73-1.28 1.34-2.05 1.51-.75.17-1.73.15-2.79-.17-.46-.14-.75-.25-1.26-.43-2.17-.77-3.59-2.95-3.7-3.08-.11-.14-.91-1.21-.91-2.31s.58-1.64.78-1.87c.2-.23.44-.29.59-.29s.3 0 .43.01c.14.01.32-.05.5.38.18.44.63 1.54.69 1.65.05.11.09.24.02.39-.07.15-.11.24-.22.37-.11.13-.23.29-.33.39-.11.1-.22.21-.1.41.12.2.54.89 1.16 1.44.8.71 1.47 1.02 1.68 1.14.21.12.33.1.45-.06.12-.16.51-.59.64-.79.13-.2.27-.17.45-.1.18.07 1.14.54 1.34.64.2.1.33.15.38.23.05.08.05.46-.21 1.19z"/>
        </svg>
      </a>
    </div>
  );
}
