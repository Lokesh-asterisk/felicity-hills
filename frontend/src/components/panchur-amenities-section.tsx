import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  TreePine, 
  Waves, 
  Car, 
  Shield, 
  Wifi, 
  Zap,
  Heart,
  Coffee,
  Gamepad2,
  Dumbbell,
  Camera,
  Sparkles,
  Crown,
  MapPin,
  Sunrise
} from "lucide-react";

const amenityCategories = [
  {
    title: "Luxury Lifestyle Amenities",
    description: "Premium facilities for the discerning lifestyle",
    icon: Crown,
    color: "bg-purple-100 text-purple-800",
    amenities: [
      { name: "Premium Clubhouse", icon: Coffee, description: "Luxury clubhouse with panoramic mountain views" },
      { name: "Infinity Pool", icon: Waves, description: "Temperature-controlled infinity pool overlooking valleys" },
      { name: "Spa & Wellness Center", icon: Heart, description: "Full-service spa with mountain therapy treatments" },
      { name: "Fine Dining Restaurant", icon: Sparkles, description: "Multi-cuisine restaurant with organic mountain ingredients" }
    ]
  },
  {
    title: "Recreation & Entertainment",
    description: "Premium entertainment and recreational facilities", 
    icon: Gamepad2,
    color: "bg-blue-100 text-blue-800",
    amenities: [
      { name: "Adventure Sports Hub", icon: Mountain, description: "Rock climbing, rappelling, and mountain biking facilities" },
      { name: "Gymnasium & Fitness", icon: Dumbbell, description: "State-of-the-art fitness center with mountain views" },
      { name: "Photography Deck", icon: Camera, description: "Professional photography points for Himalayan views" },
      { name: "Nature Trails", icon: TreePine, description: "Guided nature walks through deodar forests" }
    ]
  },
  {
    title: "Essential Infrastructure", 
    description: "Modern infrastructure in pristine natural setting",
    icon: Zap,
    color: "bg-green-100 text-green-800", 
    amenities: [
      { name: "24x7 Power Supply", icon: Zap, description: "Uninterrupted power with solar backup systems" },
      { name: "High-Speed Internet", icon: Wifi, description: "Fiber optic connectivity for remote work capability" },
      { name: "Premium Security", icon: Shield, description: "24x7 manned security with CCTV surveillance" },
      { name: "Paved Access Roads", icon: Car, description: "Well-maintained roads with adequate parking spaces" }
    ]
  }
];

const uniqueFeatures = [
  {
    title: "Himalayan Sunrise Points",
    description: "Dedicated viewing decks for spectacular sunrise over snow peaks",
    icon: Sunrise,
    highlight: "Exclusive Feature"
  },
  {
    title: "Organic Mountain Garden",
    description: "Community organic gardens with mountain herbs and vegetables", 
    icon: TreePine,
    highlight: "Sustainable Living"
  },
  {
    title: "Helipad Facility",
    description: "Private helipad for premium transportation and emergency access",
    icon: MapPin,
    highlight: "Premium Access"
  }
];

export default function PanchurAmenitiesSection() {
  return (
    <section id="amenities" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="inline-flex items-center mb-4 bg-purple-100 text-purple-800">
            <Sparkles className="w-4 h-4 mr-2" />
            Luxury Hill Station Amenities
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Premium Amenities in the Himalayas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience world-class amenities designed for luxury mountain living, 
            combining modern comfort with pristine natural beauty.
          </p>
        </div>

        {/* Main Amenity Categories */}
        <div className="space-y-12">
          {amenityCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className={`inline-flex items-center mb-4 ${category.color}`}>
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.title}
                </Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.amenities.map((amenity, index) => (
                  <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-0">
                    <CardHeader className="pb-4">
                      <amenity.icon className="h-8 w-8 text-blue-600 mb-3" />
                      <CardTitle className="text-lg text-gray-900">{amenity.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {amenity.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Unique Premium Features */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Premium Features</h3>
            <p className="text-gray-600">Unique amenities that set Panchur Hills apart from other developments</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                <CardHeader className="text-center pb-4">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <Badge variant="outline" className="text-blue-700 border-blue-200 mb-3">
                    {feature.highlight}
                  </Badge>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Environmental Features */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8">
          <div className="text-center">
            <Mountain className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Sustainable Mountain Living</h3>
            <p className="text-blue-100 max-w-3xl mx-auto text-lg mb-6">
              Our development is designed to preserve and enhance the natural mountain environment 
              while providing world-class luxury amenities.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Solar Powered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Zero</div>
                <div className="text-blue-100">Plastic Policy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Native</div>
                <div className="text-blue-100">Plant Species</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Eco</div>
                <div className="text-blue-100">Construction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}