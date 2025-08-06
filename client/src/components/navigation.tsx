import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/website logo1_1754473813433.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a 
              href="/" 
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoImage} 
                alt="Felicity Hills Logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('amenities')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Amenities
            </button>
            <button 
              onClick={() => scrollToSection('plots')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Plots
            </button>
            <button 
              onClick={() => scrollToSection('videos')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Videos
            </button>
            <button 
              onClick={() => scrollToSection('brochures')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Brochures
            </button>
            <button 
              onClick={() => scrollToSection('calculator')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Calculator
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-primary hover:bg-secondary"
            >
              Book Visit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button 
              onClick={() => scrollToSection('amenities')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Amenities
            </button>
            <button 
              onClick={() => scrollToSection('plots')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Plots
            </button>
            <button 
              onClick={() => scrollToSection('videos')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Videos
            </button>
            <button 
              onClick={() => scrollToSection('brochures')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Brochures
            </button>
            <button 
              onClick={() => scrollToSection('calculator')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Calculator
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full mt-2 bg-primary hover:bg-secondary"
            >
              Book Visit
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
