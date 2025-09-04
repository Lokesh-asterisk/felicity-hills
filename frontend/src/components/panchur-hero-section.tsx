import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Award, TrendingUp, Calendar, Mountain, TreePine, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function PanchurHeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          style={{
            backgroundImage: `url('/panchur-hero.jpg'), url('/khushalipur-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
          className="w-full h-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="inline-flex items-center mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Mountain className="w-4 h-4 mr-2" />
            Premium Hill Station Investment
          </Badge>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Panchur Hills</span><br />
            <span className="text-2xl lg:text-4xl text-gray-700">Premium Plots</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Luxury hill station plots in pristine Pauri Garhwal. Experience the perfect blend of 
            natural beauty and modern amenities at 4,500 feet above sea level.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-12 text-lg">
            <div className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold">Pauri Garhwal, Uttarakhand</span>
            </div>
            <div className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold">Premium Hill Station</span>
            </div>
            <div className="flex items-center bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <TreePine className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold">4,500 ft Elevation</span>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹15,000+</div>
              <div className="text-gray-600">Starting Price/sq yd</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">25-35%</div>
              <div className="text-gray-600">Expected Returns</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500-2000</div>
              <div className="text-gray-600">Plot Sizes (sq yd)</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Limited</div>
              <div className="text-gray-600">Exclusive Plots</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg"
            onClick={() => scrollToSection('contact')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 shadow-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Premium Site Visit
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={() => scrollToSection('plots')}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-10 py-6 shadow-lg bg-white/90"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Luxury Plots
          </Button>
        </div>

        {/* Unique Selling Points */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <Mountain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Himalayan Views</h3>
            <p className="text-gray-600">Breathtaking views of snow-capped Himalayan peaks from every plot</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <TreePine className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Pure Environment</h3>
            <p className="text-gray-600">Pristine air quality and serene natural surroundings away from city pollution</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Premium Amenities</h3>
            <p className="text-gray-600">Luxury clubhouse, spa facilities, and premium recreational amenities</p>
          </div>
        </div>
      </div>
    </section>
  );
}