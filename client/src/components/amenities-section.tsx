import { Card, CardContent } from "@/components/ui/card";
import { 
  Waves, 
  Home, 
  Shield, 
  Baby, 
  Zap, 
  Wifi, 
  Car, 
  TreePine,
  Lightbulb,
  Construction
} from "lucide-react";

export default function AmenitiesSection() {
  const mainAmenities = [
    {
      icon: Waves,
      title: "Swimming Pool",
      description: "With modern filtration system",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      icon: Home,
      title: "Club House",
      description: "For community activities",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      bgColor: "from-green-50 to-green-100"
    },
    {
      icon: Shield,
      title: "Security",
      description: "24x7 Guard & CCTV",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      icon: Baby,
      title: "Kids Play Area",
      description: "Safe play equipment",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  const additionalAmenities = [
    { icon: Zap, title: "EV Charging", color: "bg-green-100 text-green-600" },
    { icon: Wifi, title: "Wi-Fi", color: "bg-blue-100 text-blue-600" },
    { icon: Car, title: "Parking", color: "bg-purple-100 text-purple-600" },
    { icon: TreePine, title: "Jogging Track", color: "bg-red-100 text-red-600" },
    { icon: TreePine, title: "Yoga Zone", color: "bg-indigo-100 text-indigo-600" },
    { icon: TreePine, title: "Landscaping", color: "bg-green-100 text-green-600" },
    { icon: Construction, title: "Paved Roads", color: "bg-gray-100 text-gray-600" },
    { icon: Lightbulb, title: "Street Lighting", color: "bg-yellow-100 text-yellow-600" }
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Modern Amenities
          </h2>
          <p className="text-xl text-gray-600">
            Community filled with every facility
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {mainAmenities.map((amenity, index) => (
            <Card 
              key={amenity.title}
              className={`bg-gradient-to-br ${amenity.bgColor} overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={amenity.image} 
                alt={`${amenity.title} - ${amenity.description}`}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <amenity.icon className="w-6 h-6 text-primary mr-3" />
                  <h3 className="font-bold text-gray-900">{amenity.title}</h3>
                </div>
                <p className="text-gray-600">{amenity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Amenities Grid */}
        <Card className="bg-gray-50 border-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Additional Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {additionalAmenities.map((amenity, index) => (
                <div key={amenity.title} className="text-center">
                  <div className={`w-12 h-12 ${amenity.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <amenity.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">{amenity.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
