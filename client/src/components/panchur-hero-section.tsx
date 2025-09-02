import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function PanchurHeroSection() {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/public-objects/1756800584883.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Panchur Hills</span>
            <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Premium Plots
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Experience tranquility at 1,115m elevation in the heart of Pauri Garhwal, Uttarakhand
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-medium">1,115m Elevation</span>
            </div>
            <div className="flex items-center text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
              <span className="font-medium">₹3,900-4,900/sq ft</span>
            </div>
            <div className="flex items-center text-white bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="font-medium">Ready to Move</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/book-visit" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
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
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
              data-testid="get-info"
            >
              Get Information
            </Button>
          </div>

          {/* Investment Highlight */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              🏔️ Himalayan Mountain Views
            </h3>
            <p className="text-gray-200">
              Premium agricultural plots with stunning mountain vistas, peaceful environment, and all infrastructure ready
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
}