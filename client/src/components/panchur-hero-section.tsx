import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Sparkles, Play, Star } from "lucide-react";
import { Link } from "wouter";

export default function PanchurHeroSection() {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public-objects/1756800584883.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="max-w-5xl mx-auto">
          {/* Premium Badge */}
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white font-medium text-lg">Premium Hill Station Investment</span>
              <Star className="h-5 w-5 text-yellow-400 ml-2" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in-up">
            <span className="block mb-2">Panchur Hills</span>
            <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Premium Plots
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed animate-fade-in-up max-w-3xl mx-auto">
            Experience tranquility at 1,115m elevation in the heart of Pauri Garhwal, Uttarakhand
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up">
            <div className="flex items-center text-white bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
              <MapPin className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-semibold">1,115m Elevation</span>
            </div>
            <div className="flex items-center text-white bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
              <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
              <span className="font-semibold">₹3,900-4,900/sq ft</span>
            </div>
            <div className="flex items-center text-white bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/25 transition-all duration-300">
              <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="font-semibold">Ready to Move</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Link href="/book-visit" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                data-testid="book-site-visit"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Site Visit
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              data-testid="get-info"
            >
              Get Information
            </Button>

            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => window.open('/public-objects/1756800585023.mp4', '_blank')}
              className="w-full sm:w-auto px-6 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all duration-300"
              data-testid="watch-video"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                <Play className="h-5 w-5 ml-1" />
              </div>
              Watch Video
            </Button>
          </div>

          {/* Investment Highlight */}
          <div className="mt-16 p-8 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                🏔️
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
              Himalayan Mountain Views
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed text-center max-w-2xl mx-auto">
              Premium agricultural plots with stunning mountain vistas, peaceful environment, and all infrastructure ready
            </p>
            <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Clear Titles
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Ready Infrastructure
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                Mountain Air
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
    </section>
  );
}