import { Card } from "@/components/ui/card";
import { Phone, MapPin, Clock } from "lucide-react";
import logoImage from "@assets/website logo1_1754473813433.png";

export default function Footer() {
  const quickLinks = [
    { name: "Amenities", href: "#amenities" },
    { name: "Videos", href: "#videos" },
    { name: "Calculator", href: "#calculator" },
    { name: "Testimonials", href: "#testimonials" }
  ];

  const investmentInfo = [
    "Starting: ₹8,100/sq yd",
    "Returns: 15-20% annually",
    "Plot sizes: 200-800 sq yd",
    "EMI facility available"
  ];

  const contactInfo = [
    { icon: Phone, text: "+91 85888 34221" },
    { icon: MapPin, text: "Khushalipur, Dehradun" },
    { icon: Clock, text: "9 AM - 7 PM" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={logoImage} 
                alt="Felicity Hills Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for agricultural land investment near Delhi-Dehradun Expressway.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Investment Info</h3>
            <ul className="space-y-2 text-gray-400">
              {investmentInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center">
                  <info.icon className="w-4 h-4 mr-2" />
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Felicity Hills. All rights reserved. | Khushalipur Agricultural Land Investment</p>
        </div>
      </div>
    </footer>
  );
}
