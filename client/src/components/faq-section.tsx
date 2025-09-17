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
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
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
