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
    // Small delay to ensure menu closes before navigation
    setTimeout(() => {
      window.location.href = path;
    }, 100);
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
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 font-medium px-6 py-2 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                About
              </Button>
            </Link>
            <Link href="/project-showcase">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 font-medium px-6 py-2 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                Projects
              </Button>
            </Link>

            <Link href="/book-visit">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                Book Visit
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
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
          <div className="md:hidden pb-4 space-y-3">
            <Button 
              onClick={() => handleNavigation('/about')}
              variant="ghost"
              className="w-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 font-medium py-3 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              About
            </Button>
            <Button 
              onClick={() => handleNavigation('/project-showcase')}
              variant="ghost"
              className="w-full text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 font-medium py-3 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Projects
            </Button>
            <Button 
              onClick={() => handleNavigation('/book-visit')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Book Visit
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
