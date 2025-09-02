import { Card, CardContent } from "@/components/ui/card";
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
      image: "/public-objects/1756800584896.jpg",
      bgColor: "from-blue-50 to-blue-100",
      altText: "Breathtaking Himalayan mountain views from Panchur Hills"
    },
    {
      icon: TreePine,
      title: "Forest Environment",
      description: "Peaceful natural surroundings",
      image: "/public-objects/1756800584883.jpg",
      bgColor: "from-green-50 to-green-100",
      altText: "Serene forest environment with lush greenery"
    },
    {
      icon: Wind,
      title: "Fresh Air",
      description: "Pure mountain air quality",
      image: "/public-objects/1756800584888.jpg",
      bgColor: "from-purple-50 to-purple-100",
      altText: "Clean mountain air and natural environment"
    },
    {
      icon: Leaf,
      title: "Agricultural Land",
      description: "Fertile soil for farming",
      image: "/public-objects/1756800584891.jpg",
      bgColor: "from-orange-50 to-orange-100",
      altText: "Rich agricultural land perfect for organic farming"
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
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Natural Amenities
          </h2>
          <p className="text-xl text-gray-600">
            Experience tranquility in the lap of Himalayas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {mainAmenities.map((amenity, index) => (
            <Card 
              key={amenity.title}
              className={`bg-gradient-to-br ${amenity.bgColor} border-0 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={amenity.image} 
                    alt={amenity.altText}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <amenity.icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
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