import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Car, Mountain, TreePine, Compass, Sunrise, Star } from "lucide-react";

const locationFeatures = [
  {
    title: "Strategic Hill Station Location",
    description: "Located in the heart of Pauri Garhwal at 4,500 feet elevation",
    icon: Mountain,
    highlight: "Premium Altitude",
    details: [
      "Himalayan foothills location",
      "Year-round pleasant climate", 
      "Away from commercial crowds",
      "Natural valley setting"
    ]
  },
  {
    title: "Excellent Connectivity",
    description: "Well-connected to major hill stations and cities",
    icon: Car,
    highlight: "Easy Access",
    details: [
      "2 hours from Rishikesh",
      "4 hours from Delhi",
      "45 mins to Lansdowne",
      "1 hour to Pauri town"
    ]
  },
  {
    title: "Natural Beauty & Climate", 
    description: "Perfect weather and stunning natural surroundings",
    icon: TreePine,
    highlight: "All Season Comfort",
    details: [
      "15-25°C summer temperature",
      "Dense deodar forests",
      "Crystal clear mountain air",
      "Panoramic valley views"
    ]
  },
  {
    title: "Tourism & Development",
    description: "Growing tourism hub with government support",
    icon: Compass,
    highlight: "Rapid Growth",
    details: [
      "Emerging eco-tourism destination",
      "Government infrastructure development",
      "Growing hospitality sector", 
      "Increasing property values"
    ]
  },
  {
    title: "Himalayan Views",
    description: "Unobstructed views of major Himalayan peaks",
    icon: Sunrise,
    highlight: "Breathtaking Scenery", 
    details: [
      "Nanda Devi peak views",
      "Trishul mountain range",
      "Sunrise over Himalayas",
      "360-degree mountain panorama"
    ]
  },
  {
    title: "Premium Lifestyle",
    description: "Luxury living in pristine natural environment",
    icon: Star,
    highlight: "Exclusive Community",
    details: [
      "Low pollution environment", 
      "Peaceful & serene location",
      "Elite residential community",
      "Premium recreational facilities"
    ]
  }
];

export default function PanchurLocationAdvantages() {
  return (
    <section id="location" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="inline-flex items-center mb-4 bg-blue-100 text-blue-800">
            <MapPin className="w-4 h-4 mr-2" />
            Prime Hill Station Location
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Panchur Hills is Perfect for You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the unmatched advantages of owning premium plots in one of Uttarakhand's 
            most pristine and rapidly developing hill station locations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locationFeatures.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                  <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                    {feature.highlight}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Distance Information */}
        <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Clock className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Strategic Connectivity</h3>
            <p className="text-gray-600">Easy access from major cities and hill stations</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">4 Hours</div>
              <div className="text-gray-700 font-medium">From Delhi</div>
              <div className="text-sm text-gray-500">Via Express Highway</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">2 Hours</div>
              <div className="text-gray-700 font-medium">From Rishikesh</div>
              <div className="text-sm text-gray-500">Mountain Route</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">45 Mins</div>
              <div className="text-gray-700 font-medium">To Lansdowne</div>
              <div className="text-sm text-gray-500">Hill Station</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">1 Hour</div>
              <div className="text-gray-700 font-medium">To Pauri</div>
              <div className="text-sm text-gray-500">District Headquarters</div>
            </div>
          </div>
        </div>

        {/* Environmental Benefits */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
          <TreePine className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Pure Himalayan Environment</h3>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Experience crystal clear mountain air, pristine natural surroundings, and the therapeutic 
            benefits of high-altitude living in one of India's most beautiful hill stations.
          </p>
        </div>
      </div>
    </section>
  );
}