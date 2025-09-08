import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { 
  Mountain, 
  TreePine, 
  Shield, 
  Zap, 
  Wifi, 
  Car, 
  Wind,
  Construction,
  Lightbulb,
  Leaf
} from "lucide-react";

export default function PanchurAmenitiesSection() {

  const mainAmenities = [
    {
      icon: Mountain,
      title: "Himalayan Views",
      description: "Stunning mountain vistas at 1,115m elevation",
      bgColor: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: TreePine,
      title: "Forest Environment",
      description: "Peaceful natural surroundings",
      bgColor: "from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Wind,
      title: "Fresh Air",
      description: "Pure mountain air quality",
      bgColor: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Leaf,
      title: "Agricultural Land",
      description: "Fertile soil for farming",
      bgColor: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const additionalAmenities = [
    { icon: Shield, title: "24x7 Security", color: "bg-green-100 text-green-600" },
    { icon: Zap, title: "Power Supply", color: "bg-blue-100 text-blue-600" },
    { icon: Wifi, title: "Network Coverage", color: "bg-purple-100 text-purple-600" },
    { icon: Car, title: "Road Access", color: "bg-red-100 text-red-600" },
    { icon: Construction, title: "Paved Roads", color: "bg-gray-100 text-gray-600" },
    { icon: Lightbulb, title: "Street Lighting", color: "bg-yellow-100 text-yellow-600" },
    { icon: TreePine, title: "Organic Farming", color: "bg-green-100 text-green-600" },
    { icon: Mountain, title: "Hill Station", color: "bg-indigo-100 text-indigo-600" }
  ];

  return (
    <section id="amenities" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-6 py-2 mb-6">
            <Mountain className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Hill Station Living</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Natural Amenities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience tranquility in the lap of Himalayas with premium amenities designed for mountain living
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {mainAmenities.map((amenity, index) => (
            <Card 
              key={amenity.title}
              className={`bg-gradient-to-br ${amenity.bgColor} border-0 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="h-32 flex items-center justify-center">
                  <amenity.icon className={`w-16 h-16 ${amenity.iconColor}`} />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{amenity.title}</h3>
                  <p className="text-gray-600 text-sm">{amenity.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Additional Amenities Grid */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Additional Features
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {additionalAmenities.map((amenity, index) => (
              <div 
                key={amenity.title}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-16 h-16 ${amenity.color} rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <amenity.icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {amenity.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}