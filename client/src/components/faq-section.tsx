import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Shield, DollarSign, FileText, TrendingUp, Calendar, Phone, MapPin, Banknote, Home, Clock } from "lucide-react";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqs = [
    {
      id: "safety",
      icon: Shield,
      question: "How safe is investing in agricultural land?",
      answer: "Agricultural land investment is one of the safest forms of investment as it's a tangible asset with government documentation. Our plots are fully approved and registered, providing complete legal security to investors."
    },
    {
      id: "investment",
      icon: DollarSign,
      question: "What is the minimum investment amount?",
      answer: "The minimum investment starts from ₹16.2 lakhs for a 200 sq yd plot at ₹8,100 per sq yd."
    },
    {
      id: "legal",
      icon: FileText,
      question: "How are the legal documents and approvals?",
      answer: "All our plots have complete legal documentation including government approvals, clear titles, and proper registration. We provide full transparency in all legal matters."
    },
    {
      id: "returns",
      icon: TrendingUp,
      question: "When and how will I get returns?",
      answer: "Returns are generated through land value appreciation, which typically ranges from 15-20% annually. You can exit your investment anytime by selling your plot in the market."
    },
    {
      id: "booking",
      icon: Calendar,
      question: "How to book a site visit?",
      answer: "You can book a site visit by calling us at +91 85888 34221, sending a WhatsApp message, or filling out the contact form below. We arrange free site visits with transportation from Delhi/NCR."
    },
    {
      id: "payment",
      icon: Banknote,
      question: "What are the payment options available?",
      answer: "We accept various payment methods including bank transfers, cheques, and online payments. Payment can be made in installments as per the agreed terms during the booking process."
    },
    {
      id: "location",
      icon: MapPin,
      question: "What are the key location advantages of Khushalipur?",
      answer: "Khushalipur is strategically located near Dehradun with excellent connectivity to major highways, airports, and cities. The area offers clean air, water availability, and proximity to hill stations, making it ideal for both investment and future development."
    },
    {
      id: "usage",
      icon: Home,
      question: "Can I build a farmhouse or residence on the plot?",
      answer: "Yes, these are agricultural plots where you can build farmhouses, engage in organic farming, or develop the land as per local regulations. Many investors use these plots for weekend retreats and agricultural activities."
    },
    {
      id: "timeline",
      icon: Clock,
      question: "What is the typical timeline for property handover?",
      answer: "After completion of payment and documentation, the property handover typically takes 15-30 days. All legal formalities and registration processes are completed during this period with full support from our team."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Answers to all your important questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={faq.id}
              className="shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Collapsible
                open={openItems[faq.id]}
                onOpenChange={() => toggleItem(faq.id)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full px-6 py-4 text-left font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <span className="flex items-center">
                      <faq.icon className="w-5 h-5 mr-3 text-primary" />
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 transform transition-transform ${
                        openItems[faq.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-primary/10 border-primary/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Have More Questions?</h3>
            <p className="text-gray-600 mb-6">Speak directly with our team</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary hover:bg-secondary">
                <a href="tel:+918588834221">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <a href="https://wa.me/918588834221" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 2.011c-5.506 0-9.98 4.474-9.98 9.98 0 1.75.46 3.47 1.33 4.98L2 22l5.13-1.35c1.43.81 3.04 1.24 4.89 1.24 5.51 0 9.98-4.47 9.98-9.98S17.53 2.011 12.017 2.011zm5.89 14.16c-.26.73-1.28 1.34-2.05 1.51-.75.17-1.73.15-2.79-.17-.46-.14-.75-.25-1.26-.43-2.17-.77-3.59-2.95-3.7-3.08-.11-.14-.91-1.21-.91-2.31s.58-1.64.78-1.87c.2-.23.44-.29.59-.29s.3 0 .43.01c.14.01.32-.05.5.38.18.44.63 1.54.69 1.65.05.11.09.24.02.39-.07.15-.11.24-.22.37-.11.13-.23.29-.33.39-.11.1-.22.21-.1.41.12.2.54.89 1.16 1.44.8.71 1.47 1.02 1.68 1.14.21.12.33.1.45-.06.12-.16.51-.59.64-.79.13-.2.27-.17.45-.1.18.07 1.14.54 1.34.64.2.1.33.15.38.23.05.08.05.46-.21 1.19z"/>
                  </svg>
                  WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
