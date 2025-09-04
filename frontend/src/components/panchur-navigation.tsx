import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, Phone, Mountain } from "lucide-react";
import logoImage from "@assets/Felicity Hills Logo_1754587869215.png";

export default function PanchurNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      window.location.href = path;
    }, 100);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <Link href="/">
              <img 
                src={logoImage} 
                alt="Panchur Hills Premium Plots - Felicity Hills" 
                className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('amenities')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2"
            >
              Premium Amenities
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('plots')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2"
            >
              Luxury Plots
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('calculator')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2"
            >
              Investment Calculator
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2"
            >
              Success Stories
            </Button>
            
            <Link href="/brochures">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2">
                Project Brochures
              </Button>
            </Link>
            
            <Link href="/videos">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-3 py-2">
                Project Videos
              </Button>
            </Link>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Premium Visit
              </Button>
              
              <Button 
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a href="tel:+918588834221">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a href="tel:+918588834221">
                <Phone className="w-4 h-4" />
              </a>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('amenities')}
                className="text-left justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Premium Amenities
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('plots')}
                className="text-left justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Luxury Plots
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('calculator')}
                className="text-left justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Investment Calculator
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('testimonials')}
                className="text-left justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Success Stories
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/brochures')}
                className="text-left justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Project Brochures
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/videos')}
                className="text-left justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Project Videos
              </Button>
              
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Button 
                  onClick={() => scrollToSection('contact')}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white mb-2"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Premium Visit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}