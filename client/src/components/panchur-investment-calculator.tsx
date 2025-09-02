import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Shield, MapPin, Mountain } from "lucide-react";

interface CalculationResult {
  totalInvestment: number;
  expectedValue: number;
  estimatedReturns: number;
}

export default function PanchurInvestmentCalculator() {
  const [plotSize, setPlotSize] = useState<string>("");
  const [ratePerSqft, setRatePerSqft] = useState<string>("");
  const [investmentPeriod, setInvestmentPeriod] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateInvestment = () => {
    if (!plotSize || !ratePerSqft || !investmentPeriod) {
      return;
    }

    const size = parseFloat(plotSize);
    const rate = parseFloat(ratePerSqft);
    const period = parseFloat(investmentPeriod);

    const totalInvestment = size * rate;
    const annualReturn = 0.15; // 15% average for mountain properties
    const expectedValue = totalInvestment * Math.pow(1 + annualReturn, period);
    const estimatedReturns = expectedValue - totalInvestment;

    setResult({
      totalInvestment,
      expectedValue,
      estimatedReturns
    });
  };

  const formatCurrency = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const investmentBenefits = [
    {
      icon: TrendingUp,
      title: "12-15% Annual Returns",
      description: "Expected returns from hill station properties",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Shield,
      title: "Safe Investment",
      description: "Agricultural land with clear titles",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Mountain,
      title: "Hill Station Premium",
      description: "Properties appreciate faster in mountains",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: MapPin,
      title: "Strategic Location",
      description: "Growing tourism in Uttarakhand",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Investment Calculator
          </h2>
          <p className="text-xl text-gray-600">
            Calculate your potential returns from Panchur Hills Premium Plots
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Form */}
          <Card className="bg-white shadow-xl border-0 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Calculate Returns</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Size (sq ft)
                  </label>
                  <Select value={plotSize} onValueChange={setPlotSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select plot size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1,000 sq ft</SelectItem>
                      <SelectItem value="2000">2,000 sq ft</SelectItem>
                      <SelectItem value="3000">3,000 sq ft</SelectItem>
                      <SelectItem value="4000">4,000 sq ft</SelectItem>
                      <SelectItem value="5000">5,000 sq ft</SelectItem>
                      <SelectItem value="10000">10,000 sq ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate per sq ft
                  </label>
                  <Select value={ratePerSqft} onValueChange={setRatePerSqft}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select rate per sq ft" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3900">₹3,900 per sq ft</SelectItem>
                      <SelectItem value="4200">₹4,200 per sq ft</SelectItem>
                      <SelectItem value="4500">₹4,500 per sq ft</SelectItem>
                      <SelectItem value="4900">₹4,900 per sq ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Period
                  </label>
                  <Select value={investmentPeriod} onValueChange={setInvestmentPeriod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select investment period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={calculateInvestment}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={!plotSize || !ratePerSqft || !investmentPeriod}
                  data-testid="calculate-returns"
                >
                  Calculate Investment Returns
                </Button>
              </div>

              {/* Results */}
              {result && (
                <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 animate-fade-in-up">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Results</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Investment:</span>
                      <span className="font-bold text-gray-900">{formatCurrency(result.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expected Value:</span>
                      <span className="font-bold text-green-600">{formatCurrency(result.expectedValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Returns:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(result.estimatedReturns)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Investment Benefits */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Why Invest in Panchur Hills?
            </h3>
            <div className="grid gap-6">
              {investmentBenefits.map((benefit, index) => (
                <Card key={benefit.title} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pricing Information */}
            <Card className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <h4 className="text-2xl font-bold mb-4">Current Pricing</h4>
                <div className="text-4xl font-bold mb-2">₹3,900 - ₹4,900</div>
                <div className="text-lg opacity-90 mb-4">per sq ft</div>
                <p className="opacity-80">
                  Premium hill station plots with Himalayan views and excellent connectivity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}