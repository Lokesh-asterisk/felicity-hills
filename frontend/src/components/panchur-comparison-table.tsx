import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mountain, Sparkles, Star, Crown, Award } from "lucide-react";

const comparisonData = [
  {
    feature: "Location Altitude",
    panchur: "4,500 feet above sea level",
    others: "Lower elevation plains",
    advantage: true
  },
  {
    feature: "Climate",
    panchur: "Pleasant year-round, 15-25°C",
    others: "Hot summers, cold winters",
    advantage: true
  },
  {
    feature: "Mountain Views",
    panchur: "360° Himalayan peak views",
    others: "Limited or no mountain views",
    advantage: true
  },
  {
    feature: "Air Quality",
    panchur: "Crystal clear mountain air",
    others: "Urban pollution levels",
    advantage: true
  },
  {
    feature: "Investment Returns",
    panchur: "25-35% expected growth",
    others: "10-15% typical growth",
    advantage: true
  },
  {
    feature: "Plot Sizes",
    panchur: "500-2000 sq yd options",
    others: "200-500 sq yd typical",
    advantage: true
  },
  {
    feature: "Premium Amenities",
    panchur: "Luxury spa, infinity pool, clubhouse",
    others: "Basic community facilities",
    advantage: true
  },
  {
    feature: "Connectivity",
    panchur: "4 hours from Delhi via highway",
    others: "Similar or longer distances",
    advantage: false
  },
  {
    feature: "Development Stage",
    panchur: "Planned premium community",
    others: "Established but basic",
    advantage: true
  },
  {
    feature: "Natural Environment",
    panchur: "Pristine deodar forests",
    others: "Developed/disturbed landscape",
    advantage: true
  }
];

const advantages = [
  {
    title: "Himalayan Luxury Living",
    description: "Experience the rare combination of luxury amenities at high altitude",
    icon: Mountain,
    highlights: ["4,500 ft elevation", "Panoramic mountain views", "Premium climate"]
  },
  {
    title: "Exclusive Hill Station Community",
    description: "Be part of an elite residential community in pristine natural setting",
    icon: Crown,
    highlights: ["Limited exclusive plots", "High-end clientele", "Premium lifestyle"]
  },
  {
    title: "Superior Investment Potential",
    description: "Higher growth potential due to unique location and premium positioning",
    icon: Award,
    highlights: ["25-35% expected returns", "Scarcity value", "Tourism growth"]
  }
];

export default function PanchurComparisonTable() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="plots" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="inline-flex items-center mb-4 bg-blue-100 text-blue-800">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Hill Station Advantage
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Panchur Hills Stands Apart
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare the unique advantages of investing in premium hill station plots 
            versus typical plain-area developments.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid md:grid-cols-3 gap-0">
            {/* Header */}
            <div className="bg-gray-50 p-6 font-semibold text-gray-900 border-r border-gray-200">
              Comparison Features
            </div>
            <div className="bg-blue-600 p-6 font-semibold text-white text-center border-r border-blue-700">
              <Mountain className="h-6 w-6 inline-block mr-2" />
              Panchur Hills Premium
            </div>
            <div className="bg-gray-100 p-6 font-semibold text-gray-700 text-center">
              Typical Plain Area Projects
            </div>

            {/* Comparison Rows */}
            {comparisonData.map((item, index) => (
              <div key={index} className="contents">
                <div className="p-4 border-r border-gray-200 border-b border-gray-100 font-medium">
                  {item.feature}
                </div>
                <div className={`p-4 border-r border-b ${item.advantage ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'} text-center`}>
                  <div className="flex items-center justify-center">
                    {item.advantage ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{item.panchur}</span>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-100 text-center">
                  <div className="flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{item.others}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Advantages */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {advantages.map((advantage, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <advantage.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">{advantage.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {advantage.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {advantage.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plot Size Options */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plot Options</h3>
            <p className="text-gray-600">Choose from our carefully planned plot sizes to suit your vision</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">500-750</div>
              <div className="text-gray-700 font-medium">Sq Yd</div>
              <div className="text-sm text-gray-500 mt-1">Luxury Cottage Plots</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">750-1000</div>
              <div className="text-gray-700 font-medium">Sq Yd</div>
              <div className="text-sm text-gray-500 mt-1">Premium Villa Plots</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">1000-1500</div>
              <div className="text-gray-700 font-medium">Sq Yd</div>
              <div className="text-sm text-gray-500 mt-1">Executive Estate Plots</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">1500-2000</div>
              <div className="text-gray-700 font-medium">Sq Yd</div>
              <div className="text-sm text-gray-500 mt-1">Ultra-Luxury Estates</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
          <Mountain className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Secure Your Premium Hill Station Plot</h3>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg mb-6">
            Limited exclusive plots available in this pristine Himalayan location. 
            Book your premium site visit to experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Book Premium Site Visit
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('calculator')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Calculate Investment Returns
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}