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
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/about">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2">
                About
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2">
                Projects
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('amenities')}
              className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2"
            >
              Amenities
            </Button>
            <Link href="/videos">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2">
                Videos
              </Button>
            </Link>
            <Link href="/brochures">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2">
                Brochures
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('calculator')}
              className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2"
            >
              Calculator
            </Button>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2"
            >
              Reviews
            </Button>
            <Link href="/book-visit">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-colors ml-2">
                Book Visit
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
            >
              Contact
            </Button>
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
          <div className="lg:hidden pb-4 space-y-2">
            <Link href="/about">
              <Button variant="ghost" className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start">
                About
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start">
                Projects
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('amenities')}
              className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start"
            >
              Amenities
            </Button>
            <Link href="/videos">
              <Button variant="ghost" className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start">
                Videos
              </Button>
            </Link>
            <Link href="/brochures">
              <Button variant="ghost" className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start">
                Brochures
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('calculator')}
              className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start"
            >
              Calculator
            </Button>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('testimonials')}
              className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start"
            >
              Reviews
            </Button>
            <Link href="/book-visit">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                Book Visit
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}