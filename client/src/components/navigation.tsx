import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/Felicity Hills Logo_1754587869215.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (location !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <a 
              href="/" 
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoImage} 
                alt="Felicity Hills Logo" 
                className="h-20 w-auto"
              />
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
              About
            </Link>
            <button 
              onClick={() => scrollToSection('amenities')} 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Amenities
            </button>
            <Link href="/videos" className="text-gray-700 hover:text-primary transition-colors">
              Videos
            </Link>
            <Link href="/brochures" className="text-gray-700 hover:text-primary transition-colors">
              Brochures
            </Link>
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

            <Link href="/book-visit">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book Visit
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-primary hover:bg-secondary"
            >
              Contact
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
            <Link 
              href="/about"
              onClick={() => handleNavigation('/about')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              About
            </Link>
            <button 
              onClick={() => scrollToSection('amenities')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Amenities
            </button>
            <Link 
              href="/videos"
              onClick={() => handleNavigation('/videos')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Videos
            </Link>
            <Link 
              href="/brochures"
              onClick={() => handleNavigation('/brochures')}
              className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
            >
              Brochures
            </Link>
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
            <Link 
              href="/book-visit"
              onClick={() => handleNavigation('/book-visit')}
            >
              <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                Book Visit
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full mt-2 bg-primary hover:bg-secondary"
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
