import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Mountain, 
  Plane, 
  Train, 
  MapPin,
  TreePine,
  Leaf,
  Wind
} from "lucide-react";

export default function PanchurLocationAdvantages() {
  return (
    <section id="location" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Location Advantages
          </h2>
          <p className="text-xl text-gray-600">
            Strategic location in Pauri Garhwal with excellent connectivity to major cities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Distance from Delhi</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">354 km</div>
              <div className="text-gray-600">7-8 hours drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Distance from Rishikesh</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">114 km</div>
              <div className="text-gray-600">3 hours drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Janasu Railway Station</h3>
              <div className="text-2xl font-bold text-purple-600 mb-1">Coming Soon</div>
              <div className="text-gray-600">Future connectivity</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Elevation</h3>
              <div className="text-2xl font-bold text-orange-600 mb-1">1,115m</div>
              <div className="text-gray-600">Above sea level</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Location Information */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Why Choose Panchur Hills?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Strategic Location</h4>
                  <p className="text-gray-600">Located in the scenic Pauri Garhwal district with excellent accessibility</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mountain className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Hill Station Benefits</h4>
                  <p className="text-gray-600">Cool climate year-round with breathtaking Himalayan views</p>
                </div>
              </div>
              <div className="flex items-start">
                <TreePine className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Natural Environment</h4>
                  <p className="text-gray-600">Surrounded by forests and pristine natural beauty</p>
                </div>
              </div>
              <div className="flex items-start">
                <Leaf className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Agricultural Potential</h4>
                  <p className="text-gray-600">Fertile mountain soil perfect for organic farming and agriculture</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Connectivity Highlights</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Delhi</span>
                  <span className="font-semibold text-gray-900">354 km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Rishikesh</span>
                  <span className="font-semibold text-gray-900">114 km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Kotdwar</span>
                  <span className="font-semibold text-gray-900">75 km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Pauri</span>
                  <span className="font-semibold text-gray-900">25 km</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Elevation</span>
                  <span className="font-semibold text-green-600">1,115m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}