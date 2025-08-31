import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/Felicity Hills Logo_1754587869215.png";

export default function KhushhalipurNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

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
          <div className="hidden lg:flex items-center space-x-2">
            <Button 
              onClick={() => scrollToSection('amenities')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm"
            >
              Amenities
            </Button>
            <Button 
              onClick={() => scrollToSection('location')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm"
            >
              Location
            </Button>
            <Link href="/videos">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm">
                Videos
              </Button>
            </Link>
            <Link href="/brochures">
              <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm">
                Brochures
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('calculator')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm"
            >
              Calculator
            </Button>
            <Button 
              onClick={() => scrollToSection('testimonials')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm"
            >
              Reviews
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm"
            >
              Contact
            </Button>
            <Link href="/admin">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
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
          <div className="lg:hidden pb-4 space-y-3">
            <Button 
              onClick={() => scrollToSection('amenities')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Amenities
            </Button>
            <Button 
              onClick={() => scrollToSection('location')}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Location
            </Button>
            <Link href="/videos">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                Videos
              </Button>
            </Link>
            <Link href="/brochures">
              <Button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                Brochures
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('calculator')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Calculator
            </Button>
            <Button 
              onClick={() => scrollToSection('testimonials')}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Reviews
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Contact
            </Button>
            <Link href="/admin">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                Admin
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}