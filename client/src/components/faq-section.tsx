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
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 223.8-99.6 223.9-222 .1-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
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
