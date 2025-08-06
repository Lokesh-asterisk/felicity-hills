import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Shield, DollarSign, FileText, TrendingUp, Calendar, Phone } from "lucide-react";

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
      answer: "The minimum investment starts from ₹16.2 lakhs for a 200 sq yd plot at ₹8,100 per sq yd. We also offer EMI facilities to make investment more accessible."
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
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
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
