import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, Phone, Sparkles } from "lucide-react";

export default function PanchurNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg relative z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="text-xl font-bold text-green-700 tracking-tight">
                Felicity Hills
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
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
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 ml-3 mr-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Calendar className="w-4 h-4 mr-2" />
                <span className="relative z-10">Book Visit</span>
                <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
              </Button>
            </Link>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 relative overflow-hidden group ml-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Phone className="w-4 h-4 mr-2" />
              <span className="relative z-10">Contact</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
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