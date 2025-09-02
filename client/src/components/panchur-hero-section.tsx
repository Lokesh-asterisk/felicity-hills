import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Sparkles, Play, Star, Users } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function PanchurHeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/public-objects/1756800584883.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transform: `translateY(${scrollY * 0.5}px)`
      }}
    >
      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="max-w-4xl mx-auto">
          {/* Floating Badge */}
          <div className={`mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white font-medium">Premium Hill Station Investment</span>
              <Star className="h-5 w-5 text-yellow-400 ml-2" />
            </div>
          </div>

          {/* Main Heading with Enhanced Animation */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="block relative">
              Panchur Hills
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-60 animate-pulse"></div>
            </span>
            <span className="block bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
              Premium Plots
            </span>
          </h1>
          
          {/* Subtitle with Enhanced Animation */}
          <p className={`text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Experience tranquility at 1,115m elevation in the heart of Pauri Garhwal, Uttarakhand
          </p>

          {/* Enhanced Key Features with Animations */}
          <div className={`flex flex-wrap justify-center gap-6 mb-10 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center text-white bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
              <MapPin className="h-5 w-5 mr-2 text-green-400 group-hover:animate-bounce" />
              <span className="font-medium">1,115m Elevation</span>
            </div>
            <div className="flex items-center text-white bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
              <Sparkles className="h-5 w-5 mr-2 text-blue-400 group-hover:animate-spin" />
              <span className="font-medium">₹3,900-4,900/sq ft</span>
            </div>
            <div className="flex items-center text-white bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
              <Calendar className="h-5 w-5 mr-2 text-yellow-400 group-hover:animate-pulse" />
              <span className="font-medium">Ready to Move</span>
            </div>
          </div>

          {/* Enhanced Call to Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link href="/book-visit" className="w-full sm:w-auto group">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-10 py-5 text-lg font-semibold bg-gradient-to-r from-green-600 via-green-500 to-blue-600 hover:from-green-700 hover:via-green-600 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-green-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 relative overflow-hidden"
                data-testid="book-site-visit"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Calendar className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                Book Site Visit
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-5 text-lg font-semibold bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white hover:text-green-600 hover:border-white transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 group"
              data-testid="get-info"
            >
              <Users className="h-6 w-6 mr-3 group-hover:animate-pulse" />
              Get Information
            </Button>

            {/* Video Play Button */}
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => window.open('/public-objects/1756800585023.mp4', '_blank')}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
              data-testid="watch-video"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 group-hover:bg-white/30 transition-all duration-300">
                <Play className="h-6 w-6 ml-1 group-hover:scale-110 transition-transform" />
              </div>
              Watch Video
            </Button>
          </div>

          {/* Enhanced Investment Highlight */}
          <div className={`mt-16 p-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:scale-105 hover:shadow-green-500/20 group`}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl group-hover:animate-bounce">
                🏔️
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
              Himalayan Mountain Views
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              Premium agricultural plots with stunning mountain vistas, peaceful environment, and all infrastructure ready
            </p>
            <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Clear Titles
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                Ready Infrastructure
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                Mountain Air
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full blur-lg animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-400/10 rounded-full blur-lg animate-float delay-500"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-gradient-shift"></div>
      </div>
    </section>
  );
}