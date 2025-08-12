import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Mountain, 
  Plane, 
  Train, 
  Hospital, 
  MapPin,
  Bus,
  TreePine,
  Leaf,
  Wind
} from "lucide-react";

export default function LocationAdvantages() {

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Location Advantages
          </h2>
          <p className="text-xl text-gray-600">
            Due to land scarcity in Dehradun, Khushalipur is now the first choice of investors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Distance from Delhi</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">220 km</div>
              <div className="text-gray-600">2 hours drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Distance from Dehradun</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">13 km</div>
              <div className="text-gray-600">20 minutes drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Jolly Grant Airport</h3>
              <div className="text-2xl font-bold text-purple-600 mb-1">60 km</div>
              <div className="text-gray-600">1 hour drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Railway Station</h3>
              <div className="text-2xl font-bold text-orange-600 mb-1">15 km</div>
              <div className="text-gray-600">Dehradun Station</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Location Information */}
        <Card className="bg-gray-50 border-gray-200 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Connectivity Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Delhi-Dehradun Expressway</div>
                      <div className="text-sm text-gray-600">Direct highway connection</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TreePine className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Mussoorie Hills</div>
                      <div className="text-sm text-gray-600">52 km scenic drive</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Hospital className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Hospitals & Schools</div>
                      <div className="text-sm text-gray-600">5-10 km radius</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Local Amenities</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Hospital className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">NCR Connectivity</div>
                      <div className="text-sm text-gray-600">220 km distance</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Bus className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Bus Stop</div>
                      <div className="text-sm text-gray-600">Just 1 km away</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="flex items-center">
                      <Wind className="text-teal-500 w-6 h-6 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">Natural Environment</div>
                        <div className="text-sm text-gray-600">Clean Air & Pollution-free</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Leaf className="text-green-500 w-6 h-6 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">Green Surroundings</div>
                        <div className="text-sm text-gray-600">Agricultural landscape</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}