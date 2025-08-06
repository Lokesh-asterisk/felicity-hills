import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

export default function ComparisonTable() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Khushalipur?
          </h2>
          <p className="text-xl text-gray-600">
            Comparison with other projects - See how we are better
          </p>
        </div>

        <Card className="shadow-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Features</th>
                  <th className="px-6 py-4 text-center font-semibold">Khushalipur</th>
                  <th className="px-6 py-4 text-center font-semibold">Other Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Starting Price</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">₹8,100/गज</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-500">₹12,000-15,000/गज</span>
                    </div>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Expected Returns</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">15-20% सालाना</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-500">8-12% सालाना</span>
                    </div>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Distance from Delhi</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">220 किमी</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-500">300-400 किमी</span>
                    </div>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Legal Clarity</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">Complete Approvals</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-500">Partial/Unclear</span>
                    </div>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">EMI Facility</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">Available</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-500">Limited</span>
                    </div>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Development Status</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-semibold">Ready Infrastructure</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-500">Under Development</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-green-50 px-6 py-4 text-center border-t">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-green-600 mr-2" />
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg font-bold px-4 py-2">
                Clear Winner: Khushalipur is your best investment choice!
              </Badge>
            </div>
            <div className="text-green-700 font-medium">
              Better returns, lower price, complete legal clarity
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
