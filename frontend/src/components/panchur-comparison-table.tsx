import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mountain, MapPin, Zap } from "lucide-react";

export default function PanchurComparisonTable() {
  const comparisonData = [
    {
      feature: "Location",
      panchur: "Pauri Garhwal, Uttarakhand",
      competitor1: "Dehradun Plains",
      competitor2: "Haridwar Area",
      panchurAdvantage: true
    },
    {
      feature: "Elevation",
      panchur: "1,115m (Hill Station)",
      competitor1: "640m (Plains)",
      competitor2: "314m (Plains)",
      panchurAdvantage: true
    },
    {
      feature: "Price per sq ft",
      panchur: "₹3,900 - ₹4,900",
      competitor1: "₹8,000 - ₹12,000",
      competitor2: "₹6,000 - ₹9,000",
      panchurAdvantage: true
    },
    {
      feature: "Climate",
      panchur: "Cool Hill Station",
      competitor1: "Hot Plains",
      competitor2: "Hot Plains",
      panchurAdvantage: true
    },
    {
      feature: "Mountain Views",
      panchur: "Himalayan Views",
      competitor1: "No Mountain Views",
      competitor2: "No Mountain Views",
      panchurAdvantage: true
    },
    {
      feature: "Air Quality",
      panchur: "Pure Mountain Air",
      competitor1: "Urban Pollution",
      competitor2: "Industrial Pollution",
      panchurAdvantage: true
    },
    {
      feature: "Tourism Potential",
      panchur: "High (Hill Station)",
      competitor1: "Medium",
      competitor2: "Medium",
      panchurAdvantage: true
    },
    {
      feature: "Agriculture Potential",
      panchur: "Organic/High Value",
      competitor1: "Traditional",
      competitor2: "Traditional",
      panchurAdvantage: true
    },
    {
      feature: "Distance from Delhi",
      panchur: "354 km",
      competitor1: "220 km",
      competitor2: "180 km",
      panchurAdvantage: false
    },
    {
      feature: "Infrastructure",
      panchur: "Ready",
      competitor1: "Ready",
      competitor2: "Ready",
      panchurAdvantage: false
    }
  ];

  return (
    <section id="comparison" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Panchur Hills?
          </h2>
          <p className="text-xl text-gray-600">
            Compare Panchur Hills with other investment options in Uttarakhand
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="overflow-hidden shadow-xl border-0 mb-12 animate-fade-in-up">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-left p-4 font-semibold">
                      <div className="flex items-center">
                        <Mountain className="w-5 h-5 mr-2" />
                        Panchur Hills
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold">Dehradun Plains</th>
                    <th className="text-left p-4 font-semibold">Haridwar Area</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr 
                      key={row.feature}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {row.panchurAdvantage && (
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                          )}
                          <span className={`${row.panchurAdvantage ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                            {row.panchur}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{row.competitor1}</td>
                      <td className="p-4 text-gray-600">{row.competitor2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Advantages Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hill Station Premium</h3>
              <p className="text-gray-600 mb-4">
                1,115m elevation with cool climate year-round and stunning Himalayan views
              </p>
              <Badge className="bg-green-600 text-white">Best Value</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Strategic Location</h3>
              <p className="text-gray-600 mb-4">
                Excellent connectivity to major cities with growing tourism infrastructure
              </p>
              <Badge className="bg-blue-600 text-white">High Growth</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Future Ready</h3>
              <p className="text-gray-600 mb-4">
                All infrastructure ready with upcoming railway connectivity at Janasu
              </p>
              <Badge className="bg-purple-600 text-white">Future Proof</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Invest in Panchur Hills?</h3>
            <p className="text-lg opacity-90 mb-6">
              Join smart investors who chose hill station properties for better returns and lifestyle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/book-visit"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Schedule Site Visit
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Get More Information
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}