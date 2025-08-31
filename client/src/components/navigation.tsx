import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, Phone, Sparkles } from "lucide-react";
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
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/about">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2">
                About
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('projects')}
              className="text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium px-3 py-2"
            >
              Projects
            </Button>
            <Link href="/book-visit">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ml-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Calendar className="w-4 h-4 mr-2" />
                <span className="relative z-10">Book Visit</span>
                <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Phone className="w-4 h-4 mr-2" />
              <span className="relative z-10">Contact</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
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
            <Link href="/about">
              <Button variant="ghost" className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start">
                About
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={() => scrollToSection('projects')}
              className="w-full text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 justify-start"
            >
              Projects
            </Button>
            <Link href="/book-visit">
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Calendar className="w-5 h-5 mr-3" />
                <span className="relative z-10 text-lg">Book Visit</span>
                <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Phone className="w-5 h-5 mr-3" />
              <span className="relative z-10 text-lg">Contact</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
